import react from '@astrojs/react'
import playformCompress from '@playform/compress'
import { defineConfig, fontProviders } from 'astro/config'
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

  fonts: [
    {
      provider: fontProviders.fontsource(),
      name: 'Poppins',
      cssVariable: '--font-poppins',
      weights: [400, 500, 600, 700, 800],
      styles: ['normal'],
    },
    {
      provider: fontProviders.fontsource(),
      name: 'IBM Plex Sans Thai',
      cssVariable: '--font-ibm-plex-sans-thai',
      weights: [400, 500],
      styles: ['normal'],
      subsets: ['thai', 'latin'],
    },
    {
      provider: fontProviders.fontsource(),
      name: 'Esteban',
      cssVariable: '--font-esteban',
      weights: [400],
      styles: ['normal'],
    },
    {
      provider: fontProviders.fontsource(),
      name: 'Sarabun',
      cssVariable: '--font-sarabun',
      weights: [400],
      styles: ['normal'],
      subsets: ['thai', 'latin'],
    },
  ],

  vite: {
    plugins: [tailwindcss()],
  },
})
