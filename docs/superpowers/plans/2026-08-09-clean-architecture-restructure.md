# Clean Architecture Restructure Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reorganize `src/` into layered `domain` / `data` / `presentation` / `shared` folders per `docs/superpowers/specs/2026-08-09-clean-architecture-restructure-design.md`, with repository interfaces in the data layer, zero behavior change.

**Architecture:** Move files layer-by-layer (domain types first, then data repositories, then shared UI/utils, then presentation components), rewiring imports as each layer lands. `src/pages/index.astro` is updated last to consume the new repository + presentation paths. No test suite exists in this repo, so verification is `npm run build` (runs `astro check` + `astro build`) rather than unit tests — run it once the full migration is wired, then fix any type/import errors it surfaces.

**Tech Stack:** Astro 5, React 18, TypeScript (`astro/tsconfigs/strict`), Biome.

---

## Known exception to the "presentation never imports data directly" rule

`HeroCarousel.tsx` (presentation) calls the banner repository directly from a `React.useEffect` — this is a genuine client-side runtime refetch (using `PUBLIC_DATOCMS_API_KEY`, a browser-exposed env var), not a build-time page-level fetch. It cannot go through `pages/index.astro` because it re-fetches after hydration. This exception must be documented in `CLAUDE.md`, not treated as a violation.

---

### Task 1: Domain layer — split `types.ts`

**Files:**
- Create: `src/domain/product/types.ts`
- Create: `src/domain/home/types.ts`
- Delete: `src/types.ts` (after Task 5 confirms nothing else references it — see Task 5)

- [ ] **Step 1: Create `src/domain/product/types.ts`**

```typescript
export type Product = {
  available: boolean
  description: string
  id: string
  name: string
  onSale: boolean
  onlyDelivery: boolean
  price: number
  salePrice: number
  bestSeller?: boolean
  shelfOrder?: number
  powderType?: boolean
  tasteNote?: string
  recommended?: boolean
  coverImage: {
    blurhash: string
    thumbhash: string
    responsiveImage: {
      src: string
      srcSet: string
      sizes: string
      width: number
      height: number
    }
  }
}
```

- [ ] **Step 2: Create `src/domain/home/types.ts`**

```typescript
export interface PageContent {
  heroSection: HeroSection
}

export interface HeroSection {
  heroImage: HeroImage
  heroTitle: string
  heroDescription: string
  heroBanner?: HeroBanner[]
}

export interface HeroBanner {
  responsiveImage: ResponsiveImage
}

export interface HeroImage {
  responsiveImage: ResponsiveImage
}

export interface ResponsiveImage {
  sizes: string
  srcSet: string
  webpSrcSet: string
  alt: string
  src: string
  width: number
  height: number
}
```

- [ ] **Step 3: Commit**

```bash
git add src/domain
git commit -m "refactor: extract domain types from src/types.ts"
```

(Do not delete `src/types.ts` yet — it's still imported by not-yet-moved files. It's removed in Task 5.)

---

### Task 2: Data layer — DatoCMS client + repositories

**Files:**
- Create: `src/data/datocms/client.ts`
- Create: `src/data/home/HomeRepository.ts`
- Create: `src/data/home/DatoCmsHomeRepository.ts`
- Create: `src/data/banner/BannerRepository.ts`
- Create: `src/data/banner/DatoCmsBannerRepository.ts`
- Delete: `src/lib/homeFetcher.ts`, `src/lib/bannerFetcher.ts` (after Task 5)

- [ ] **Step 1: Create `src/data/datocms/client.ts`**

```typescript
const DATOCMS_ENDPOINT = 'https://graphql.datocms.com/'

export async function postDatoCmsQuery(query: string, apiKey: string): Promise<Response> {
  return fetch(DATOCMS_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({ query }),
  })
}
```

- [ ] **Step 2: Create `src/data/home/HomeRepository.ts`**

```typescript
import type { PageContent } from '@/domain/home/types'
import type { Product } from '@/domain/product/types'

export interface HomeData {
  allProducts: Product[]
  pageContent: PageContent
}

export interface HomeRepository {
  getHome(): Promise<HomeData>
}
```

- [ ] **Step 3: Create `src/data/home/DatoCmsHomeRepository.ts`**

