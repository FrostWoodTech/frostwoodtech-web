import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { POST } from "../api/contact";

const valid = {
  name: "Ada",
  email: "ada@example.com",
  message: "Hello <b>there</b>",
  serviceName: "Mobile applications",
  budgetRange: "one_to_five_k",
};

let ipCounter = 0;
const post = (body: unknown) =>
  POST(
    new Request("https://site.test/api/contact", {
      method: "POST",
      headers: { "x-forwarded-for": `198.51.100.${++ipCounter}` },
      body: typeof body === "string" ? body : JSON.stringify(body),
    }),
  );

describe("POST /api/contact", () => {
  const fetchMock = vi.fn();

  beforeEach(() => {
    vi.stubEnv("RESEND_API_KEY", "re_test");
    vi.stubEnv("CONTACT_FROM", "FrostWoodTech <enquiries@example.com>");
    vi.stubEnv("CONTACT_TO", "a@example.com, b@example.com ;c@example.com");
    fetchMock
      .mockReset()
      .mockResolvedValue(new Response("{}", { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  it("emails all three recipients in one send, replying to the visitor", async () => {
    const response = await post(valid);

    expect(response.status).toBe(200);
    const sent = JSON.parse(fetchMock.mock.calls[0][1].body);
    expect(sent.to).toEqual([
      "a@example.com",
      "b@example.com",
      "c@example.com",
    ]);
    expect(sent.reply_to).toBe("ada@example.com");
    expect(sent.subject).toBe("New enquiry — Ada");
    expect(sent.text).toContain("Interested in: Mobile applications");
    expect(sent.text).toContain("Budget: $1,000 – $5,000");
  });

  it("sends through Brevo, with a parsed sender, when its key is set", async () => {
    vi.stubEnv("BREVO_API_KEY", "xkeysib-test");
    const response = await post(valid);

    expect(response.status).toBe(200);
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe("https://api.brevo.com/v3/smtp/email");
    expect(init.headers["api-key"]).toBe("xkeysib-test");
    const sent = JSON.parse(init.body);
    expect(sent.sender).toEqual({
      name: "FrostWoodTech",
      email: "enquiries@example.com",
    });
    expect(sent.to).toEqual([
      { email: "a@example.com" },
      { email: "b@example.com" },
      { email: "c@example.com" },
    ]);
    expect(sent.replyTo).toEqual({ email: "ada@example.com" });
  });

  it("escapes the visitor's text in the HTML body", async () => {
    await post(valid);
    const sent = JSON.parse(fetchMock.mock.calls[0][1].body);
    expect(sent.html).toContain("Hello &lt;b&gt;there&lt;/b&gt;");
    expect(sent.html).not.toContain("<b>there</b>");
  });

  it("keeps a subject on one line", async () => {
    await post({ ...valid, subject: "Hi\r\nBcc: x@evil.test" });
    const sent = JSON.parse(fetchMock.mock.calls[0][1].body);
    expect(sent.subject).not.toMatch(/[\r\n]/);
  });

  it.each([
    [{ ...valid, name: " " }, "Name is required."],
    [{ ...valid, email: "nope" }, "A valid email is required."],
    [{ ...valid, message: "" }, "Message is required."],
  ])("rejects an invalid enquiry", async (body, error) => {
    const response = await post(body);
    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({ error });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("rejects a body that isn't JSON", async () => {
    expect((await post("not json")).status).toBe(400);
  });

  it("answers a honeypot hit normally without sending", async () => {
    const response = await post({ ...valid, website: "http://spam.test" });
    expect(response.status).toBe(200);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("limits one address to five enquiries an hour", async () => {
    const same = () =>
      POST(
        new Request("https://site.test/api/contact", {
          method: "POST",
          headers: { "x-forwarded-for": "203.0.113.9" },
          body: JSON.stringify(valid),
        }),
      );
    for (let i = 0; i < 5; i++) expect((await same()).status).toBe(200);
    expect((await same()).status).toBe(429);
  });

  it("returns 500 when the environment isn't set up", async () => {
    vi.stubEnv("CONTACT_TO", "");
    vi.spyOn(console, "error").mockImplementation(() => {});
    expect((await post(valid)).status).toBe(500);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("returns 502 when Resend refuses the message", async () => {
    fetchMock.mockResolvedValue(new Response("bad", { status: 403 }));
    vi.spyOn(console, "error").mockImplementation(() => {});
    expect((await post(valid)).status).toBe(502);
  });
});
