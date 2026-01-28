# Copilot Instructions for Ryuucafe.com

## Project Context
Matcha e-commerce site built with **Astro 5.16** (MPA), **React 18** (islands), and **Tailwind CSS 4**. Content managed via **DatoCMS** GraphQL API. See [LLMS.md](../LLMS.md) for comprehensive details.

## Critical Patterns

### Data Fetching (Build-Time Only)
- All CMS data fetched at build time via GraphQL in `src/lib/*Fetcher.ts`
- **Pattern:** Create typed fetcher functions that return strongly-typed data
- **Example:** [src/lib/homeFetcher.ts](../src/lib/homeFetcher.ts) - returns `{ allProducts: Product[], pageContent: PageContent }`
- Auth: `Bearer ${import.meta.env.DATOCMS_API_KEY}` header required
- Always match returned data to types in [src/types.ts](../src/types.ts)

### Component Hydration Strategy
- **Default:** `.astro` components for all static content
- **React `.tsx` only when:** User interaction required (modals, carousels, forms)
- **Hydration directives:**
  - `client:only="react"` for HeadlessUI/Radix components (required for proper initialization)
  - `client:load` for above-fold interactive elements
  - `client:visible` for below-fold interactions
- **Example:** [OrderButton.tsx](../src/components/product/OrderButton.tsx) uses `client:only="react"` for HeadlessUI Dialog

### Styling Conventions
- **Tailwind v4:** Configuration via Vite plugin in [astro.config.mjs](../astro.config.mjs), not `tailwind.config.js`
- **No DaisyUI:** Custom button/component utilities defined in [global.css](../src/styles/global.css) `@layer components`
- **Custom fonts:** IBM Plex Sans Thai (body), Poppins (headings), configured via `@fontsource` imports in [Layout.astro](../src/components/Layout.astro)
- **Colors:** Primary palette is `shamrock-*` (green theme), use existing values
- **Utilities:** Use `cn()` from `@/utils/*` for conditional classes
- **Breakpoints:** Standard Tailwind + custom `xs:` (475px) for extra-small devices

### TypeScript & Imports
- **Path aliases:** `@/components/*` and `@/utils/*` (see [tsconfig.json](../tsconfig.json))
- **Type safety:** All CMS data types defined in [src/types.ts](../src/types.ts)
- Never use `any` - extend types if CMS schema changes
- Product categorization: `product.powderType === true` = Single Cultivar, `false/undefined` = Blend

### Image Handling
- **Always** use Astro `<Image />` for optimized loading
- CMS images: Use `responsiveImage.src`, `responsiveImage.srcSet` from DatoCMS
- Local images: Import from `src/assets/images/` and pass to `<Image />`
- **Example:** [index.astro](../src/pages/index.astro) lines 56-67 show CMS image with fallback

## Development Workflow

### Commands (from root)
```sh
npm run dev         # Dev server at localhost:4321
npm run build       # Type check + build (runs astro check first)
npm run preview     # Preview production build
```

### Pre-Commit Requirements
1. Run `npm run build` to ensure type safety (includes `astro check`)
2. Biome formats on save (config: [biome.json](../biome.json))
3. All new components must have explicit TypeScript types
UI component libraries** - Use custom utilities in `global.css` + HeadlessUI/Radix for interactive components
- **Image optimization mandatory** - No raw `<img>` tags, always use Astro `<Image />` or `<Picture />`
- **Type all fetcher returns** - Update `src/types.ts` if CMS schema evolves
- **Minimal client-side JS** - Leverage Astro's static generation
- **Mobile-first responsive** - Test at 375px, 475px (xs), 640px (sm), and up
- **Type all fetcher returns** - Update `src/types.ts` if CMS schema evolves
- **Minimal client-side JS** - Leverage Astro's static generation

## Key Files Reference
- [src/pages/index.astro](../src/pages/index.astro) - Homepage pattern (data fetching, product filtering)
- [src/lib/homeFetcher.ts](../src/lib/homeFetcher.ts) - DatoCMS GraphQL query structure
- [src/types.ts](../src/types.ts) - All CMS content models
- [src/components/Layout.astro](../src/components/Layout.astro) - Global layout with fonts, SEO, analytics
- [LLMS.md](../LLMS.md) - Detailed architecture guide