Same GraphQL query as the current `src/lib/homeFetcher.ts`, wired through the shared client.

```typescript
import { postDatoCmsQuery } from '../datocms/client'
import type { HomeData, HomeRepository } from './HomeRepository'

const HOME_QUERY = `
{
  allProducts(orderBy: shelfOrder_ASC) {
    available
    description
    id
    name
    onSale
    onlyDelivery
    price
    salePrice
    bestSeller
    shelfOrder
    tasteNote
    powderType
    recommended
    coverImage {
      blurhash
      thumbhash
      responsiveImage(imgixParams: { auto: compress, fm: webp, q: 100, minW: 300, w: 640 }) {
          src
          srcSet
          sizes
          width
          height
      }
    }
  }
  pageContent {
    heroSection {
      heroImage {
        responsiveImage(imgixParams: {w: 540, h: 540, q: 95, fm: webp, auto: compress}) {
          sizes
          srcSet
          webpSrcSet
          alt
          src
          width
          height
        }
      }
      heroTitle
      heroDescription
      heroBanner {
        responsiveImage(imgixParams: {w: 1920, fm: webp, q: 95, auto: compress}) {
          sizes
          srcSet
          webpSrcSet
          alt
          src
          width
          height
        }
      }
    }
  }
}`

class DatoCmsHomeRepository implements HomeRepository {
  async getHome(): Promise<HomeData> {
    const response = await postDatoCmsQuery(HOME_QUERY, import.meta.env.DATOCMS_API_KEY)
    const json = (await response.json()) as { data: HomeData }
    return json.data
  }
}

export const homeRepository: HomeRepository = new DatoCmsHomeRepository()
```

- [ ] **Step 4: Create `src/data/banner/BannerRepository.ts`**

```typescript
import type { HeroBanner } from '@/domain/home/types'

export interface BannerRepository {
  getHeroBanners(): Promise<HeroBanner[]>
}
```

- [ ] **Step 5: Create `src/data/banner/DatoCmsBannerRepository.ts`**

Preserves exact current behavior of `src/lib/bannerFetcher.ts`: silently returns `[]` if the public API key is missing, the response isn't ok, or the fetch throws.

```typescript
import { postDatoCmsQuery } from '../datocms/client'
import type { HeroBanner } from '@/domain/home/types'
import type { BannerRepository } from './BannerRepository'

const HERO_BANNER_QUERY = `{
  pageContent {
    heroSection {
      heroBanner {
        responsiveImage(imgixParams: {w: 1920, fm: webp, q: 95, auto: compress}) {
          sizes
          srcSet
          webpSrcSet
          alt
          src
          width
          height
        }
      }
    }
  }
}`

interface HeroBannerResponse {
  data: {
    pageContent: {
      heroSection: {
        heroBanner: HeroBanner[]
      }
    }
  }
}

class DatoCmsBannerRepository implements BannerRepository {
  async getHeroBanners(): Promise<HeroBanner[]> {
    const apiKey = import.meta.env.PUBLIC_DATOCMS_API_KEY
    if (!apiKey) {
      return []
    }

    try {
      const response = await postDatoCmsQuery(HERO_BANNER_QUERY, apiKey)

      if (!response.ok) {
        return []
      }

      const json = (await response.json()) as HeroBannerResponse
      return json.data?.pageContent?.heroSection?.heroBanner ?? []
    } catch {
      return []
    }
  }
}

export const bannerRepository: BannerRepository = new DatoCmsBannerRepository()
```

- [ ] **Step 6: Commit**

```bash
git add src/data
git commit -m "refactor: add data layer repositories for home and banner fetches"
```

(Do not delete `src/lib/*` yet — done in Task 5.)

---

### Task 3: Shared layer — UI primitives and utils

**Files:**
- Move: `src/utils/cn.ts` → `src/shared/utils/cn.ts`
- Move: `src/utils/scrollToNode.ts` → `src/shared/utils/scrollToNode.ts`
- Move: `src/components/ui/button.tsx` → `src/shared/ui/button.tsx`
- Move: `src/components/ui/carousel.tsx` → `src/shared/ui/carousel.tsx`
- Move: `src/components/ui/ShopeeIcon.tsx` → `src/shared/ui/ShopeeIcon.tsx`

