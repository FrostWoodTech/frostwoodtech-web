# FrostWoodTech — Clarity design system

> Superseded by the bold Elemental direction. See [the current design notes](../elemental/README.md). This document records the earlier concept.

Implemented 14 October 2026. The homepage is complete; the shared brand, navigation, footer, typography, tokens, and buttons establish the foundation for the remaining pages.

## Direction

An independent software studio with a precise, confident voice. Midnight blue frames the opening and closing; cool white and blue-grey create breathing room in the body. A six-arm faceted vector snowflake is the signature. Its construction lines and the layered software diagram connect the winter identity to engineering, without seasonal decoration.

The narrative moves from positioning to capabilities, working principles, published evidence when available, process, and an invitation to talk. Large open service rows, an illustrated studio section, and an interactive process avoid repeated card grids.

## Research

- [Linear](https://linear.app/): studied the strong sans-serif hierarchy, quiet navigation, dark neutral surfaces, and product-led storytelling. Takeaway: precise type and actual substance create confidence.
- [Vercel](https://vercel.com/): studied the generous spacing, restrained geometry, compact navigation, and progressive explanations. Takeaway: make a recognizable geometric mark do useful brand work.
- [Stripe](https://stripe.com/): studied the layered opening composition, clear actions, varied section rhythm, and responsive navigation. Takeaway: combine expressive visuals with a legible conversion path.
- [Raycast](https://www.raycast.com/): studied the short positioning statement and focused dark presentation. Takeaway: give the opening a single clear message.

These references informed principles, not copied layouts or brand assets. The snowflake and architecture diagram are original SVG/CSS constructions.

## Tokens and use

Tokens live in `src/client/styles/clarity.css` under `.client-site`; admin theme values are unaffected.

| Token           | Value     | Use                                    |
| --------------- | --------- | -------------------------------------- |
| `--fw-midnight` | `#0C1728` | Hero, navigation, footer, dark buttons |
| `--fw-navy`     | `#122239` | Supporting dark surfaces               |
| `--fw-snow`     | `#F8FAFC` | Main page surface                      |
| `--fw-ice`      | `#BCE8FA` | Accent text on dark, primary CTA fills |
| `--fw-ink`      | `#14243A` | Light-surface headings                 |
| `--fw-muted`    | `#536478` | Body copy                              |
| `--fw-line`     | `#DBE2E9` | Dividers and borders                   |
| `--fw-blue`     | `#24597A` | Readable light-surface accent          |
| `--fw-radius`   | `6px`     | Controls                               |

Manrope is the public display and body family, with system monospace for small section labels. Use medium-weight, tightly tracked headings; 1.75–1.9 body leading; and restrained uppercase labels. Ice text belongs on dark backgrounds. Muted large headings use `#68798B`; small labels use the darker `#48677E`.

`fw-shell` caps the content at 1280px with responsive gutters. Section spacing is 116px on desktop, 90px on tablet, and 72px on phones. Mobile layouts stack at 767px; navigation switches to a modal menu below 1100px. Components use descriptive `fw-` classes to keep marketing styling out of admin screens.

## Components and behavior

- `FrostCrystal`: static, resolution-independent signature artwork with no external image, video, WebGL, or animation dependency.
- `HomeServices`: existing featured-service API data and original detail routes; existing service categories provide an offline fallback.
- `StudioApproach`: company description and values supported by existing content.
- `HomeEvidence`: only published projects, products, and reviews. No client-logo placeholders, invented metrics, fabricated reviews, or fictional products.
- Product tabs retain previous/next wrapping, arrow-key/Home/End navigation, selection clamping, detail links, external links, and published price text.
- `HomeProcess`: keyboard-operable disclosure buttons with expanded state and labelled regions.
- Navigation: native modal dialog, Escape dismissal, background inertness, focus restoration, and desktop-resize cleanup.
- Footer: all real existing destinations and social profiles. Unconfigured contact details and dead `#` legal links are not presented as real destinations.
- Shared router: all 46 path entries preserved. Secondary pages are downloaded on demand; page scroll restoration and an initial loading state are included.

## Accessibility and performance

Visible keyboard focus, a skip link, a single homepage h1, semantic sections, text labels for rating graphics, responsive imagery, and reduced-motion rules are included. Decorative visuals are hidden from screen readers. Motion is limited to small hover/control transitions; reduced-motion disables it.

Body text contrasts at 5.80:1 against Snow and 5.28:1 against the studio surface. Ice against Midnight contrasts at 13.74:1. Small labels were darkened after checking the rendered page.

No dependencies were added. Route splitting reduced initial production JavaScript from roughly 2.59 MB / 746 kB gzip to about 452 kB / 147 kB gzip across the entry and its preloads. Large markdown-editor and country-data chunks remain deferred to the pages that need them.

## Verification

- Production TypeScript and Vite builds pass.
- 196 tests pass, including four homepage integration checks for API request contracts, published-content rendering, safe offline behavior, and product keyboard/carousel behavior.
- Browser review covers desktop, tablet, and 390px/320px phones; no horizontal document overflow was found.
- Verified homepage CTAs, service navigation, mobile menu, Escape/focus restoration, process disclosure, back-to-top, and the unchanged contact form's required-field validation.
- Backend source, API service modules, hooks, validation, and form submission logic are unchanged.

The configured local API at `http://localhost:7060/api/cms` was not running during review. Live content retrieval and successful contact delivery therefore remain unverified. Tests exercise the original request contracts with explicitly test-only fixtures; no sample records were inserted into the application or backend.
