# Copilot Instructions for Ryuucafe.com

## Project Context
- **Framework:** Astro 5.16 (MPA) + React 18 (Islands architecture)
- **Styling:** Tailwind CSS 4 (via `@tailwindcss/vite`)
- **Data Source:** DatoCMS (GraphQL API)
- **Language:** TypeScript 5.5 (Strict mode)

## Architecture & key Patterns

### Data Fetching (Build-Time Only)
- **Pattern:** Fetch all CMS data in `src/lib/*Fetcher.ts` functions.
- **Rule:** Never fetch data inside `.astro` or `.tsx` components directly.
- **Authentication:** Use `Bearer ${import.meta.env.DATOCMS_API_KEY}`.
- **Typing:** Return types **MUST** be explicitly defined in `src/types.ts`.
- **Example:**
  ```typescript
  // src/lib/homeFetcher.ts
  export async function fetchHome(): Promise<{ allProducts: Product[]; pageContent: PageContent }> { ... }
  ```

### Component Hydration (Islands)
- **Default:** Use `.astro` components for static content (Layouts, text, images).
- **Interactive:** Use `.tsx` (React) only when user interaction is required (Modals, Carousels).
- **Directives:**
  - `client:load`: For critical above-the-fold interactivity (e.g., `HeroCarousel`).
  - `client:only="react"`: **MANDATORY** for HeadlessUI/Radix components (e.g., `OrderButton`) to avoid hydration mismatches.
  - `client:visible`: For lower priority interactive elements.

### Styling (Tailwind v4)
- **Configuration:** No `tailwind.config.js`. Config is in `src/styles/global.css` using CSS variables and `@theme`.
- **Colors:** Primary palette uses `shamrock-*` and `malachite-*` (defined in global.css).
- **Components:** **NO DaisyUI**. Custom button/card classes are manually defined in `global.css` `@layer components`.
- **Utilities:** Use `cn()` from `@/utils/cn` for class merging.
- **Fonts:** `IBM Plex Sans Thai` (body), `Poppins` (headings), `Esteban`, `Sarabun`. managed via `@fontsource/*`.

### Data Models & Logic
- **Product Type:**
  - `powderType: true` (or truthy) = **Single Cultivar**
  - `powderType: false` (or undefined) = **Blend**
- **Images:** Always use DatoCMS `responsiveImage` data with Astro's `<Image />` or `<Picture />`.

## Critical Developer Workflows

### Build & Type Safety
- **Command:** `npm run build` performs `astro check` + `astro build`.
- **Rule:** Always run build locally before committing to catch type errors.
- **Linter:** Project uses **Biome**. Run format on save (configured in VS Code).

### Files & Structure
- **Global Types:** `src/types.ts` (Single source of truth for CMS models).
- **Layout:** `src/components/Layout.astro` handles `<head>`, SEO, and global styles.
- **Aliases:** Use `@/components/*` and `@/utils/*`.

## Common Implementation Details
- **HeadlessUI:** Wrapped in `client:only="react"` for Dialogs/Menus.
- **Carousels:** Uses `embla-carousel-react`.
- **Formatting:** `biome.json` manages formatting rules (indent: 2, width: 100).
