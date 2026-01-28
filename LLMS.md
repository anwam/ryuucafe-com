# Ryuucafe.com Repository Guide for LLMs

## Project Overview
**Ryuucafe.com** is a matcha store website built as a Multi-Page Application (MPA) using **Astro 5.16**, **React 18**, and **Tailwind CSS 4**. Content is managed via **DatoCMS**.

This guide provides context, architectural details, and conventions to assist LLMs and Agents in generating high-quality code for this repository.

## Technology Stack

| Category | Technology | Version | Key Notes |
| :--- | :--- | :--- | :--- |
| **Framework** | **Astro** | v5.16+ | Core framework. Responsible for routing, build, and server-side rendering. |
| **UI Library** | **React** | v18.3 | Used for interactive components (Islands architecture). Integrated via `@astrojs/react`. |
| **Styling** | **Tailwind CSS** | v4.1+ | Utility-first CSS. Configured via `@tailwindcss/vite` in `astro.config.mjs`. |
| **UI Kit** | **DaisyUI** | v4.12 | Component library for Tailwind. Theme: `emerald`. |
| **CMS** | **DatoCMS** | - | Headless CMS. Accessed via GraphQL API. |
| **Build Tool** | **Vite** | - | Underlying bundler for Astro. |
| **Language** | **TypeScript** | v5.5 | Strict type checking enabled. |

## Directory Structure

```text
/
├── public/              # Static assets (favicons, etc.)
├── src/
│   ├── assets/          # Local images and fonts
│   ├── components/      # UI Components (.astro, .tsx)
│   │   ├── Layout.astro # Main layout (Head, GoogleAnalytics, Header, Footer)
│   │   └── product/     # Product-specific React components
│   ├── lib/             # Business logic & Data fetchers
│   │   └── homeFetcher.ts # DatoCMS fetching logic
│   ├── modules/         # Feature-based groupings
│   │   ├── analytics/   # Google Analytics integration
│   │   └── seo/         # SEO components (Head.astro)
│   ├── pages/           # App Routes (Astro file-based routing)
│   │   └── index.astro  # Homepage
│   ├── styles/          # Global styles (global.css)
│   ├── utils/           # Helper functions
│   ├── env.d.ts         # Environment variable type definitions
│   └── types.ts         # Shared TypeScript definitions (CMS Models)
├── astro.config.mjs     # Astro configuration
├── tailwind.config.mjs  # Tailwind configuration
└── tsconfig.json        # TypeScript configuration
```

## Architecture & Patterns

### 1. Data Fetching
-   **SSG/Build-Time Fetching:** Data is primarily fetched at build time (or request time if SSR is enabled) using async functions in `src/lib/`.
-   **DatoCMS Integration:**
    -   API Endpoint: `https://graphql.datocms.com/`
    -   Authentication: `Bearer ${import.meta.env.DATOCMS_API_KEY}`
    -   **Pattern:** Create a dedicated fetcher function (e.g., `fetchHome`) that returns strongly typed data.

### 2. Component Strategy (Islands)
-   **Astro Components (`.astro`):** default for all static content, layouts, and containers.
-   **React Components (`.tsx`):** Used **only** when interactivity is required (e.g., `OrderButton`).
-   **Hydration:** Use client directives sparingly.
    -   `client:load`: Load immediately.
    -   `client:only="react"`: For components that strictly depend on browser APIs or React context availability.
    -   `client:visible`: Load when component enters viewport.

### 3. Styling
-   **Tailwind v4:** Note that this project uses Tailwind v4. Some configuration is in `vite` plugins rather than `tailwind.config.js`.
-   **DaisyUI:** Leverage DaisyUI utility classes (e.g., `btn`, `card`, `badge`) to maintain design consistency.
-   **Fonts:** Custom fonts are managed via `@fontsource` packages and configured in `tailwind.config.mjs`.
    -   `font-ibm-plex-sans-thai`
    -   `font-poppins`
    -   `font-esteban`
    -   `font-sarabun`

## Key Data Models (`src/types.ts`)

When working with product data, adhere to these definitions:

```typescript
export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  salePrice: number;
  available: boolean;
  onSale: boolean;
  onlyDelivery: boolean;
  bestSeller?: boolean;
  recommended?: boolean; // Recommended badge
  powderType?: boolean;  // true = Single Cultivar, false/undefined = Blend
  tasteNote?: string;    // Comma-separated string
  shelfOrder?: number;
  coverImage: {
    responsiveImage: {
      src: string;
      srcSet: string;
      width: number;
      height: number;
      // ... components utilizing images should use Astro's <Image /> or <Picture />
    }
  }
}
```

## Development Workflow

### Commands
-   **Start Dev Server:** `npm run dev`
    -   Runs at `http://localhost:4321`
-   **Type Check & Build:** `npm run build`
    -   Runs `astro check` followed by `astro build`.
    -   Always run this before committing to ensure type safety.
-   **Preview Build:** `npm run preview`

### Rules for Agents
1.  **Stick to the Stack:** Do not introduce new UI libraries (e.g., avoid adding generic React UI kits) unless explicitly requested. Use **DaisyUI + Tailwind**.
2.  **Type Safety:** ensure all new functions have explicit return types. Do not use `any`. Update `src/types.ts` if the CMS schema changes.
3.  **Image Optimization:** Always use Astro's `<Image />` or `<Picture />` components for local and CMS images. Do not use standard `<img>` tags unless absolutely necessary.
4.  **Path Aliases:** Use `@/components` and `@/utils` for cleaner imports.
