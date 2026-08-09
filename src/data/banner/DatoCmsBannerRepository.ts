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
