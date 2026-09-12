import type { HomeData } from './HomeRepository'

const PLACEHOLDER_COLORS = ['#1a5c3f', '#2d7a52', '#3f9968', '#0f4a30', '#4cb87e', '#166b45']

function placeholderImage(width: number, height: number, seed: number): string {
  const color = PLACEHOLDER_COLORS[seed % PLACEHOLDER_COLORS.length]
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}"><rect width="100%" height="100%" fill="${color}"/></svg>`
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`
}

function mockCoverImage(seed: number) {
  return {
    blurhash: 'L5H2EC=PM+yV0g-mq.wG9c010J}I',
    thumbhash: '1QcSHQRnh493V4dIh4eXh1eIh1h4',
    responsiveImage: {
      src: placeholderImage(640, 480, seed),
      srcSet: '',
      sizes: '(max-width: 768px) 100vw, 33vw',
      width: 640,
      height: 480,
    },
  }
}

function mockResponsiveImage(width: number, height: number, seed: number, alt: string) {
  return {
    sizes: `(max-width: 768px) 100vw, ${width}px`,
    srcSet: '',
    webpSrcSet: '',
    alt,
    src: placeholderImage(width, height, seed),
    width,
    height,
  }
}

export const mockHomeData: HomeData = {
  allCultivars: [
    {
      id: 'cultivar-1',
      name: 'Uji Hikari',
      city: 'Uji',
      region: 'Kansai',
      prefecture: 'Kyoto',
      prefectureId: '26',
      tasteNotes: 'Grassy, Sweet, Umami',
      priceClear: 170,
      priceLatte: 200,
    },
    {
      id: 'cultivar-2',
      name: 'Saemidori',
      city: 'Nishio',
      region: 'Chubu',
      prefecture: 'Aichi',
      prefectureId: '23',
      tasteNotes: 'Floral, Creamy',
      priceClear: 180,
      priceLatte: 210,
    },
    {
      id: 'cultivar-3',
      name: 'Yabukita',
      city: 'Ashikubo',
      region: 'Chubu',
      prefecture: 'Shizuoka',
      prefectureId: '22',
      tasteNotes: 'Balanced, Bitter, Sweet',
      priceClear: 160,
      priceLatte: 190,
    },
    {
      id: 'cultivar-4',
      name: 'Tsuyuhikari',
      city: 'Chiran',
      region: 'Kyushu',
      prefecture: 'Kagoshima',
      prefectureId: '46',
      tasteNotes: 'Umami, Velvety',
      priceClear: 190,
      priceLatte: 220,
    },
    {
      id: 'cultivar-5',
      name: 'Okumidori',
      city: 'Uji',
      region: 'Kansai',
      prefecture: 'Kyoto',
      prefectureId: '26',
      tasteNotes: 'Savory, Bold',
      priceClear: 185,
      priceLatte: 215,
    },
  ],
  allBlends: [
    {
      id: 'blend-1',
      name: 'Signature Blend',
      city: '',
      region: 'All-Japan',
      prefecture: 'Multi-Region',
      concept: 'Our house blend of five cultivars, crafted for a balanced everyday cup.',
      tasteNote: 'Balanced, Smooth',
      available: true,
      bestSeller: true,
      shelfOrder: 1,
      servingPrices: { clear: 150, latte: 180 },
      coverImage: mockCoverImage(5),
    },
    {
      id: 'blend-2',
      name: 'Morning Blend',
      city: '',
      region: 'All-Japan',
      prefecture: 'Multi-Region',
      concept: 'A lighter blend crafted for a gentle caffeine lift to start the day.',
      tasteNote: 'Light, Gentle',
      available: true,
      recommended: true,
      shelfOrder: 2,
      servingPrices: { clear: 145, latte: 175 },
      coverImage: mockCoverImage(0),
    },
    {
      id: 'blend-3',
      name: 'Evening Blend',
      city: '',
      region: 'All-Japan',
      prefecture: 'Multi-Region',
      concept: 'A deeper, richer blend for a slow afternoon wind-down.',
      tasteNote: 'Rich, Deep',
      available: true,
      shelfOrder: 3,
      servingPrices: { clear: 145, latte: 175 },
      coverImage: mockCoverImage(1),
    },
  ],
  allFusions: [
    {
      id: 'fusion-1',
      name: 'Yuzu Matcha',
      description: 'Bright Uji matcha shaken with fresh yuzu.',
      price: 120,
      available: true,
      bestSeller: true,
      onlyDelivery: false,
      shelfOrder: 1,
      coverImage: mockCoverImage(2),
    },
    {
      id: 'fusion-2',
      name: 'Matcha Tonic',
      description: 'Matcha over tonic water with a citrus twist.',
      price: 135,
      available: true,
      onlyDelivery: false,
      shelfOrder: 2,
      coverImage: mockCoverImage(3),
    },
    {
      id: 'fusion-3',
      name: 'Hojicha Cream Matcha',
      description: 'Layered hojicha and matcha topped with cream foam.',
      price: 145,
      available: true,
      recommended: true,
      onlyDelivery: false,
      shelfOrder: 3,
      coverImage: mockCoverImage(4),
    },
    {
      id: 'fusion-4',
      name: 'Strawberry Matcha',
      description: 'Layered strawberry puree and creamy matcha.',
      price: 140,
      available: true,
      onlyDelivery: true,
      shelfOrder: 4,
      coverImage: mockCoverImage(5),
    },
  ],
  pageContent: {
    heroSection: {
      heroTitle: 'Small Space,\nGreat Matcha.',
      heroDescription:
        '5 คาแรคเตอร์มัทฉะที่คุณต้องลอง\nUji Hikari • Saemidori • Yabukita • Tsuyuhikari • Okumidori\nปรุงสดใหม่แก้วต่อแก้วเพื่อรสชาติที่ดีที่สุด',
      heroImage: {
        responsiveImage: mockResponsiveImage(540, 540, 2, 'Matcha Hero'),
      },
      heroBanner: [
        { responsiveImage: mockResponsiveImage(1920, 600, 3, 'Ryuu Matcha Banner 1') },
        { responsiveImage: mockResponsiveImage(1920, 600, 4, 'Ryuu Matcha Banner 2') },
      ],
    },
  },
}
