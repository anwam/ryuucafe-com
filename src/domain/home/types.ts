export interface PageContent {
  heroSection: HeroSection
}

export interface HeroSection {
  heroImage: HeroImage
  heroTitle: string
  heroDescription: string
  heroBanner?: HeroBanner[]
}

export interface HeroBanner {
  responsiveImage: ResponsiveImage
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
