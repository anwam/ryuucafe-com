# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Context

Ryuucafe.com — storefront site for Ryuu, a matcha cafe in Thailand. Astro 5 MPA with React 18 islands, Tailwind CSS v4, content from DatoCMS (GraphQL).

## Commands

- `npm run dev` / `npm start` — dev server at `http://localhost:4321`
- `npm run build` — `astro check` (type check) + `astro build` to `dist/`. Always run before committing.
- `npm run preview` — preview production build
- No test suite in this repo.
- Formatting/linting: Biome (`biome.json` — 2-space indent, single quotes, no semicolons, width 100). Format on save.
- Env: copy `sample.env` to `.env`; requires `DATOCMS_API_KEY` (read-only DatoCMS token). If unset, `dev`/`build` fall back to mock data (see below) instead of failing.
- Node version pinned via `mise.toml` (node 24).

## Architecture

### Layers

`src/` is organized in four layers, each with a single responsibility:

- `src/domain/` — pure TypeScript types (`Product`, `PageContent`, `HeroSection`,
  etc.), grouped by feature (`domain/home/types.ts`, `domain/product/types.ts`).
  Zero framework or fetch dependencies. This is the single source of truth for
  CMS model shapes — update it when the CMS schema changes.
- `src/data/` — repository interfaces plus their DatoCMS GraphQL
  implementations (e.g. `data/home/HomeRepository.ts` +
  `data/home/DatoCmsHomeRepository.ts`). All CMS calls go through
  `data/datocms/client.ts`. Never fetch data inside `.astro`/`.tsx` components
  directly — call a repository from `src/pages/*.astro` and pass results down
  as props. When `DATOCMS_API_KEY` is unset, `DatoCmsHomeRepository.getHome()`
  returns `data/home/mockHomeData.ts` instead of calling the API — lets
  `dev`/`build` run with no key. Update the mock alongside `domain/*` types
  when the CMS schema changes.
- `src/presentation/` — `.astro` and `.tsx` components, grouped by feature
  (`layout/`, `home/`, `product/`, `seo/`, `analytics/`). Imports `domain`
  types only; never imports `data/*` directly, with one documented exception
  (see below).
- `src/shared/` — cross-cutting UI primitives (`shared/ui/`, built on Radix UI
  + `class-variance-authority`) and utilities (`shared/utils/`).

**Layer rule:** `domain` → imported by everything, imports nothing internal.
`data` → implements `domain` interfaces, imports the DatoCMS client only.
`presentation` → imports `domain` types, never `data/*` directly — pages wire
data to presentation. `pages/*.astro` stay thin: fetch via a repository, pass
props down, no markup logic beyond composition.

**Exception:** `presentation/home/HeroCarousel.tsx` calls
`bannerRepository.getHeroBanners()` directly from a `useEffect`, to refetch
banners client-side after hydration (using the browser-exposed
`PUBLIC_DATOCMS_API_KEY`). This bypasses the page-level data flow
deliberately — it's a runtime refresh, not a build-time fetch — and is the
only place presentation is allowed to import from `data/`.

### Component strategy (islands)
- `.astro` components are the default for static content/layout (`Layout.astro`, `Header.astro`, `Footer.astro`, `ProductItem.astro`).
- `.tsx` (React) only for components that need interactivity (`HeaderMenus`, `HeroCarousel`, `product/OrderButton`).
- Hydration directives: `client:load` for critical above-the-fold interactivity; `client:only="react"` for Radix/HeadlessUI-based components to avoid SSR hydration mismatches; `client:visible` for lower-priority elements.

### Styling (Tailwind v4)
- No `tailwind.config.js` — theme/config lives in `src/styles/global.css` via CSS variables and `@theme`.
- Custom component classes (buttons, cards) are defined manually in `global.css` `@layer components`.
- Use `cn()` from `@/shared/utils/cn` (clsx + tailwind-merge) for conditional class merging.
- Fonts (Poppins, IBM Plex Sans Thai, Esteban, Sarabun) are wired through Astro's Fonts API (`fontProviders.fontsource()`) in `astro.config.mjs`, not `@fontsource` imports directly.

### Images
- Use DatoCMS `responsiveImage` data with Astro's `<Image />`/`<Picture />` — avoid raw `<img>`.
- Remote image domain allowlist is set in `astro.config.mjs` (`image.domains`).

### Other integrations
- `@astrojs/partytown` for third-party scripts, `@astrojs/sitemap` for sitemap generation, `@playform/compress` for build-time asset compression — all wired in `astro.config.mjs`.
- Path aliases: `@/domain/*`, `@/data/*`, `@/presentation/*`, `@/shared/*`, `@/assets/*` (see `tsconfig.json`).

## Notes
- No `tailwind.config.mjs` and no DaisyUI in this codebase — earlier docs (`.github/copilot-instructions.md`, `LLMS.md`) referencing DaisyUI/`tailwind.config.mjs` are stale; ignore them.
