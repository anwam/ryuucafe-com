# Ryuucafe.com

The official website for Ryuucafe, built with Astro, React, and DatoCMS.

## Tech Stack

- **Framework:** [Astro 5](https://astro.build) (MPA Architecture)
- **UI Library:** [React 18](https://react.dev) (Islands Architecture)
- **Styling:** [Tailwind CSS 4](https://tailwindcss.com) (via `@tailwindcss/vite`)
- **CMS:** [DatoCMS](https://www.datocms.com/) (GraphQL API)
- **Tooling:** [Biome](https://biomejs.dev/) (Linting & Formatting), TypeScript 5.5

## Getting Started

### Prerequisites

- Node.js (v20+ recommended)
- `npm` package manager

### Environment Variables

Copy `sample.env` to `.env` and fill in the required values:

```bash
cp sample.env .env
```

**Required Variables:**
- `DATOCMS_API_KEY`: API Token for DatoCMS (Read-only access)

### Installation

```bash
npm install
```

### Local Development

Start the development server:

```bash
npm run dev
```

The site will be available at `http://localhost:4321`.

### Building for Production

```bash
npm run build
```

This command runs `astro check` to verify types before building the static assets to the `dist/` directory.

## Project Architecture & Patterns

### 1. Data Fetching
Data fetching logic is strictly separated from UI components.
- **Location:** `src/lib/*Fetcher.ts`
- **Pattern:** functions return typed data structures matching CMS models.
- **Rule:** Do not fetch data directly inside `.astro` or `.tsx` components.

### 2. Styling (Tailwind v4)
- **Config:** CSS variables and theme configuration are located in `src/styles/global.css`.
- **Note:** This project does not use a `tailwind.config.js` file.

### 3. Fonts
Fonts are managed via `@fontsource` packages (IBM Plex Sans Thai, Poppins, etc.).

## Development Workflow

- **Type Checking:** Run `npm run build` locally to catch type errors (includes `astro check`).
- **Formatting:** The project uses Biome. Format on save should be enabled in your editor.
