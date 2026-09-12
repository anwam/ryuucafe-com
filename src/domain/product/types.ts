export type CoverImage = {
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

/** Static serving prices shown as tags (e.g. "Clear: ฿170 | Latte: ฿200") */
export type ServingPrices = {
  clear?: number | null
  latte?: number | null
}

/** Section 1: Single Cultivar (Ceremonial Grade) — selected via an interactive Japan map */
export type Cultivar = {
  id: string
  name: string
  /** City or terroir town, e.g. "Uji", "Yame", "Nishio", "Mori", "Chiran", "Ise" */
  city?: string
  /** Region name in Japan, e.g. "Kansai", "Kyushu", "Chubu" */
  region?: string
  /** Prefecture display name, e.g. "Kyoto" */
  prefecture: string
  /** JIS prefecture code matching the Japan topojson `properties.id`, e.g. "26" */
  prefectureId: string
  tasteNotes: string
  priceClear: number | null
  priceLatte: number | null
}

/** Section 2: House Blends — same card layout as Cultivar */
export type Blend = {
  available: boolean
  id: string
  name: string
  /** City or terroir town if single-origin blend */
  city?: string
  /** Region name */
  region?: string
  /** Prefecture display name */
  prefecture?: string
  /** JIS prefecture code */
  prefectureId?: string
  concept: string
  tasteNote: string
  bestSeller?: boolean
  recommended?: boolean
  shelfOrder?: number
  servingPrices: ServingPrices
  coverImage: CoverImage
}

/** Section 3: Fusion & Fancy — standard ready-to-drink product card */
export type FusionProduct = {
  available: boolean
  description?: string
  id: string
  name: string
  onlyDelivery: boolean
  price: number | null
  bestSeller?: boolean
  recommended?: boolean
  shelfOrder?: number
  coverImage: CoverImage
}
