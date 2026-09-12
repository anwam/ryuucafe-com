export type BranchStatus = 'open' | 'coming_soon'

export interface Branch {
  id: 'bkk' | 'korat' | string
  name: string
  nameTh: string
  nameJp?: string
  subnameTh: string
  status: BranchStatus
  statusLabel: string
  badgeLabel: string
  tagline: string
  description: string
  address: {
    short: string
    full: string
    province: string
    landmark?: string
  }
  openingHours?: string
  googleMapsUrl?: string
  phone?: string
  storefrontImage: {
    src: string
    alt: string
    caption?: string
  }
  features: string[]
  deliveryAvailable: boolean
  deliveryNote?: string
}
