# FrostWoodTech — Elemental

The current homepage direction, implemented 14 October 2026. This replaces the earlier restrained Clarity concept in response to the request for a big, bold, richly colored technology brand.

## Visual direction

Oversized Manrope headings, an original cinematic frost-and-walnut sculpture, deep evergreen, electric cyan, saturated cobalt, warm ivory, and copper accents in the imagery. The homepage moves through a large image-led hero, a capabilities band, illustrative brands, service panels, a studio manifesto, substantial project imagery, an interactive product lab, client stories, process, and a large closing invitation.

The identity is grounded in the snowflake logo. There is no snowfall, decorative video, continuous animation, or heavy rendering library. Hover movement is short and disabled with reduced motion.

## References

- [Rootcode](https://rootcode.ai/): strong company positioning, significant project stories and proof sections. The current mobile page was inspected in the browser; its emphasis on a clear opening statement informed the storytelling, without borrowing its branding.
- [Allion Technologies](https://www.alliontechnologies.com/): project-led opening, prominent service coverage, delivery evidence and a full company narrative. Research informed the richer page structure.
- [Sysco LABS](https://syscolabs.lk/): supplied reference; the research tool returned no readable page content, so no unsupported observations are attributed to it.
- [99x](https://99x.io/): product engineering, team capabilities, and image-led case studies. Informed the prominence given to work and products.
- [Uniix Studio](https://www.uniixstudio.com/): direct creative positioning, strong project presentation and broad capability storytelling. Informed the scale and confidence of the headline system.

All illustration assets are original generated images; no reference brand assets were copied.

## Design system

Client-only tokens remain in `src/client/styles/clarity.css` for compatibility with the existing layout import. The stylesheet now contains the Elemental system. The admin theme is independent.

| Token           | Value     | Purpose                                                  |
| --------------- | --------- | -------------------------------------------------------- |
| `--fw-midnight` | `#031D1A` | Navigation, hero foundation, footer                      |
| `--fw-navy`     | `#063E34` | Rich evergreen sections                                  |
| `--fw-snow`     | `#F6F5EF` | Warm ivory reading surfaces                              |
| `--fw-ice`      | `#72F4DC` | Electric cyan accents and primary actions                |
| `--fw-ink`      | `#092F28` | Text on light surfaces                                   |
| `--fw-muted`    | `#51665D` | Supporting copy                                          |
| `--fw-cobalt`   | `#163DED` | Saturated blue direction; product surface uses `#143ADF` |

Display type uses weight 800, tight tracking and fluid sizes. Hero type grows to 138px, section headings to 78–84px, and the closing headline to 126px. Body copy uses comfortable line spacing. Shared buttons, header, mobile menu, footer, focus rings and semantic color tokens carry the identity to other pages.

Breakpoints: desktop navigation at 1100px; stacked mobile sections at 767px; compact controls at 380px. Mobile artwork sits below the primary message. Tablet typography and overlay contrast were refined after browser inspection.

## Content and integration

- Reuses the existing services, products, reviews, hero, about, and process data files.
- Adds `src/client/data/dummy-projects.ts` for Northline and Botanica concepts.
- Published CMS services, projects, reviews, and products take precedence over sample content.
- Sample brands, metrics, project concepts, pricing and testimonials are explicitly identified on the page.
- Concept project links use the existing work listing destination; they do not invent detail routes.
- No backend files, API service modules, validation schemas, or contact form logic were changed.
- The original home and featured-product requests, route destinations and outbound link protections are retained.
- Listing/detail pages still depend on the existing CMS. This revision fully implements the homepage and shared visual system; it does not replace the CMS with a fake backend.

## Generated imagery

Three original assets were made with the built-in image-generation tool. Selected outputs are responsive WebP files in `public/images/frostwood/`. Originals remain in the tool’s generated-images directory. `image-prompts.md` records the exact prompts.

- Hero: crystal-and-walnut snowflake, 960px (86 KB) and 1680px (206 KB) variants.
- Northline concept: laptop logistics dashboard and port, 640px (49 KB) and 1200px (117 KB).
- Botanica concept: mobile commerce on warm copper plinths, 640px (43 KB) and 1200px (107 KB).

The hero loads eagerly with high priority. Project images load lazily and select an appropriate resolution. Product interfaces reuse the existing SVG drawings.

## Verification

- Production build passed. Existing deferred admin/editor chunks still produce size advisories.
- All 196 tests in 19 files passed, including homepage API contracts, CMS precedence, labelled offline samples, product keyboard navigation, selection clamping, previous/next wrapping, and outbound link protection.
- Browser inspected at 1440px desktop, 820px tablet, 390px mobile and 320px narrow mobile.
- No horizontal text overflow at the tested widths after the tablet metric refinement.
- Inspected hero, services, project imagery, product lab, process and closing presentation.
- Confirmed mobile menu opening, Escape dismissal, body scroll restoration and focus returning to the menu button.
- Confirmed product switching by pointer and keyboard; confirmed process accordion expansion.
- Primary CTA reaches the original contact page; empty submission shows the existing required name, email and message errors. No enquiry was sent.
- The local CMS at port 7060 refused connections. Live content retrieval and successful form delivery therefore remain unverified; backend code and connections were preserved.
- Earlier browser approval was temporarily unavailable because of a usage limit; it became available again and the responsive checks above were completed.

Preview captures: `home-desktop.jpg`, `home-mobile.jpg`, `home-tablet.jpg`.
