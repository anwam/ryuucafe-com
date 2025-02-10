import react from '@astrojs/react'
import tailwind from '@astrojs/tailwind'
import playformCompress from '@playform/compress'
import { defineConfig } from 'astro/config'
import sitemap from '@astrojs/sitemap'

import partytown from '@astrojs/partytown'

// https://astro.build/config
export default defineConfig({
  site: 'https://ryuucafe.com',
  integrations: [
    tailwind({
      configFile: './tailwind.config.mjs',
      applyBaseStyles: true,
    }),
    react(),
    playformCompress(),
    sitemap(),
    partytown(),
  ],
  image: {
    domains: ['https://www.datocms-assets.com/'],
  },
})
