import type { HeroBanner } from '@/domain/home/types'

export interface BannerRepository {
  getHeroBanners(): Promise<HeroBanner[]>
}
