# Clean Architecture Restructure — Design

Date: 2026-08-09

## Motivation

Codebase is small (~20 files, single page, 2 fetchers) but growing. Goal is
to align with SOLID, especially Separation of Concerns, so both humans and
coding agents can work with precise, bounded context per layer — not to
future-proof for CMS swaps or add test infrastructure. This is a pure
restructure: no behavior change, no new tooling, no tests added.

## Scope

- Reorganize `src/` into layered folders (domain / data / presentation / shared).
- Introduce repository interfaces in the data layer, with DatoCMS
  implementations behind them.
- Split `src/types.ts` into per-feature domain type files.
- Update all imports and `tsconfig.json` path aliases accordingly.
- Codify the new import rules in `CLAUDE.md`.
- Out of scope: adding a test suite, changing DatoCMS query shapes, adding
  new features, changing visual/behavioral output.

## Target structure

```
src/
  domain/                    # pure types, zero framework deps
    home/types.ts            # HeroSection, PageContent, etc.
    product/types.ts         # Product
    banner/types.ts
  data/                      # repository interfaces + DatoCMS implementations
    home/
      HomeRepository.ts          # interface: getHome(): Promise<PageContent>
      DatoCmsHomeRepository.ts   # implementation (current homeFetcher.ts logic)
    banner/
      BannerRepository.ts
      DatoCmsBannerRepository.ts
    datocms/client.ts        # shared GraphQL client (fetch wrapper, auth header)
  presentation/               # .astro + .tsx, consumes domain types only
    layout/Layout.astro, Header.astro, Footer.astro
    home/HeroCarousel.tsx, ProductItem.astro
    product/OrderButton.tsx
    seo/Head.astro
    analytics/GoogleAnalytics.astro
  shared/
    ui/                       # button.tsx, carousel.tsx, ShopeeIcon.tsx (Radix primitives)
    utils/cn.ts, scrollToNode.ts
  pages/
    index.astro                # thin: calls data repo, passes domain types to presentation
```

## Layer rules (to be written into CLAUDE.md)

- `domain/*` imports nothing from `data/` or `presentation/`.
- `data/*` implements `domain` interfaces; imports the DatoCMS client only.
- `presentation/*` imports `domain` types only, never `data/*` directly —
  pages wire data → presentation.
- `pages/*.astro` stay thin: fetch via repository, pass props down. No
  markup/logic beyond composition.

## Migration mechanics

- Use `git mv` where possible to preserve file history.
- Update all import paths and `tsconfig.json` path aliases (`@/domain/*`,
  `@/data/*`, `@/presentation/*`, `@/shared/*`).
- Run `npm run build` (`astro check` + `astro build`) to verify no
  regressions after the move.
- Format with Biome per existing project convention.

## Decisions made during brainstorming (for context)

- Lighter layered split chosen over full 4-ring Clean Architecture (entities/
  use-cases/interface-adapters/frameworks) — no real runtime business rules
  exist in this SSG site, so the extra ceremony wasn't justified.
- Repository interfaces chosen over concrete-only fetchers, despite no
  stated need to swap CMS — user wants the abstraction for SoC/testability
  even though tests aren't being added in this pass.
- Layer-first top-level folders chosen over feature-first, per user
  preference.
- No test suite added in this pass — structure should be test-ready but
  actual test tooling (vitest) is separate future work.
