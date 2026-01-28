import react from '@astrojs/react'
import playformCompress from '@playform/compress'
import { defineConfig } from 'astro/config'
import sitemap from '@astrojs/sitemap'

import partytown from '@astrojs/partytown'

import tailwindcss from '@tailwindcss/vite'

// https://astro.build/config
export default defineConfig({
  site: 'https://ryuucafe.com',
  integrations: [react(), playformCompress(), sitemap(), partytown()],

  image: {
    domains: ['https://www.datocms-assets.com/'],
  },

  vite: {
    plugins: [tailwindcss()],
  },
})
