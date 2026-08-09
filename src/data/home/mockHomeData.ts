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
  allProducts: [
    {
      id: 'mock-1',
      name: 'Uji Hikari',
      description: 'A bright, grassy single-cultivar matcha from Uji with a smooth, lingering sweetness.',
      available: true,
      onSale: false,
      onlyDelivery: false,
      price: 120,
      salePrice: 0,
      bestSeller: true,
      shelfOrder: 1,
      powderType: true,
      tasteNote: 'Grassy, Sweet, Umami',
      recommended: true,
      coverImage: mockCoverImage(0),
    },
    {
      id: 'mock-2',
      name: 'Saemidori',
      description: 'Mellow and creamy with a delicate floral aroma.',
      available: true,
      onSale: false,
      onlyDelivery: false,
      price: 130,
      salePrice: 0,
      shelfOrder: 2,
      powderType: true,
      tasteNote: 'Floral, Creamy',
      coverImage: mockCoverImage(1),
    },
    {
      id: 'mock-3',
      name: 'Yabukita',
      description: 'The classic matcha profile — balanced bitterness and sweetness.',
      available: true,
      onSale: true,
      onlyDelivery: false,
      price: 110,
      salePrice: 95,
      shelfOrder: 3,
      powderType: true,
      tasteNote: 'Balanced, Bitter, Sweet',
      coverImage: mockCoverImage(2),
    },
    {
      id: 'mock-4',
      name: 'Tsuyuhikari',
      description: 'Rich umami with a velvety, full-bodied finish.',
      available: true,
      onSale: false,
      onlyDelivery: true,
      price: 140,
      salePrice: 0,
      shelfOrder: 4,
      powderType: true,
      tasteNote: 'Umami, Velvety',
      coverImage: mockCoverImage(3),
    },
    {
      id: 'mock-5',
      name: 'Okumidori',
      description: 'Deep green color with a robust, savory character.',
      available: false,
      onSale: false,
      onlyDelivery: false,
      price: 135,
      salePrice: 0,
      shelfOrder: 5,
      powderType: true,
      tasteNote: 'Savory, Bold',
      coverImage: mockCoverImage(4),
    },
    {
      id: 'mock-6',
      name: 'Signature Blend',
      description: 'Our house blend of five cultivars, crafted for a balanced everyday cup.',
      available: true,
      onSale: false,
      onlyDelivery: false,
      price: 150,
      salePrice: 0,
      bestSeller: true,
      shelfOrder: 6,
      powderType: false,
      tasteNote: 'Balanced, Smooth',
      coverImage: mockCoverImage(5),
    },
    {
      id: 'mock-7',
      name: 'Morning Blend',
      description: 'A lighter blend with a gentle caffeine lift.',
      available: true,
      onSale: false,
      onlyDelivery: false,
      price: 145,
      salePrice: 0,
      shelfOrder: 7,
      powderType: false,
      tasteNote: 'Light, Gentle',
      recommended: true,
      coverImage: mockCoverImage(0),
    },
    {
      id: 'mock-8',
      name: 'Evening Blend',
      description: 'A deeper, richer blend for a slow afternoon.',
      available: true,
      onSale: false,
      onlyDelivery: false,
      price: 145,
      salePrice: 0,
      shelfOrder: 8,
      powderType: false,
      tasteNote: 'Rich, Deep',
      coverImage: mockCoverImage(1),
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
