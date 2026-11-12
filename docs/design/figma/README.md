# FrostWoodTech — Figma website design

Status: complete for design review, 15 October 2026.

[Open the linked design directory](https://www.figma.com/design/opBkY1Cwcu2fIPlAVWYhAA?node-id=29-9).

Owner: Ayeshan’s Education Team (team::1674101251443874219). Folder: FrostWoodTech (671342791).

The older Starter-team file DJLuAwkhzcsbzHkcImhsye is superseded and was not populated. Continue in opBkY1Cwcu2fIPlAVWYhAA.

## Deliverable

One Figma page contains all 26 main screens and 14 state examples in six labelled sections, with desktop/mobile pairs side by side. The linked review directory and shared component library are on this same page.

There are 26 main screens: desktop at 1440px and mobile at 390px for each of 13 route types: Home, About, Services, Service detail, Products, Product detail, Pricing, Work, Project detail, Insights, Article detail, Reviews and Contact.

Detail views are representative reusable templates, illustrated by Business systems, FrostBook, Northline and a draft engineering article. Admin and authentication pages are outside the agreed scope.

The user subsequently requested consolidation onto one page. All screens and components were moved with their existing IDs; seven empty pages were removed. Final validation: one page, 40 screens, no missing or overlapping screen frames. Current-work preferences remain Guidelines only / Guided review.

## Design direction

The existing Elemental identity continues: evergreen and midnight surfaces, saturated cobalt, cyan, ivory, Manrope typography, snowflake vectors and the existing generated frost-and-walnut artwork. Inner pages use editorial layouts, product showcases, clear project narratives and readable article layouts.

The homepage retains its existing composition, content, section order and artwork using native editable section components. Manrope is retained. Consolas is unavailable in this Figma environment, so small monospace labels use IBM Plex Mono; Georgia in the illustrative meridian brand uses Lora. These are documented substitutions, not a claim of identical font metrics.

Foundations include 41 color and spacing variables, semantic aliases, ten shared typography styles, and reusable buttons, navigation, footers, fields, filters, accordion rows, service/project/article/review cards, product interface concepts and homepage section components. Buttons include default, hover, focus and disabled states.

## Content and states

Existing data files supplied services, values, founder details, products, reviews, contact fields and concept projects. Fictional work, testimonials, claims, prices and newly drafted editorial content are labelled as illustrative. No new clients, awards or verified results are claimed. Unverified placeholder contact addresses were omitted.

Fourteen state frames cover mobile navigation, no results, loading and retrieval failure, missing detail content, contact validation and recovery, contact success, review submission, and shared control states. Submitting behavior and review moderation/recovery are documented alongside the examples.

## Verification

- Inspected rendered desktop and mobile compositions in Figma; corrected artwork decoding, transparent homepage backgrounds, emoji-rendered symbols, mobile accordion wrapping and narrow-field sizing.
- Native text, vectors, auto layout and component instances verified. UI screens are not flattened image fills; image fills contain discrete artwork only.
- Manrope verified across new screens; homepage font exceptions documented above.
- All 26 main screens and 14 state frames checked for horizontal containment; zero remaining horizontal overflow in the final audit.
- No empty image references; artwork rendering checked visually on the homepage, service detail and work pages.
- Review directory contains 26 Figma screen links. These are design navigation links, not a simulated live backend or a complete interactive prototype.
- Existing keyboard, focus and reduced-motion behavior is documented for implementation. Figma checks do not constitute a live-browser accessibility certification.
- Temporary capture script removed. Application routes, forms, validation, API connections and backend behavior were not modified. No real enquiry or review submission was sent.

The scripts in this directory are construction records, not safe commands to rerun indiscriminately: some create nodes. Use the current state.json identifiers and inspect the file before modifying it.

## Visual enrichment — 15 October 2026

The approved inner-page designs now include four new AI-generated material artworks (Craft, Systems, Clarity and Connection), four editable service illustrations, fifteen Lucide icon designs in light/dark tones, distinct editorial card imagery, and editable review-author monograms. Artwork stays inside the existing Elemental palette and compositions. Homepage artwork, section components and layouts are unchanged.

All 40 screens remain on the same Figma page. Updated desktop/mobile compositions were inspected; dark-surface icon contrast was corrected, and the canvas was reflowed to accommodate the added mobile artwork. Structural checks found no horizontal overflow or overlapping screen frames in the inner-page/state inventory. All inner-page text remains Manrope. Product interfaces remain editable native layers, not flattened imagery.

The new images are conceptual brand artwork, not photographs of actual people, offices or client engagements. Existing fictional-content disclosures remain in place. Decorative images and icons should be hidden from assistive technology when adjacent text supplies their meaning, following [W3C decorative-image guidance](https://www.w3.org/WAI/tutorials/images/decorative/); informative artwork needs an equivalent text alternative following [W3C informative-image guidance](https://www.w3.org/WAI/tutorials/images/informative/). No new motion or application-code changes were introduced.

Asset IDs, affected objects, validation results and design-review scope are recorded in `enrichment-state.json` and `enrichment-validation.json`. The `enrich-*.js` files are construction records; inspect the current canvas before rerunning any mutation.

## Inspiration carried forward

The original brief referenced [Rootcode](https://rootcode.ai/), [Allion Technologies](https://www.alliontechnologies.com/), [Sysco LABS](https://syscolabs.lk/), [99x](https://99x.io/) and [Uniix Studio](https://www.uniixstudio.com/). The FrostWoodTech identity and compositions are original. This continuation extended the agreed theme; it did not repeat the earlier reference research.


