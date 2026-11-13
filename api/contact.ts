/**
 * Vercel serverless function: POST /api/contact.
 * Env (set in Vercel): CONTACT_TO (comma-separated recipients), CONTACT_FROM (a sender on a domain
 * authenticated with the provider, e.g. "FrostWoodTech <enquiries@frostwoodtech.com>"), and either
 * BREVO_API_KEY or RESEND_API_KEY (Brevo wins when both are set).
 */

const BUDGETS: Record<string, string> = {
  under_one_k: "Under $1,000",
  one_to_five_k: "$1,000 – $5,000",
  five_to_fifteen_k: "$5,000 – $15,000",
  over_fifteen_k: "$15,000+",
  not_sure: "Not sure yet",
};

const LIMITS = {
  name: 120,
  email: 254,
  phone: 40,
  company: 120,
  subject: 160,
  serviceName: 120,
  message: 5000,
} as const;

// Best effort only: each warm function instance keeps its own counts.
const WINDOW_MS = 60 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const hits = new Map<string, number[]>();

function json(body: Record<string, unknown>, status = 200): Response {
  return Response.json(body, { status });
}

function tooMany(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((time) => now - time < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > MAX_PER_WINDOW;
}

/** A trimmed string within `max` characters, or undefined when blank or not a string. */
function field(value: unknown, max: number): string | undefined {
  if (typeof value !== "string") return undefined;
  const text = value.trim();
  return text ? text.slice(0, max) : undefined;
}

/** Single line, so a visitor can't inject extra headers through a subject or name. */
const oneLine = (value: string) => value.replace(/[\r\n]+/g, " ");

const escapeHtml = (value: string) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");

interface Mail {
  readonly from: string;
  readonly to: readonly string[];
  readonly replyTo: string;
  readonly subject: string;
  readonly html: string;
  readonly text: string;
}

/** "Name <a@b.com>" or a bare address. */
function parseSender(from: string): { name?: string; email: string } {
  const match = /^\s*(.*?)\s*<([^>]+)>\s*$/.exec(from);
  return match
    ? { name: match[1] || undefined, email: match[2] }
    : { email: from.trim() };
}

const sendWithBrevo = (apiKey: string, mail: Mail) =>
  fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: { "api-key": apiKey, "Content-Type": "application/json" },
    body: JSON.stringify({
      sender: parseSender(mail.from),
      to: mail.to.map((email) => ({ email })),
      replyTo: { email: mail.replyTo },
      subject: mail.subject,
      htmlContent: mail.html,
      textContent: mail.text,
    }),
  });

const sendWithResend = (apiKey: string, mail: Mail) =>
  fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: mail.from,
      to: mail.to,
      reply_to: mail.replyTo,
      subject: mail.subject,
      html: mail.html,
      text: mail.text,
    }),
  });

export async function POST(request: Request): Promise<Response> {
  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return json({ error: "That request couldn't be read." }, 400);
  }

  // Bots fill the hidden field; answer normally so they learn nothing.
  if (typeof body.website === "string" && body.website !== "") {
    return json({ ok: true });
  }

  const name = field(body.name, LIMITS.name);
  const email = field(body.email, LIMITS.email);
  const message = field(body.message, LIMITS.message);
  if (!name) return json({ error: "Name is required." }, 400);
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return json({ error: "A valid email is required." }, 400);
  }
  if (!message) return json({ error: "Message is required." }, 400);

  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (tooMany(ip)) {
    return json(
      { error: "Too many enquiries from this address. Try again later." },
      429,
    );
  }

  const brevoKey = process.env.BREVO_API_KEY;
  const resendKey = process.env.RESEND_API_KEY;
  const from = process.env.CONTACT_FROM;
  const to = (process.env.CONTACT_TO ?? "")
    .split(/[,;]/)
    .map((address) => address.trim())
    .filter((address) => address.includes("@"));
  if ((!brevoKey && !resendKey) || !from || to.length === 0) {
    console.error(
      "Contact function is missing a provider key (BREVO_API_KEY or RESEND_API_KEY), CONTACT_FROM or CONTACT_TO.",
    );
    return json({ error: "Enquiries are not set up yet." }, 500);
  }

  const phone = field(body.phone, LIMITS.phone);
  const company = field(body.company, LIMITS.company);
  const subject = field(body.subject, LIMITS.subject);
  const serviceName = field(body.serviceName, LIMITS.serviceName);
  const budget =
    typeof body.budgetRange === "string"
      ? BUDGETS[body.budgetRange]
      : undefined;

  const details: [string, string | undefined][] = [
    ["Name", name],
    ["Email", email],
    ["Phone", phone],
    ["Company", company],
    ["Interested in", serviceName],
    ["Budget", budget],
  ];
  const shown = details.filter(
    (row): row is [string, string] => row[1] !== undefined,
  );

  const html =
    `<h2 style="margin:0 0 16px">New enquiry</h2>` +
    `<table cellpadding="6" style="border-collapse:collapse">` +
    shown
      .map(
        ([label, value]) =>
          `<tr><td><strong>${label}</strong></td><td>${escapeHtml(value)}</td></tr>`,
      )
      .join("") +
    `</table>` +
    `<p style="margin:20px 0 4px"><strong>Message</strong></p>` +
    `<p style="white-space:pre-wrap;margin:0">${escapeHtml(message)}</p>`;

  const text =
    shown.map(([label, value]) => `${label}: ${value}`).join("\n") +
    `\n\nMessage:\n${message}`;

  const mail = {
    from,
    to,
    replyTo: email,
    subject: oneLine(`${subject ?? "New enquiry"} — ${name}`),
    html,
    text,
  };

  const provider = brevoKey ? "Brevo" : "Resend";
  let response: Response;
  try {
    response = brevoKey
      ? await sendWithBrevo(brevoKey, mail)
      : await sendWithResend(resendKey!, mail);
  } catch (error) {
    console.error(`${provider} could not be reached.`, error);
    return json({ error: "We couldn't send that. Please try again." }, 502);
  }

  if (!response.ok) {
    console.error(
      `${provider} rejected the enquiry (${response.status}):`,
      await response.text(),
    );
    return json({ error: "We couldn't send that. Please try again." }, 502);
  }

  return json({ ok: true });
}