- [ ] **Step 1: Move files with `git mv`**

```bash
mkdir -p src/shared/utils src/shared/ui
git mv src/utils/cn.ts src/shared/utils/cn.ts
git mv src/utils/scrollToNode.ts src/shared/utils/scrollToNode.ts
git mv src/components/ui/button.tsx src/shared/ui/button.tsx
git mv src/components/ui/carousel.tsx src/shared/ui/carousel.tsx
git mv src/components/ui/ShopeeIcon.tsx src/shared/ui/ShopeeIcon.tsx
```

`cn.ts`, `scrollToNode.ts`, and `ShopeeIcon.tsx` have no internal imports to fix.

- [ ] **Step 2: Fix `src/shared/ui/button.tsx` import**

Change:
```typescript
import { cn } from '@/utils/cn'
```
to:
```typescript
import { cn } from '@/shared/utils/cn'
```

- [ ] **Step 3: Fix `src/shared/ui/carousel.tsx` imports**

Change:
```typescript
import { Button } from '@/components/ui/button'
import { cn } from '@/utils/cn'
```
to:
```typescript
import { Button } from '@/shared/ui/button'
import { cn } from '@/shared/utils/cn'
```

- [ ] **Step 4: Commit**

```bash
git add src/shared src/utils src/components/ui
git commit -m "refactor: move shared UI primitives and utils to src/shared"
```

---

### Task 4: Presentation layer — layout, home, product, seo, analytics

**Files:**
- Move: `src/components/Layout.astro` → `src/presentation/layout/Layout.astro`
- Move: `src/components/Header.astro` → `src/presentation/layout/Header.astro`
- Move: `src/components/Footer.astro` → `src/presentation/layout/Footer.astro`
- Move: `src/components/Social.astro` → `src/presentation/layout/Social.astro`
- Move: `src/components/HeaderMenus.tsx` → `src/presentation/layout/HeaderMenus.tsx`
- Move: `src/components/HeroCarousel.tsx` → `src/presentation/home/HeroCarousel.tsx`
- Move: `src/components/ProductItem.astro` → `src/presentation/home/ProductItem.astro`
- Move: `src/components/product/OrderButton.tsx` → `src/presentation/product/OrderButton.tsx`
- Move: `src/modules/seo/Head.astro` → `src/presentation/seo/Head.astro`
- Move: `src/modules/analytics/GoogleAnalytics.astro` → `src/presentation/analytics/GoogleAnalytics.astro`

- [ ] **Step 1: Move files with `git mv`**

```bash
mkdir -p src/presentation/layout src/presentation/home src/presentation/product src/presentation/seo src/presentation/analytics
git mv src/components/Layout.astro src/presentation/layout/Layout.astro
git mv src/components/Header.astro src/presentation/layout/Header.astro
git mv src/components/Footer.astro src/presentation/layout/Footer.astro
git mv src/components/Social.astro src/presentation/layout/Social.astro
git mv src/components/HeaderMenus.tsx src/presentation/layout/HeaderMenus.tsx
git mv src/components/HeroCarousel.tsx src/presentation/home/HeroCarousel.tsx
git mv src/components/ProductItem.astro src/presentation/home/ProductItem.astro
git mv src/components/product/OrderButton.tsx src/presentation/product/OrderButton.tsx
git mv src/modules/seo/Head.astro src/presentation/seo/Head.astro
git mv src/modules/analytics/GoogleAnalytics.astro src/presentation/analytics/GoogleAnalytics.astro
```

- [ ] **Step 2: Fix `src/presentation/layout/Layout.astro` imports**

Change:
```astro
import '../styles/global.css'
import Head from '../modules/seo/Head.astro'
import Footer from './Footer.astro'
import Header from './Header.astro'
import GoogleAnalytics from 'src/modules/analytics/GoogleAnalytics.astro'
```
to:
```astro
import '../../styles/global.css'
import Head from '../seo/Head.astro'
import Footer from './Footer.astro'
import Header from './Header.astro'
import GoogleAnalytics from '../analytics/GoogleAnalytics.astro'
```

