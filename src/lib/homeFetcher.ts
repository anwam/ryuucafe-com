import type { Product, PageContent } from '../types'

export async function fetchHome(): Promise<{
  allProducts: Product[]
  pageContent: PageContent
}> {
  const response = await fetch('https://graphql.datocms.com/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${import.meta.env.DATOCMS_API_KEY}`,
    },
    body: JSON.stringify({
      query: `
      {
        allProducts(orderBy: shelfOrder_ASC) {
          available
          description
          id
          name
          onSale
          onlyDelivery
          price
          salePrice
          bestSeller
          shelfOrder
          tasteNote
          powderType
          recommended
          coverImage {
            blurhash
            thumbhash
            responsiveImage(imgixParams: { auto: compress, fm: webp, q: 100, minW: 300, w: 640 }) {
                src
                srcSet
                sizes
                width
                height
            }
          }
        }
        pageContent {
          heroSection {
            heroImage {
              responsiveImage(imgixParams: {w: 480, h: 320}) {
                sizes
                srcSet
                webpSrcSet
                alt
                src
                width
                height
              }
            }
            heroTitle
            heroDescription
          }
        }
      }`,
    }),
  })

  const json = (await response.json()) as {
    data: { allProducts: Product[]; pageContent: PageContent }
  }

  return {
    allProducts: json.data.allProducts,
    pageContent: json.data.pageContent,
  }
}
