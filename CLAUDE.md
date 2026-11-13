# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev           # Vite dev server
npm run build         # tsc -b (typecheck, project references) then vite build
npm run lint          # eslint .
npm run format        # prettier --write .   (format:check to verify only)
npm run test          # vitest run (single pass)
npm run test:watch
npm run preview       # serve the production build
```

`npm run build` is the only typecheck (it covers test files too) — run it after non-trivial changes.

`node refactor-imports.js` is a one-off codemod that rewrites relative imports under `src/` to the `@/` alias. It edits files in place; only run it when asked.

**Environment.** `VITE_API_BASE_URL` (see `.env.example`; the backend repo is `../frostwoodtech-api`) and `VITE_GOOGLE_CLIENT_ID` (Google sign-in button hides when unset). `VITE_USE_STATIC_DATA` (default on; `false` switches the public site to the API). The admin always talks to the API.

## Architecture

Vite + React 19 + TypeScript + Tailwind CSS v4, talking to the FrostWoodTech Web.API. One bundle, two apps:

- **`src/client/`** — the public marketing site.
- **`src/admin/`** — the CMS under `/admin`.
- **`src/shared/hooks/`** — hooks used by both (`useSearchParamState`, `usePersistedForm`, `useDebounce`, `useDocumentTitle`).

The two apps don't import from each other. Each has its own `types.ts`, `services/httpClient.ts`, `ApiError`, toast system and React Query `QueryClient`, so keep new code on the matching side.

**Routing.** `src/main.tsx` mounts `RouterProvider` with the router in `src/routes/routes.tsx`. `/` routes render in `ClientLayout` (query client, theme, currency and toast providers, `Header` / `<Outlet/>` / `Footer`). `/admin` routes render in `AdminRoot` (query client, toasts, `AuthProvider`), then `RedirectIfAuthenticated` + `AuthLayout` for signed-out screens or `RequireAuth` + `AdminLayout` for the CMS; `RequireSuperAdmin` guards users and approvals. `src/App.tsx` is vestigial and not in the route tree; don't add anything to it.

**Data flow (both apps).** `services/*Service.ts` (axios calls, one file per resource) → `hooks/use*.ts` (React Query wrappers) → pages/components. API DTO shapes are interfaces in the app's `types.ts`, and each notes its backend source (`` `DTOs/Admin/X.cs` ``). The API returns RFC 7807 problems; `httpClient` turns every non-2xx into an `ApiError`, and `toErrorMessage` produces user-safe text.

### Client (`src/client`)

- **Pages.** The public site is five pages: Home, Services, Projects, About, Contact. `/work` redirects to `/projects`; any other path redirects to `/`. Older pages and sections (blog, pricing, products, reviews, …) are no longer routed; their files may still exist but nothing imports them.
- **Content.** Services (`useServices`), projects (`useProjects`, mapped to the UI `Project`), FAQs (`useFaqs`), home reviews (`GET /public/home` → `featuredReviews`) and the contact form (`POST /public/contact`) come from the `/public/*` endpoints. Service markdown fields (`capabilities`, `outcomes`, `whoThisIsFor`) are bullet lists read with `utils/text.ts#markdownBullets`. **Static data (current default):** while `VITE_USE_STATIC_DATA` isn't `"false"`, every `services/*Service.ts` returns from `services/staticApi.ts` instead, which serves the API-shaped content in `data/static/` (forms resolve without sending). Edit content there. All other copy (hero, process, why-us, results, about, contact details, nav) is in `data/site.ts`. Site-scoped endpoints default to `site=agency`.
- **Components.** `site/ui.tsx` holds the primitives (`SectionLabel`, `TwoLineHeading`, `PillLink`, `Section`); `site/sections.tsx` holds sections shared across pages (`PageHero`, `Marquee`, `ProcessSection`, `WhyUsSection`, `ResultsSection`, `TestimonialsSection`, `FaqSection`); `site/ClosingCta.tsx` is the dark CTA that runs into the dark footer. Page-specific parts: `hero/Hero.tsx` and `services/ServiceAccordion.tsx` (Home), `services-page/ServiceBlocks.tsx`, `about-page/AboutSections.tsx`, `contact/EnquiryForm.tsx` (3-step form), `projects-page/` (filterable `ProjectCase` list; `ProjectVisual` shows the primary image or a typographic panel) and `showcase/ProjectsTeaser.tsx` (Home).
- **Seasonal offer.** `PROMO` in `data/site.ts` (currently Christmas, 15% off) shows only between its `startsAt`/`endsAt` dates (`utils/promo.ts#isWithinWindow`): a blue band on Home, Services and Projects, a top-bar line, and a notice on the enquiry form, which then sends `PROMO.enquirySubject` as the submission `subject`. Move the dates to rerun it.
- **Design.** Bold corporate: near-black `ink` and white with dark full-bleed bands, one electric `blue` (`blue-soft` for accent text on ink), Inter Tight 700 headlines in a two-line pattern (statement + quieter second line), numbered `01` labels, pill buttons with ↗ arrows.
- **Motion.** Animations use `motion` (`motion/react`, Framer Motion's successor) — no GSAP. `MotionConfig reducedMotion="user"` in `ClientLayout` drops movement for visitors who ask for reduced motion. Shared pieces are in `components/motion/`: `presets.ts` (`EASE`, `VIEWPORT` = reveal once, stagger variants), `Reveal`/`Stagger`/`StaggerItem` (fade-up on first view), `AccordionItem` (height-animated disclosure; replaces `<details>`), `CountUp`, the scroll-velocity `Marquee`, and `SiteMotion` (`PageTransition` with the ink curtain on link navigation). `TwoLineHeading`/`MaskLine` slide headline lines up from a mask, and `PillLink`/`Magnetic` lean toward the cursor. Gotcha: an element clipped by `overflow: hidden` never reports as in view, so trigger mask reveals from the wrapper. Motion sets inline `transform`, which overrides Tailwind transform utilities on the same element, so put hover transforms on a child.
- **Theme & currency.** Light only — there is no dark theme or theme switcher. `CurrencyProvider` is still mounted in `ClientLayout` but nothing on the four pages shows prices.
- **Background.** Plain white page with `mist` bands; no decorative backgrounds, WebGL or snow/ice motifs (the corporate redesign removed them — the Frost version is at tag `design/frost-v1`).
- **Icons.** Lucide/react-icons components; service icons come from the API as `iconUrl`.

### Admin (`src/admin`)

- **Auth.** The access token lives only in memory (`api/tokenStorage.ts`); the refresh token is an httpOnly cookie. The admin `httpClient` attaches the bearer token, refreshes once on a 401 `invalid_token`/`unauthenticated` (concurrent 401s share one refresh), and dispatches `AUTH_EXPIRED_EVENT` when that fails, which `AuthProvider` handles. New accounts need email verification and then super admin approval.
- **Forms.** react-hook-form + zod schemas in `validation/*Schemas.ts`, which mirror the backend `Services/*Service.cs` rules and their error wording — keep the two in step. PUT endpoints are full replacements, so editors build the whole request body explicitly. Untouched optional fields are `""` and are sent as `undefined`.
- **Screens.** Small entities (tags, FAQs, pricing, reviews, certificates, currencies) edit in a keyed modal on their list page. Projects, products, articles and services have `…/new` and `…/:id` editor routes plus a `…/order` screen (one dnd-kit column per site for sort order and show/featured flags). Reorders write the new order to the React Query cache optimistically and roll back on failure; reorder mutations deliberately skip `invalidateQueries`.
- **Trash.** Deleting any content type is a soft delete (users excluded). `/admin/trash` (`pages/TrashPage.tsx`) is one screen for all of them, driven by the `TRASH_ENTITIES` registry in `services/trashService.ts` (its `id` is the API path segment; keep it in step with the backend trash routes). Restore is open to every admin and refreshes all content queries; permanent delete (`DELETE …/permanent`) is super-admin only and can be refused with `*_in_use` 409s. Delete dialogs on list pages say "Move to trash". Certificates have a required `category` (`course` | `exam`) shown as a badge and chosen in the form; the admin list has no category filter.
- **Uploads.** `services/mediaService.ts`: presigned PUT straight to object storage (never through `httpClient`), stored as `media://` tokens and displayed with `utils/markdownImages.ts#resolveMediaDisplayUrl`.
- **UI kit.** Import primitives from the `@/admin/components/ui` barrel. Admin components use only admin tokens — don't reuse client components (`Badge`, `fw-*` utilities), since they follow the visitor's theme. Portalled UI must go through `layout/AdminPortal.tsx`.

## Styling

Tailwind v4 via `@tailwindcss/vite` — no `tailwind.config.js`. All tokens are in `src/index.css`:

- `@theme` holds the client "Corporate" palette (navy ink, neutral greys, one blue accent): brand tokens `snow` (page, white), `mist` (alt band), `ice` (neutral decorative grey), `ice-wash` (pale tint), `blue` (#1E4FA3), `ink` (#0F1C2E, text, primary button), `slate`, `rule` (hairlines), plus the older `primary-*`/`accent-*` (blue ramp: `-400` readable text, `-600` fill), `surface-*` (`950` page, `900` card), `text-*`, `border-*`, `panel-*`, `mock-*` remapped onto it. `ice` is decorative only — never text; use `blue` for accent text and links.
- Fonts: Manrope (`font-sans`) for UI and body; Inter Tight (`font-display`) for headlines — `.font-display` sets weight 600, and `<em>` inside it is upright blue, not italic.
- `[data-theme="admin-light"]` (set in `AdminRoot`) pins the CMS to its own palette and fonts. Every token the CMS uses must be declared in that block, or it inherits the client values.
- The legacy `fw-*` fill utilities (`fw-btn`, `fw-text-ice`, `fw-panel`, …) are now flat or near-flat colours; prefer the brand tokens in new code. `--fw-noise` on `:root` is the shared SVG grain tile (used by `fw-grain` and the ice background).

Use tokens (`bg-surface-900`, `text-text-secondary`, `border-border-subtle`) rather than raw palette colours. Variant/size class maps are `Record<>` constants at the top of the component file (see `ui/Button.tsx`), written as full class names — Tailwind can't see interpolated ones.

## Conventions

**Imports.** Use the `@/` alias for `src/` (configured in `vite.config.ts` and `tsconfig.app.json`).

**Comments.** Comment only what the code can't say: the non-obvious _why_, backend contracts (DTO source, omitted fields, API wording), and gotchas. Keep each comment to 1–3 lines. No history ("used to…", "previously…"), no restating names or markup (`{/* Header */}`), and no commented-out code. Keep `eslint-disable` reasons and TODOs.

**Tests.** Vitest, configured in the `test` block of `vite.config.ts` (so the `@/` alias works). Tests cover the logic layer only — zod schemas, mappers, utils, `ApiError`/`tokenStorage`/`httpClient` — not presentational components. Files sit next to their source as `*.test.ts` and import `describe`/`it`/`expect`/`vi` from `vitest` explicitly. They run in the `node` environment; add `// @vitest-environment jsdom` at the top of a file that needs `window`. Use `issuesOf` from `src/test/issuesOf.ts` to assert zod error messages by field path.