- [ ] **Step 3: Fix `src/presentation/layout/Header.astro` import**

Change:
```astro
import RyuuLogo from '../assets/images/main-logo.webp'
```
to:
```astro
import RyuuLogo from '../../assets/images/main-logo.webp'
```

(`import { Picture } from 'astro:assets'` and `import HeaderMenus from './HeaderMenus'` are unchanged — `HeaderMenus.tsx` is in the same directory.)

- [ ] **Step 4: Fix `src/presentation/layout/HeaderMenus.tsx` imports**

Change:
```typescript
import { scrollToNode } from '@/utils/scrollToNode'
import { Button } from '@headlessui/react'
import { useState } from 'react'
import OrderButton from './product/OrderButton'
```
to:
```typescript
import { scrollToNode } from '@/shared/utils/scrollToNode'
import { Button } from '@headlessui/react'
import { useState } from 'react'
import OrderButton from '../product/OrderButton'
```

- [ ] **Step 5: Fix `src/presentation/home/HeroCarousel.tsx` imports and repository call**

Change:
```typescript
import {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'
import { fetchHeroBanners } from '@/lib/bannerFetcher'
import { cn } from '@/utils/cn'
import * as React from 'react'
import type { HeroBanner, HeroImage } from '../types'
```
to:
```typescript
import {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/shared/ui/carousel'
import { bannerRepository } from '@/data/banner/DatoCmsBannerRepository'
import { cn } from '@/shared/utils/cn'
import * as React from 'react'
import type { HeroBanner, HeroImage } from '@/domain/home/types'
```

And change the fetch call in the `useEffect`:
```typescript
    fetchHeroBanners().then((freshBanners) => {
```
to:
```typescript
    bannerRepository.getHeroBanners().then((freshBanners) => {
```

- [ ] **Step 6: Fix `src/presentation/home/ProductItem.astro` import**

Change:
```astro
import type { Product } from '../types'
```
to:
```astro
import type { Product } from '@/domain/product/types'
```

- [ ] **Step 7: Fix `src/presentation/product/OrderButton.tsx` import**

Change:
```typescript
import { cn } from '@/utils/cn'
```
to:
```typescript
import { cn } from '@/shared/utils/cn'
```

(`@/assets/images/robinhood.png` import is unchanged — the `@/assets/*` alias is unaffected.)

- [ ] **Step 8: Verify `src/presentation/seo/Head.astro` needs no change**

Its relative import `import FeatureImage from '../../assets/images/home/feature-1.webp'` still resolves correctly: `src/presentation/seo/Head.astro` → `../../assets` → `src/assets`. Same depth as the old `src/modules/seo/Head.astro` location. No edit needed — just confirm after the move.

- [ ] **Step 9: Verify `src/presentation/analytics/GoogleAnalytics.astro` and `src/presentation/layout/Footer.astro` need no changes**

Neither imports local files — only `import.meta.env`. No edit needed.

- [ ] **Step 10: Commit**

```bash
git add src/presentation src/components src/modules
git commit -m "refactor: move presentation components into src/presentation"
```

---

### Task 5: Rewire `src/pages/index.astro` and remove old files

**Files:**
- Modify: `src/pages/index.astro`
- Delete: `src/types.ts`
- Delete: `src/lib/homeFetcher.ts`, `src/lib/bannerFetcher.ts` (and `src/lib/` if now empty)
- Delete: `src/components/`, `src/modules/`, `src/utils/` (should already be empty after Tasks 2-4; remove if any empty dirs remain)

- [ ] **Step 1: Update `src/pages/index.astro` imports and data call**

Change:
```astro
import ProductItem from '../components/ProductItem.astro'
import Layout from '@/components/Layout.astro'
import { Image } from 'astro:assets'
import OrderButton from '@/components/product/OrderButton'
import { HeroCarousel } from '@/components/HeroCarousel'
import { fetchHome } from 'src/lib/homeFetcher'

const homePageData = await fetchHome()
```
to:
```astro
import ProductItem from '@/presentation/home/ProductItem.astro'
import Layout from '@/presentation/layout/Layout.astro'
import { Image } from 'astro:assets'
import OrderButton from '@/presentation/product/OrderButton'
import { HeroCarousel } from '@/presentation/home/HeroCarousel'
import { homeRepository } from '@/data/home/DatoCmsHomeRepository'

const homePageData = await homeRepository.getHome()
```

