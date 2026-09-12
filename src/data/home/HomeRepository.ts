import type { PageContent } from '@/domain/home/types'
import type { Blend, Cultivar, FusionProduct } from '@/domain/product/types'

export interface HomeData {
  allCultivars: Cultivar[]
  allBlends: Blend[]
  allFusions: FusionProduct[]
  pageContent: PageContent
}

export interface HomeRepository {
  getHome(): Promise<HomeData>
}
