import type { HeroBanner } from '../types'

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

export async function fetchHeroBanners(): Promise<HeroBanner[]> {
  const apiKey = import.meta.env.PUBLIC_DATOCMS_API_KEY
  if (!apiKey) {
    return []
  }

  try {
    const response = await fetch('https://graphql.datocms.com/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({ query: HERO_BANNER_QUERY }),
    })

    if (!response.ok) {
      return []
    }

    const json = (await response.json()) as HeroBannerResponse
    return json.data?.pageContent?.heroSection?.heroBanner ?? []
  } catch {
    return []
  }
}
