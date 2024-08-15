export type Product = {
  available: boolean
  description: string
  id: string
  name: string
  onSale: boolean
  onlyDelivery: boolean
  price: number
  salePrice: number
  bestSeller?: boolean
  shelfOrder?: number
  powderType?: boolean
  tasteNote?: string
  recommended?: boolean
  coverImage: {
    blurhash: string
    thumbhash: string
    responsiveImage: {
      src: string
      srcSet: string
      sizes: string
      width: number
      height: number
    }
  }
}

export interface PageContent {
  heroSection: HeroSection
}

export interface HeroSection {
  heroImage: HeroImage
  heroTitle: string
  heroDescription: string
}

export interface HeroImage {
  responsiveImage: ResponsiveImage
}

export interface ResponsiveImage {
  sizes: string
  srcSet: string
  webpSrcSet: string
  alt: string
  src: string
  width: number
  height: number
}
