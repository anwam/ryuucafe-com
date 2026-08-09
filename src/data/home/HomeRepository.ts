import type { PageContent } from '@/domain/home/types'
import type { Product } from '@/domain/product/types'

export interface HomeData {
  allProducts: Product[]
  pageContent: PageContent
}

export interface HomeRepository {
  getHome(): Promise<HomeData>
}
