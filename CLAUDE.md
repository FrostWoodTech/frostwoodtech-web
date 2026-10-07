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

**Environment.** `VITE_API_BASE_URL` (see `.env.example`; the backend repo is `../frostwoodtech-api`) and `VITE_GOOGLE_CLIENT_ID` (Google sign-in button hides when unset). There is no mock-data mode — the client always talks to the API.

## Architecture

Vite + React 19 + TypeScript + Tailwind CSS v4, talking to the FrostWoodTech Web.API. One bundle, two apps:

- **`src/client/`** — the public marketing site.
- **`src/admin/`** — the CMS under `/admin`.
- **`src/shared/hooks/`** — hooks used by both (`useSearchParamState`, `usePersistedForm`, `useDebounce`, `useDocumentTitle`).

The two apps don't import from each other. Each has its own `types.ts`, `services/httpClient.ts`, `ApiError`, toast system and React Query `QueryClient`, so keep new code on the matching side.

**Routing.** `src/main.tsx` mounts `RouterProvider` with the router in `src/routes/routes.tsx`. `/` routes render in `ClientLayout` (query client, theme, currency and toast providers, `Header` / `<Outlet/>` / `Footer`). `/admin` routes render in `AdminRoot` (query client, toasts, `AuthProvider`), then `RedirectIfAuthenticated` + `AuthLayout` for signed-out screens or `RequireAuth` + `AdminLayout` for the CMS; `RequireSuperAdmin` guards users and approvals. `src/App.tsx` is vestigial and not in the route tree; don't add anything to it.

**Data flow (both apps).** `services/*Service.ts` (axios calls, one file per resource) → `hooks/use*.ts` (React Query wrappers) → pages/components. API DTO shapes are interfaces in the app's `types.ts`, and each notes its backend source (`` `DTOs/Admin/X.cs` ``). The API returns RFC 7807 problems; `httpClient` turns every non-2xx into an `ApiError`, and `toErrorMessage` produces user-safe text.

### Client (`src/client`)

- **Content.** Everything the CMS manages comes from the `/public/*` endpoints: home (`GET /public/home` feeds the home services, pricing and testimonial sections in one call), projects, products, articles, services, pricing plans (combos and per-service), reviews, FAQs, tags (Work filters, About technologies), currencies, and the contact form (`POST /public/contact`). `lib/mappers.ts` converts DTOs into UI types where needed. There are no static fallbacks: API sections show loading, error or empty states, or hide themselves. `data/*.ts` holds only marketing copy the API doesn't model (hero, about, process, navigation, footer, section headers, contact details). Site-scoped endpoints default to `site=agency`.
- **Components.** Singular dirs (`hero/`, `services/`, `pricing/`, `metrics/`, …) are the sections composed by `pages/Home.tsx`; `-page` dirs (`work-page/`, `services-page/`, `blog-page/`, …) belong to their standalone page; `ui/` holds shared primitives. Pages own interactive state (e.g. `WorkPage`'s search/filter/sort) and pass it down.
- **Theme & currency.** Light only — there is no dark theme or theme switcher. `CurrencyProvider` picks the stored choice → locale guess (`utils/localeCurrency.ts`) → USD; the only `CurrencySwitcher` is on `/pricing`. Plan prices go through `utils/pricing.ts#formatPlanPrice` (USD plans are converted with `formatMoney`).
- **Background.** `components/background/IceGlassBackground.tsx`, rendered once in `ClientLayout`, is a still, fixed `-z-10` layer behind every client page. It has a CSS fallback gradient and grain (`.ice-*` in `index.css`; the `.ice-pane` glass slabs there are styled but currently unused), plus a WebGL2 canvas that `iceEngine.ts` / `iceShaders.ts` paint once (and again on resize). Every knob is in `iceConfig.ts`. Sections are transparent, so body text sits directly on it. The shader's contrast guard (`minLuminance`) keeps Slate text at ≥4.5:1. Without WebGL2, only the CSS layers show.
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

- `@theme` holds the client "Frost" palette: brand tokens `snow` (page), `mist` (alt band), `ice` (#7DB7FF), `ice-wash`, `blue`, `ink` (text, primary button), `slate`, `rule` (hairlines), plus the older `primary-*`/`accent-*` (blue ramp: `-400` readable text, `-600` fill), `surface-*` (`950` page, `900` card), `text-*`, `border-*`, `panel-*`, `mock-*` remapped onto it. `ice` is decorative only (≈2.2:1 on white) — never text; use `blue` for accent text and links.
- Fonts: Manrope (`font-sans`) for UI and body; Instrument Serif (`font-display`) for display type — it has a single 400 weight, so don't pair it with `font-medium`/`font-bold`.
- `[data-theme="admin-light"]` (set in `AdminRoot`) pins the CMS to its own palette and fonts. Every token the CMS uses must be declared in that block, or it inherits the client values.
- The legacy `fw-*` fill utilities (`fw-btn`, `fw-text-ice`, `fw-panel`, …) are now flat or near-flat colours; prefer the brand tokens in new code. `--fw-noise` on `:root` is the shared SVG grain tile (used by `fw-grain` and the ice background).

Use tokens (`bg-surface-900`, `text-text-secondary`, `border-border-subtle`) rather than raw palette colours. Variant/size class maps are `Record<>` constants at the top of the component file (see `ui/Button.tsx`), written as full class names — Tailwind can't see interpolated ones.

## Conventions

**Imports.** Use the `@/` alias for `src/` (configured in `vite.config.ts` and `tsconfig.app.json`).

**Comments.** Comment only what the code can't say: the non-obvious _why_, backend contracts (DTO source, omitted fields, API wording), and gotchas. Keep each comment to 1–3 lines. No history ("used to…", "previously…"), no restating names or markup (`{/* Header */}`), and no commented-out code. Keep `eslint-disable` reasons and TODOs.

**Tests.** Vitest, configured in the `test` block of `vite.config.ts` (so the `@/` alias works). Tests cover the logic layer only — zod schemas, mappers, utils, `ApiError`/`tokenStorage`/`httpClient` — not presentational components. Files sit next to their source as `*.test.ts` and import `describe`/`it`/`expect`/`vi` from `vitest` explicitly. They run in the `node` environment; add `// @vitest-environment jsdom` at the top of a file that needs `window`. Use `issuesOf` from `src/test/issuesOf.ts` to assert zod error messages by field path.
