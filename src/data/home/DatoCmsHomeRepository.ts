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