The rest of `index.astro` (JSX/markup below the frontmatter) is unchanged — it only reads `content` and `products`, both still populated identically.

- [ ] **Step 2: Delete superseded files**

```bash
git rm src/types.ts
git rm src/lib/homeFetcher.ts src/lib/bannerFetcher.ts
```

- [ ] **Step 3: Confirm no stale references remain**

```bash
grep -rn "@/components\|@/lib\|@/utils\|from '\.\./types'\|from '\./types'\|src/lib" src
```
Expected: no output (empty). If anything prints, fix that file's import before continuing.

- [ ] **Step 4: Commit**

```bash
git add src/pages/index.astro
git commit -m "refactor: wire pages/index.astro to new data and presentation layers"
```

---

### Task 6: Update `tsconfig.json` path aliases

**Files:**
- Modify: `tsconfig.json`

- [ ] **Step 1: Replace the `paths` block**

Change:
```json
    "paths": {
      "@/components/*": [
        "src/components/*"
      ],
      "@/lib/*": [
        "src/lib/*"
      ],
      "@/utils/*": [
        "src/utils/*"
      ],
      "@/assets/*": [
        "src/assets/*"
      ]
    },
```
to:
```json
    "paths": {
      "@/domain/*": [
        "src/domain/*"
      ],
      "@/data/*": [
        "src/data/*"
      ],
      "@/presentation/*": [
        "src/presentation/*"
      ],
      "@/shared/*": [
        "src/shared/*"
      ],
      "@/assets/*": [
        "src/assets/*"
      ]
    },
```

- [ ] **Step 2: Commit**

```bash
git add tsconfig.json
git commit -m "refactor: update path aliases for layered src structure"
```

---

### Task 7: Update `CLAUDE.md` architecture docs

**Files:**
- Modify: `CLAUDE.md`

- [ ] **Step 1: Replace the "Architecture" section**

Change the `## Architecture` section (covering "Data fetching", "Component strategy", "Styling", "Images") to document the new layered structure. Replace the existing `### Data fetching (build-time only)` and `### Component strategy (islands)` subsections with:

```markdown
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
  as props.
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
```

Update the `- Use \`cn()\` from \`@/utils/cn\`` bullet under Styling to:
```markdown
- Use `cn()` from `@/shared/utils/cn` (clsx + tailwind-merge) for conditional class merging.
```

Update the path aliases note at the bottom:
```markdown
- Path aliases: `@/domain/*`, `@/data/*`, `@/presentation/*`, `@/shared/*`, `@/assets/*` (see `tsconfig.json`).
```

- [ ] **Step 2: Commit**

```bash
git add CLAUDE.md
git commit -m "docs: document layered architecture in CLAUDE.md"
```

---

### Task 8: Build verification

**Files:** none (verification only)

- [ ] **Step 1: Run the build**

```bash
npm run build
```

Expected: `astro check` reports 0 errors, `astro build` completes and writes `dist/`.

- [ ] **Step 2: If errors surface, fix and re-run**

Likely failure modes and fixes:
- Leftover `@/components/*`, `@/lib/*`, `@/utils/*` import → update to the new alias per the mapping in Tasks 2-5.
- Missing type export → check the import is pulling from `@/domain/home/types` or `@/domain/product/types` as appropriate (see Task 1).
- `Cannot find module` for a moved file → confirm the `git mv` in Tasks 3-4 landed at the expected path.

Re-run `npm run build` until it passes cleanly.

- [ ] **Step 3: Manual smoke check**

```bash
npm run preview
```

Open `http://localhost:4321` (or the printed port) and confirm: hero banner carousel renders and auto-plays, product grids (Single Cultivar + House Blends) render, order button modal opens, header mobile/desktop menus work. Stop the preview server after confirming (Ctrl+C).

- [ ] **Step 4: Final commit if any fixes were needed**

```bash
git add -A
git commit -m "fix: resolve build errors from Clean Architecture restructure"
```

(Skip this step if Step 1 passed clean with no fixes needed.)
