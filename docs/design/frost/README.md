# Frost design — snapshot (October 2026)

The FrostWoodTech client site as it stood on 2026-10-13, saved so it can be restored or rebuilt for the
Christmas season. The code is frozen at git tag **`design/frost-v1`** (commit `705a1fc`, branch
`feature/bold-modern-redesign`, already on GitHub).

## How to bring it back

```bash
git fetch --all --tags
git switch -c christmas-frost design/frost-v1   # new branch from the snapshot
npm install && npm run dev
```

To copy only the client site onto a newer branch, take `src/client/`, `src/index.css`,
`src/client/lib/glslCommon.ts` and `src/routes/` from the tag (`git checkout design/frost-v1 -- <path>`). Then
re-run `npm run build`, because the API types in `src/client/types.ts` may have moved on.

Screenshots belong in [`screenshots/`](screenshots/). See the shot list at the end.

---

## 1. Direction

- **Mood:** corporate and calm, but plain enough for non-technical visitors. It feels like clear ice on snow,
  premium and quiet, never "techy". **Light theme only.**
- **Voice:** a big serif headline whose second line is a *blue italic* emphasis. The copy is short, plain
  English and benefit-first ("Go live in weeks, not months").
- **What the owner loved:** staggered, off-grid layouts; small drawings that explain things to
  non-tech people; gentle snow and ice motion; the "What you get" glass snowflake; the services bento
  ("fantastic"); the snowfall CTA ("Wow").
- **What was rejected:** basic or "AI-looking" mockups, plain equal-card grids, a WebGL icon at small sizes
  ("No, more simple icon"), and any animated hero background (it must stay **still**).

## 2. Colour tokens (`src/index.css` → `@theme`)

| Token | Hex | Use |
|---|---|---|
| `snow` | `#FCFDFF` | page background |
| `mist` | `#F4F8FC` | alt band, hover fills |
| `ice` | `#7DB7FF` | **decorative only** (lines, glows, flakes); ≈2.2:1, so never use it for text |
| `ice-wash` | `#EAF3FF` | icon tiles, soft fills, footer gradient end |
| `blue` | `#2464A5` | accent text, links, the italic emphasis line, focus rings |
| `ink` | `#152840` | headings, body emphasis, primary button |
| `slate` | `#52657C` | body text (≥4.5:1 on all backgrounds) |
| `rule` | `#D9E4EF` | hairlines and borders |
| `star` | `#FFCC00` | Apple yellow, for review stars only (plus an aria-label) |

Other values: a glacier cyan `#8EDCF2` (only in the hero shader), the glint highlight `#6AA6EA`, and the
snow-dot fill `rgb(91 157 235 / .6)`.

Shadows: `--shadow-card: 0 1px 2px rgb(21 40 64/.04), 0 18px 40px -26px rgb(21 40 64/.18)`.
`--shadow-btn: 0 10px 24px -14px rgb(21 40 64/.45)`.

## 3. Typography

- **Instrument Serif** (`font-display`), for display only. It has a single 400 weight plus italic, so never
  make it bold. Tracking is tight, from `-0.02em` to `-0.052em`. The emphasis line is `<em>` in `text-blue`.
- **Manrope** (`font-sans`, weights 400–800), for UI and body text. Body is 16–18px with `leading-8`, in Slate.
- **Eyebrows:** 13px, bold, `tracking-[0.015em]`, `text-blue`, sentence case (never uppercase).
- **Scale:**

  | Element | Size |
  |---|---|
  | Hero h1 | 56 / 96 / 112 / 140px, `leading-[0.87]` |
  | Section h2 | about 40–56px |
  | Footer headline | 34–44px |
  | Giant footer wordmark | `clamp(64px, 16.5vw, 220px)` |

## 4. Motifs and surfaces

- **60° frost cut:** thin Ice lines at 120deg, `repeating-linear-gradient(120deg, transparent 0 26px,
  rgb(125 183 255/.1) 26px 27px)`, often masked to fade. They also appear as reflection streaks on the
  glass header, the hexagon angles and the snowflakes.
