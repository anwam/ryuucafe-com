import type { PageContent } from '@/domain/home/types'
import type { Blend, Cultivar, FusionProduct } from '@/domain/product/types'
import { postDatoCmsQuery } from '../datocms/client'
import type { HomeData, HomeRepository } from './HomeRepository'
import { mockHomeData } from './mockHomeData'

const HOME_QUERY = `
{
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
  allCultivars(first: 100) {
    id
    name
    city
    region
    prefecture
    prefectureId
    tasteNotes
    priceClear
    priceLatte
  }
  allBlends(first: 100, orderBy: shelfOrder_ASC) {
    id
    name
    city
    region
    prefecture
    prefectureId
    concept
    tasteNote
    available
    bestSeller
    recommended
    shelfOrder
    servingPrices
    coverImage {
      blurhash
      thumbhash
      responsiveImage(imgixParams: {w: 640, h: 480, fit: crop, auto: format}) {
        src
        srcSet
        sizes
        width
        height
      }
    }
  }
  allProducts(first: 100, filter: { traditionalMenu: { eq: false }, powderType: { eq: false } }, orderBy: shelfOrder_ASC) {
    id
    name
    description
    price
    available
    bestSeller
    recommended
    onlyDelivery
    shelfOrder
    coverImage {
      blurhash
      thumbhash
      responsiveImage(imgixParams: {w: 640, h: 480, fit: crop, auto: format}) {
        src
        srcSet
        sizes
        width
        height
      }
    }
  }
}`

interface DatoCmsHomeResponse {
  data: {
    pageContent?: PageContent
    allCultivars?: Cultivar[]
    allBlends?: Blend[]
    allProducts?: FusionProduct[]
  }
}

class DatoCmsHomeRepository implements HomeRepository {
  async getHome(): Promise<HomeData> {
    const apiKey = import.meta.env.DATOCMS_API_KEY
    if (!apiKey) {
      return mockHomeData
    }

    try {
      const response = await postDatoCmsQuery(HOME_QUERY, apiKey)
      if (!response.ok) {
        console.error('Failed to fetch data from DatoCMS:', response.statusText)
        return mockHomeData
      }

      const json = (await response.json()) as DatoCmsHomeResponse
      const data = json.data

      return {
        pageContent: data?.pageContent ?? mockHomeData.pageContent,
        allCultivars:
          data?.allCultivars && data.allCultivars.length > 0
            ? data.allCultivars
            : mockHomeData.allCultivars,
        allBlends:
          data?.allBlends && data.allBlends.length > 0 ? data.allBlends : mockHomeData.allBlends,
        allFusions:
          data?.allProducts && data.allProducts.length > 0
            ? data.allProducts
            : mockHomeData.allFusions,
      }
    } catch (error) {
      console.error('Error fetching home data from DatoCMS:', error)
      return mockHomeData
    }
  }
}

export const homeRepository: HomeRepository = new DatoCmsHomeRepository()
