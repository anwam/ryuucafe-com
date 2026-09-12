export type ResponsiveImage = {
  src: string
  srcSet: string
  sizes: string
  width: number
  height: number
}

export type CoverImage = {
  blurhash: string
  thumbhash: string
  responsiveImage: ResponsiveImage
}

/** Per-serving prices. `null` means the serving is not offered yet (coming soon). */
export type ServingPrices = {
  clear: number | null
  latte: number | null
}

/** A single-cultivar matcha, tied to its Japanese prefecture of origin. */
export type Cultivar = {
  id: string
  name: string
  /** Matches the `id` property of a feature in `/data/japan-prefectures.topojson`. */
  prefectureId: string
  prefecture: string
  city?: string
  region?: string
  /** Comma-separated notes, split for display. */
  tasteNotes: string
  priceClear: number | null
  priceLatte: number | null
}

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
  coverImage: CoverImage
}