- **Glass:** the `.glass-bar` header pill (a white-to-ice gradient, `blur(14px) saturate(1.4)`, an inset
  highlight, 60° streaks and grain). The `.ice-pane` slabs (skewed −30°) are styled but unused, kept for a
  later section.
- **Grain:** `--fw-noise` (an SVG fractalNoise tile) at 5–10% opacity in overlay mode.
- **Snowflakes:** `ui/SnowflakeIcon.tsx` has `simple`, `branched` and `star` variants (SVG strokes). Keep
  them simple and high-contrast at small sizes.
- **Backgrounds:** only the Home hero has the frosted-ice background. Every other section is plain white or
  Snow. The footer is the one band with a Snow → Ice Wash gradient.
- **Radii:** cards `rounded-2xl` / `rounded-3xl`; buttons and chips `rounded-full`.
- **Container:** `max-w-7xl px-4 sm:px-6 lg:px-8`; sections `py-24 lg:py-32`.

## 5. Home, section by section (`src/client/pages/Home.tsx`)

The order is Hero → TrustedBy → What you get → Metrics → Services → Brand statement → Products →
Pricing strip → Reviews wall → Snowfall CTA → Footer.

1. **Header** (`header/`)
   - A floating white glass pill: sticky, `h-16 lg:h-18`, `rounded-full`, max-w-7xl.
   - Logo and nav on the left, a navy **"Talk to us"** pill button (`bg-ink`, `hover:bg-blue`, h-12) on the
     right.
   - It lifts with a deeper shadow once the page scrolls (`data-scrolled`).
