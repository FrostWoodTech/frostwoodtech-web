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
- **Theme & currency.** Light and dark themes: `data-theme` on `<html>` is set by the pre-paint script in `index.html`, then by `ThemeProvider` (key `fwt-theme`, kept in sync with that script). `CurrencyProvider` picks the stored choice → locale guess (`utils/localeCurrency.ts`) → USD; plan prices go through `utils/pricing.ts#formatPlanPrice` (USD plans are converted with `formatMoney`).
- **Icons.** Lucide/react-icons components; service icons come from the API as `iconUrl`.

### Admin (`src/admin`)

- **Auth.** The access token lives only in memory (`api/tokenStorage.ts`); the refresh token is an httpOnly cookie. The admin `httpClient` attaches the bearer token, refreshes once on a 401 `invalid_token`/`unauthenticated` (concurrent 401s share one refresh), and dispatches `AUTH_EXPIRED_EVENT` when that fails, which `AuthProvider` handles. New accounts need email verification and then super admin approval.
- **Forms.** react-hook-form + zod schemas in `validation/*Schemas.ts`, which mirror the backend `Services/*Service.cs` rules and their error wording — keep the two in step. PUT endpoints are full replacements, so editors build the whole request body explicitly. Untouched optional fields are `""` and are sent as `undefined`.
- **Screens.** Small entities (tags, FAQs, pricing, reviews, certificates, currencies) edit in a keyed modal on their list page. Projects, products, articles and services have `…/new` and `…/:id` editor routes plus a `…/order` screen (one dnd-kit column per site for sort order and show/featured flags). Reorders write the new order to the React Query cache optimistically and roll back on failure; reorder mutations deliberately skip `invalidateQueries`.
- **Uploads.** `services/mediaService.ts`: presigned PUT straight to object storage (never through `httpClient`), stored as `media://` tokens and displayed with `utils/markdownImages.ts#resolveMediaDisplayUrl`.
- **UI kit.** Import primitives from the `@/admin/components/ui` barrel. Admin components use only admin tokens — don't reuse client components (`Badge`, `fw-*` utilities), since they follow the visitor's theme. Portalled UI must go through `layout/AdminPortal.tsx`.

## Styling

Tailwind v4 via `@tailwindcss/vite` — no `tailwind.config.js`. All tokens are in `src/index.css`:

- `@theme` holds the client "Ice Forest" light values (oklch `primary-*`, `accent-*`, `surface-*`, `text-*`, `border-*`, plus named tokens like `panel-*`, `mock-*`, `amber`); `:root[data-theme="dark"]` overrides them. Ramps invert between themes: `-400` is always readable accent text, `-600` always a solid fill. Surfaces: `950` is the page, `900` the card.
- `[data-theme="admin-light"]` (set in `AdminRoot`) pins the CMS to its own light palette. Every token the CMS uses must be declared in that block, or it inherits the visitor's theme.
- Gradients are plain custom properties exposed via `@utility` (`fw-btn`, `fw-text-ice`, `fw-grain`, …).

Use tokens (`bg-surface-900`, `text-text-secondary`, `border-border-subtle`) rather than raw palette colours. Variant/size class maps are `Record<>` constants at the top of the component file (see `ui/Button.tsx`), written as full class names — Tailwind can't see interpolated ones.

## Conventions

**Imports.** Use the `@/` alias for `src/` (configured in `vite.config.ts` and `tsconfig.app.json`).

**Comments.** Comment only what the code can't say: the non-obvious _why_, backend contracts (DTO source, omitted fields, API wording), and gotchas. Keep each comment to 1–3 lines. No history ("used to…", "previously…"), no restating names or markup (`{/* Header */}`), and no commented-out code. Keep `eslint-disable` reasons and TODOs.

**Tests.** Vitest, configured in the `test` block of `vite.config.ts` (so the `@/` alias works). Tests cover the logic layer only — zod schemas, mappers, utils, `ApiError`/`tokenStorage`/`httpClient` — not presentational components. Files sit next to their source as `*.test.ts` and import `describe`/`it`/`expect`/`vi` from `vitest` explicitly. They run in the `node` environment; add `// @vitest-environment jsdom` at the top of a file that needs `window`. Use `issuesOf` from `src/test/issuesOf.ts` to assert zod error messages by field path.