2. **Hero** (`hero/Hero.tsx`, `background/`)
   - An editorial layout: a blue kicker ("Software studio · Products & platforms").
   - The huge serif h1 reads "Software made / for a *clearer* future."
   - Below it, a two-column row: the description on the left, and on the right a quote aside with an
     `border-l border-ice` rule ("The person you meet … is the person who builds it." · "A small,
     senior team. Founded in 2019.").
   - Behind it, and reaching up behind the header, is `IceGlassBackground`. It is a WebGL2 frost shader
     painted **once** (no animation), with a CSS gradient and grain as the fallback. All of its settings are
     in `iceConfig.ts`: the palette above plus cyan, `glowStrength .32`, `navyDepth .06`,
     `minLuminance .75` (the contrast guard), `seed 3.7` and `pixelRatioCap 1.5`.
3. **TrustedBy:** a muted row of client wordmarks in `--color-mark #98A7B7`. The names are placeholders.
4. **What you get** (`partnering/`)
   - On the left, a WebGL2 **glass snowflake**: an SDF crystal with six arms of uneven length, Fresnel
     edges, an orbiting light, sparkles and drifting `.ice-snow` dots.
   - Four `FrostCard` chips are **staggered** around it (Launch faster, Fixed price, Yours to keep, Grows
     with you). The active chip scales to 1.2 with an ice ring.
   - On the right, an eyebrow, the active item's serif title and description (`.ice-text-in`), plus
     pill-dot pagination and a next button. It auto-advances.
   - On phones, the chips become a horizontal snap-scroll row.
   - The shader is in `snowflakeShader.ts`, with `ARM_LENGTH = [.96,.92,1,.86,1,.88]`, wired up through
     `useSnowflakeRenderer`.
5. **Metrics:** 40+ products shipped, 98% returning clients, 99.98% uptime and a 6-week median to first
   release. Large numbers with coloured suffixes.
6. **Services** (`services/`)
   - A **bento** grid where wide and narrow cards alternate (the wide ones are index % 4 equal to 0 or 3).
   - Each card has a small Frost SVG drawing (`ServiceVisual`): a browser for websites, a phone for mobile,
     a workflow with dashes that run on hover for systems, and an uptime panel with a pulsing dot for cloud.
     Floating tags drift on hover.
   - Header: "Everything you need, / *built by one team.*"
7. **Brand statement** (`statement/`)
   - A centred serif line, "Software with the *clarity of ice* / engineered to grow."
   - The lines rise in on scroll (`.statement-reveal`), and then the blue phrase catches one light **glint**
     (`.statement-glint`).
   - `SnowflakeBadge`: a white SVG snowflake on a light-blue gradient circle.
8. **Products showcase** (`products/`)
   - Tabs (WAI-ARIA) for FrostBook, FrostStock and FrostDesk, with prev/next and a cross-fade.
   - Each tab shows an illustrated product "screen" (`ProductScreenDrawing`: bookings, inventory and
     support) with pop-up toasts (`screenToasts.ts`).
   - Header: "Ready-made software, / *ready when you are.*"
9. **Pricing strip** (`pricing/PricingTeaser.tsx`)
   - A hairline strip laid out like the stats, with four promises: **Free** first chat & quote · **Fixed**
     price agreed upfront · **$0** hidden fees · **$19/mo** products from.
   - Header: "Transparent pricing, / *for every project.*"
10. **Reviews wall** (`testimonial/ReviewWall.tsx`)
    - A staggered wall: one featured large card plus compact cards, with yellow stars, initials avatars
      (`utils/initials.ts`) and country flags.
    - Header: "Loved by the people / *we build for.*"
11. **Snowfall CTA** (`cta/SnowCta.tsx`)
    - A frosted panel with small SVG flakes drifting down and sideways (`.cta-flake`, using `--sway`) and two
      large corner crystals turning over 90s (`.cta-crystal`).
    - "Let's build something / *that lasts a decade.*" with the buttons Start a project / See our work and
      the promises Fixed price · Proposal in 3 days · No commitment.
12. **Footer** (`footer/Footer.tsx`, site-wide)
    - A Snow → Ice Wash band with fading 60° lines.
    - Logo, the serif line "Clear, dependable software / *for growing businesses.*", a pulsing "Taking new
      projects" chip and a big email link.
    - Three link columns (Products, Services, Company), then a bottom bar with the copyright, legal links,
      round social buttons and "Back to top".
    - A giant frosted **FrostWoodTech** wordmark (an ice/60 → transparent text gradient), cropped at the
      bottom, with a thin branched snowflake.

## 6. Motion rules

- Everything is gentle: slow drifts, single glints and short rises. Nothing loops fast.
- **Every keyframe has a `prefers-reduced-motion` guard** (see the end of the Home blocks in `index.css`).
  With reduced motion, the flakes are static and visible, and the reveals show immediately.
- The hero background never animates.
- Reveal-on-scroll uses `IntersectionObserver` and sets `data-in-view`.

## 7. Accessibility rules that were kept

- Ice is never used for text. Body text is Slate and links are Blue.
- Every interactive element has the focus ring `focus-visible:ring-2 ring-blue ring-offset-2`.
- Decorative SVG and canvas elements are `aria-hidden`. Star ratings carry an aria-label.
- The hero shader's `minLuminance` keeps Slate text at ≥4.5:1.

## 8. Placeholders to replace before launch

- `PLACEHOLDER_SERVICES`, `PLACEHOLDER_PRODUCTS` and `PLACEHOLDER_REVIEWS` (the reviews are **invented**).
  They show only while the API returns nothing.
- The `TRUSTED_BY` client names (invented), the email `[hello@frostwoodtech.com]`, and the legal links
  (`#`).

## 9. Christmas ideas (not built yet)

The snow and ice language already fits the season. Here are some low-risk seasonal touches:
- denser snowfall in the CTA;
- a warm accent (a muted red or gold) used sparingly;
- a festive kicker in the hero;
- "Happy holidays" in the footer status chip;
- snowflakes settling on the footer wordmark.

## 10. Screenshot shot list (save into `screenshots/`)

Use a 1440px-wide desktop and a 390px phone.

1. `01-hero-desktop.png` / `01-hero-mobile.png`, with the header and hero.
2. `02-what-you-get.png`, with the snowflake and staggered chips.
3. `03-metrics-services.png`, with the bento cards (hover one so the tags drift).
4. `04-statement.png`
5. `05-products.png`, one per tab if possible.
6. `06-pricing-reviews.png`
7. `07-cta.png`
8. `08-footer-desktop.png` / `08-footer-mobile.png`
9. `00-full-page.png`, a full-page capture (in Chrome DevTools, Ctrl+Shift+P → "Capture full size
   screenshot").
