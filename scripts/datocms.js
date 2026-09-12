import 'dotenv/config'

const DATOCMS_CMA_BASE = 'https://site-api.datocms.com'

/**
 * Creates headers for DatoCMS Content Management API v3 requests.
 * @param {string} apiKey
 */
function getHeaders(apiKey) {
  return {
    Authorization: `Bearer ${apiKey}`,
    Accept: 'application/json',
    'Content-Type': 'application/vnd.api+json',
    'X-Api-Version': '3',
  }
}

/**
 * Executes a CMA request and parses JSON response.
 * @param {string} endpoint
 * @param {string} apiKey
 * @param {object} options
 */
async function cmaFetch(endpoint, apiKey, options = {}) {
  const url = endpoint.startsWith('http') ? endpoint : `${DATOCMS_CMA_BASE}${endpoint}`
  const res = await fetch(url, {
    ...options,
    headers: {
      ...getHeaders(apiKey),
      ...(options.headers || {}),
    },
  })

  if (res.status === 204) {
    return null
  }

  const json = await res.json().catch(() => null)
  if (!res.ok) {
    const errors = json?.errors ? JSON.stringify(json.errors, null, 2) : res.statusText
    throw new Error(`DatoCMS CMA Error [${res.status} ${res.url}]: ${errors}`)
  }

  return { status: res.status, ...json }
}

/**
 * Polls an asynchronous job until completion.
 * @param {string} jobId
 * @param {string} apiKey
 */
async function waitForJob(jobId, apiKey) {
  const maxAttempts = 30
  for (let i = 0; i < maxAttempts; i++) {
    await new Promise((resolve) => setTimeout(resolve, 500))
    const result = await cmaFetch(`/job-results/${jobId}`, apiKey, { method: 'GET' })
    if (result?.data?.attributes?.status) {
      if (result.data.attributes.status >= 400) {
        throw new Error(
          `DatoCMS Job failed: ${JSON.stringify(result.data.attributes.payload ?? result.data.attributes)}`,
        )
      }
      return result.data.attributes.payload
    }
  }
  throw new Error(`Timeout waiting for DatoCMS job ${jobId}`)
}

/**
 * Schema definitions for Single Cultivars and House Blends.
 */
export const SCHEMA_DEFINITIONS = [
  {
    name: 'Single Cultivar',
    apiKey: 'cultivar',
    modularBlock: false,
    fields: [
      {
        label: 'Name',
        apiKey: 'name',
        fieldType: 'string',
        validators: { required: {} },
        appearance: { editor: 'single_line', parameters: { heading: false }, addons: [] },
      },
      {
        label: 'City',
        apiKey: 'city',
        fieldType: 'string',
        validators: {},
        appearance: { editor: 'single_line', parameters: { heading: false }, addons: [] },
      },
      {
        label: 'Region',
        apiKey: 'region',
        fieldType: 'string',
        validators: {},
        appearance: { editor: 'single_line', parameters: { heading: false }, addons: [] },
      },
      {
        label: 'Prefecture',
        apiKey: 'prefecture',
        fieldType: 'string',
        validators: { required: {} },
        appearance: { editor: 'single_line', parameters: { heading: false }, addons: [] },
      },
      {
        label: 'Prefecture ID',
        apiKey: 'prefecture_id',
        fieldType: 'string',
        validators: { required: {} },
        appearance: { editor: 'single_line', parameters: { heading: false }, addons: [] },
      },
      {
        label: 'Taste Notes',
        apiKey: 'taste_notes',
        fieldType: 'string',
        validators: {},
        appearance: { editor: 'single_line', parameters: { heading: false }, addons: [] },
      },
      {
        label: 'Price Clear',
        apiKey: 'price_clear',
        fieldType: 'float',
        validators: {},
        appearance: { editor: 'float', parameters: {}, addons: [] },
      },
      {
        label: 'Price Latte',
        apiKey: 'price_latte',
        fieldType: 'float',
        validators: {},
        appearance: { editor: 'float', parameters: {}, addons: [] },
      },
    ],
  },
  {
    name: 'House Blend',
    apiKey: 'blend',
    modularBlock: false,
    fields: [
      {
        label: 'Name',
        apiKey: 'name',
        fieldType: 'string',
        validators: { required: {} },
        appearance: { editor: 'single_line', parameters: { heading: false }, addons: [] },
      },
      {
        label: 'City',
        apiKey: 'city',
        fieldType: 'string',
        validators: {},
        appearance: { editor: 'single_line', parameters: { heading: false }, addons: [] },
      },
      {
        label: 'Region',
        apiKey: 'region',
        fieldType: 'string',
        validators: {},
        appearance: { editor: 'single_line', parameters: { heading: false }, addons: [] },
      },
      {
        label: 'Prefecture',
        apiKey: 'prefecture',
        fieldType: 'string',
        validators: {},
        appearance: { editor: 'single_line', parameters: { heading: false }, addons: [] },
      },
      {
        label: 'Prefecture ID',
        apiKey: 'prefecture_id',
        fieldType: 'string',
        validators: {},
        appearance: { editor: 'single_line', parameters: { heading: false }, addons: [] },
      },
      {
        label: 'Concept',
        apiKey: 'concept',
        fieldType: 'text',
        validators: {},
        appearance: { editor: 'textarea', parameters: {}, addons: [] },
      },
      {
        label: 'Taste Note',
        apiKey: 'taste_note',
        fieldType: 'string',
        validators: {},
        appearance: { editor: 'single_line', parameters: { heading: false }, addons: [] },
      },
      {
        label: 'Available',
        apiKey: 'available',
        fieldType: 'boolean',
        validators: {},
        appearance: { editor: 'boolean', parameters: {}, addons: [] },
      },
      {
        label: 'Best Seller',
        apiKey: 'best_seller',
        fieldType: 'boolean',
        validators: {},
        appearance: { editor: 'boolean', parameters: {}, addons: [] },
      },
      {
        label: 'Recommended',
        apiKey: 'recommended',
        fieldType: 'boolean',
        validators: {},
        appearance: { editor: 'boolean', parameters: {}, addons: [] },
      },
      {
        label: 'Shelf Order',
        apiKey: 'shelf_order',
        fieldType: 'integer',
        validators: {},
        appearance: { editor: 'integer', parameters: {}, addons: [] },
      },
      {
        label: 'Serving Prices',
        apiKey: 'serving_prices',
        fieldType: 'json',
        validators: {},
        appearance: { editor: 'json', parameters: {}, addons: [] },
      },
      {
        label: 'Cover Image',
        apiKey: 'cover_image',
        fieldType: 'file',
        validators: {},
        appearance: { editor: 'file', parameters: {}, addons: [] },
      },
    ],
  },
]

/**
 * Organized Cultivars & Blends list with dedicated City & Region.
 *
 * JIS IDs:
 * - Fukuoka: '40'
 * - Kyoto: '26'
 * - Aichi: '23'
 * - Shizuoka: '22'
 * - Kagoshima: '46'
 * - Mie: '24'
 */
export const ORGANIZED_TEA_DATA = {
  cultivars: [
    // Fukuoka (JIS: 40) - Yame | Kyushu
    {
      name: 'Yabukita',
      city: 'Yame',
      region: 'Kyushu',
      prefecture: 'Fukuoka',
      prefecture_id: '40',
      taste_notes: 'Nutty, Rich Umami, Sweet Aftertaste',
      price_clear: 175,
      price_latte: 205,
    },
    {
      name: 'Okumidori',
      city: 'Yame',
      region: 'Kyushu',
      prefecture: 'Fukuoka',
      prefecture_id: '40',
      taste_notes: 'Deep Green, Smooth, Mild Astringency',
      price_clear: 185,
      price_latte: 215,
    },

    // Kyoto (JIS: 26) - Uji | Kansai
    {
      name: 'Uji Hikari',
      city: 'Uji',
      region: 'Kansai',
      prefecture: 'Kyoto',
      prefecture_id: '26',
      taste_notes: 'Grassy, Sweet, Umami',
      price_clear: 170,
      price_latte: 200,
    },
    {
      name: 'Samidori',
      city: 'Uji',
      region: 'Kansai',
      prefecture: 'Kyoto',
      prefecture_id: '26',
      taste_notes: 'Floral, Bright Umami, Elegant',
      price_clear: 195,
      price_latte: 225,
    },
    {
      name: 'Okumidori',
      city: 'Uji',
      region: 'Kansai',
      prefecture: 'Kyoto',
      prefecture_id: '26',
      taste_notes: 'Savory, Bold',
      price_clear: 185,
      price_latte: 215,
    },

    // Aichi (JIS: 23) - Nishio | Chubu
    {
      name: 'Saemidori',
      city: 'Nishio',
      region: 'Chubu',
      prefecture: 'Aichi',
      prefecture_id: '23',
      taste_notes: 'Floral, Creamy',
      price_clear: 180,
      price_latte: 210,
    },
    {
      name: 'Yabukita',
      city: 'Nishio',
      region: 'Chubu',
      prefecture: 'Aichi',
      prefecture_id: '23',
      taste_notes: 'Fresh Green, Crisp, Balanced',
      price_clear: 165,
      price_latte: 195,
    },
    {
      name: 'Okumidori',
      city: 'Nishio',
      region: 'Chubu',
      prefecture: 'Aichi',
      prefecture_id: '23',
      taste_notes: 'Deep Richness, Velvet, Round',
      price_clear: 180,
      price_latte: 210,
    },

    // Shizuoka (JIS: 22) - Mori | Chubu
    {
      name: 'Tsuyuhikari',
      city: 'Mori',
      region: 'Chubu',
      prefecture: 'Shizuoka',
      prefecture_id: '22',
      taste_notes: 'Floral, Sweet Aroma, Refreshing',
      price_clear: 185,
      price_latte: 215,
    },
    {
      name: 'Kanaya Midori',
      city: 'Mori',
      region: 'Chubu',
      prefecture: 'Shizuoka',
      prefecture_id: '22',
      taste_notes: 'Milky Aroma, Floral, Creamy',
      price_clear: 175,
      price_latte: 205,
    },
    {
      name: 'Saemidori',
      city: 'Mori',
      region: 'Chubu',
      prefecture: 'Shizuoka',
      prefecture_id: '22',
      taste_notes: 'Sweet, Vivid Color, Smooth',
      price_clear: 180,
      price_latte: 210,
    },
    {
      name: 'Okumidori',
      city: 'Mori',
      region: 'Chubu',
      prefecture: 'Shizuoka',
      prefecture_id: '22',
      taste_notes: 'Rich Body, Gentle Bitterness, Sweet',
      price_clear: 180,
      price_latte: 210,
    },

    // Shizuoka (JIS: 22) - Ashikubo | Chubu
    {
      name: 'Okumidori',
      city: 'Ashikubo',
      region: 'Chubu',
      prefecture: 'Shizuoka',
      prefecture_id: '22',
      taste_notes: 'Earthy, Rich, Velvety',
      price_clear: 180,
      price_latte: 210,
    },
    {
      name: 'Yabukita',
      city: 'Ashikubo',
      region: 'Chubu',
      prefecture: 'Shizuoka',
      prefecture_id: '22',
      taste_notes: 'Balanced, Bitter, Sweet',
      price_clear: 160,
      price_latte: 190,
    },

    // Kagoshima (JIS: 46) - Chiran | Kyushu
    {
      name: 'Asahi',
      city: 'Chiran',
      region: 'Kyushu',
      prefecture: 'Kagoshima',
      prefecture_id: '46',
      taste_notes: 'Intense Umami, Creamy, Sweet Finish',
      price_clear: 200,
      price_latte: 230,
    },
    {
      name: 'Saemidori',
      city: 'Chiran',
      region: 'Kyushu',
      prefecture: 'Kagoshima',
      prefecture_id: '46',
      taste_notes: 'Rich Umami, Emerald Green, Smooth',
      price_clear: 185,
      price_latte: 215,
    },
    {
      name: 'Haruto 34',
      city: 'Chiran',
      region: 'Kyushu',
      prefecture: 'Kagoshima',
      prefecture_id: '46',
      taste_notes: 'Fruity, Citrusy, Exotic Umami',
      price_clear: 190,
      price_latte: 220,
    },
    {
      name: 'Tsuyuhikari',
      city: 'Chiran',
      region: 'Kyushu',
      prefecture: 'Kagoshima',
      prefecture_id: '46',
      taste_notes: 'Umami, Velvety',
      price_clear: 190,
      price_latte: 220,
    },

    // Kagoshima (JIS: 46) - Shibushi | Kyushu
    {
      name: 'Seimei',
      city: 'Shibushi',
      region: 'Kyushu',
      prefecture: 'Kagoshima',
      prefecture_id: '46',
      taste_notes: 'Vibrant Color, Clean Umami, Silky',
      price_clear: 185,
      price_latte: 215,
    },

    // Mie (JIS: 24) - Ise | Kansai
    {
      name: 'Saemidori',
      city: 'Ise',
      region: 'Kansai',
      prefecture: 'Mie',
      prefecture_id: '24',
      taste_notes: 'Sweet Aroma, Gentle, Mellow',
      price_clear: 170,
      price_latte: 200,
    },
    {
      name: 'Samidori',
      city: 'Ise',
      region: 'Kansai',
      prefecture: 'Mie',
      prefecture_id: '24',
      taste_notes: 'Aromatic, Refreshing Umami, Clean',
      price_clear: 180,
      price_latte: 210,
    },
    {
      name: 'Okumidori',
      city: 'Ise',
      region: 'Kansai',
      prefecture: 'Mie',
      prefecture_id: '24',
      taste_notes: 'Deep Flavor, Roasted Nutty, Smooth',
      price_clear: 180,
      price_latte: 210,
    },
    {
      name: 'Yabukita',
      city: 'Ise',
      region: 'Kansai',
      prefecture: 'Mie',
      prefecture_id: '24',
      taste_notes: 'Classic Herbal, Crisp, Balanced',
      price_clear: 165,
      price_latte: 195,
    },
  ],

  blends: [
    // House Signature Blends
    {
      name: 'RYUU Signature Blend',
      city: '',
      region: 'All-Japan',
      prefecture: 'Multi-Region',
      prefecture_id: '',
      concept: 'Our house blend of five cultivars, crafted for a balanced everyday cup.',
      taste_note: 'Balanced, Smooth',
      available: true,
      best_seller: true,
      recommended: false,
      shelf_order: 1,
      serving_prices: { clear: 150, latte: 180 },
    },
    // Regional Origin Blends
    {
      name: 'Yame Blend',
      city: 'Yame',
      region: 'Kyushu',
      prefecture: 'Fukuoka',
      prefecture_id: '40',
      concept: 'A rich and rounded blend of Yabukita & Okumidori from Yame, Fukuoka.',
      taste_note: 'Nutty, Rich Umami, Sweet',
      available: true,
      best_seller: false,
      recommended: false,
      shelf_order: 4,
      serving_prices: { clear: 155, latte: 185 },
    },
    {
      name: 'Uji Blend',
      city: 'Uji',
      region: 'Kansai',
      prefecture: 'Kyoto',
      prefecture_id: '26',
      concept: 'Traditional ceremonial blend crafted with Samidori and Okumidori from Uji, Kyoto.',
      taste_note: 'Rich Umami, Elegant, Velvety',
      available: true,
      best_seller: false,
      recommended: true,
      shelf_order: 5,
      serving_prices: { clear: 165, latte: 195 },
    },
    {
      name: 'Nishio Blend',
      city: 'Nishio',
      region: 'Chubu',
      prefecture: 'Aichi',
      prefecture_id: '23',
      concept:
        'Harmonious blend of Aichi Nishio harvest with brilliant color and balanced sweetness.',
      taste_note: 'Fresh Green, Bright, Balanced',
      available: true,
      best_seller: false,
      recommended: false,
      shelf_order: 6,
      serving_prices: { clear: 150, latte: 180 },
    },
    {
      name: 'Mori Blend',
      city: 'Mori',
      region: 'Chubu',
      prefecture: 'Shizuoka',
      prefecture_id: '22',
      concept: 'Shizuoka Mori blend featuring Kanaya Midori for a unique milky aroma.',
      taste_note: 'Milky Aroma, Floral, Smooth',
      available: true,
      best_seller: false,
      recommended: false,
      shelf_order: 7,
      serving_prices: { clear: 155, latte: 185 },
    },
    {
      name: 'Ashikubo Blend',
      city: 'Ashikubo',
      region: 'Chubu',
      prefecture: 'Shizuoka',
      prefecture_id: '22',
      concept: 'Mountain terroir blend from historic Ashikubo with deep mineral undertones.',
      taste_note: 'Earthy, Deep, Sweet Aftertaste',
      available: true,
      best_seller: false,
      recommended: false,
      shelf_order: 8,
      serving_prices: { clear: 150, latte: 180 },
    },
    {
      name: 'Chiran Blend',
      city: 'Chiran',
      region: 'Kyushu',
      prefecture: 'Kagoshima',
      prefecture_id: '46',
      concept: 'Southern sunshine blend combining Asahi, Saemidori, and Haruto 34 from Chiran.',
      taste_note: 'Intense Umami, Creamy, Fruity',
      available: true,
      best_seller: false,
      recommended: true,
      shelf_order: 9,
      serving_prices: { clear: 160, latte: 190 },
    },
    {
      name: 'Shibushi Blend',
      city: 'Shibushi',
      region: 'Kyushu',
      prefecture: 'Kagoshima',
      prefecture_id: '46',
      concept: 'Pure volcanic soil blend from Shibushi with vivid emerald tone and silky texture.',
      taste_note: 'Vibrant, Clean Umami, Silky',
      available: true,
      best_seller: false,
      recommended: false,
      shelf_order: 10,
      serving_prices: { clear: 150, latte: 180 },
    },
    {
      name: 'Ise Blend',
      city: 'Ise',
      region: 'Kansai',
      prefecture: 'Mie',
      prefecture_id: '24',
      concept: 'Fragrant blend from historic Ise shrine region with gentle, soothing sweetness.',
      taste_note: 'Soothing, Sweet Aroma, Mellow',
      available: true,
      best_seller: false,
      recommended: false,
      shelf_order: 11,
      serving_prices: { clear: 150, latte: 180 },
    },
  ],
}

function normalizeProductName(name) {
  return name
    .trim()
    .toLowerCase()
    .replace(/\s+-\s+.*/, '')
    .replace(/\s+/g, ' ')
}

/**
 * Loads prices from the legacy Product schema for name-based migration.
 * Exact name matches take priority; a single unambiguous containment match is also accepted.
 * Unmatched or ambiguous menu entries use null.
 */
async function getLegacyProductPrices(apiKey, itemTypeMap) {
  const productItemTypeId = itemTypeMap.product?.id
  if (!productItemTypeId) {
    console.warn('Legacy Product item type not found; tea prices will be set to null.')
    return new Map()
  }

  const productsRes = await cmaFetch(
    `/items?filter[type]=${productItemTypeId}&page[limit]=100`,
    apiKey,
  )
  const products = []

  for (const product of productsRes.data || []) {
    const { name, price } = product.attributes
    if (typeof name === 'string' && typeof price === 'number') {
      products.push({ name: normalizeProductName(name), price })
    }
  }

  console.log(`Found ${products.length} priced legacy Product record(s).`)
  return products
}

function findLegacyProductPrice(products, teaName) {
  const normalizedTeaName = normalizeProductName(teaName)
  const exactMatches = products.filter((product) => product.name === normalizedTeaName)
  if (exactMatches.length === 1) {
    return exactMatches[0].price
  }

  const containingMatches = products.filter(
    (product) =>
      product.name.includes(normalizedTeaName) || normalizedTeaName.includes(product.name),
  )
  if (containingMatches.length === 1) {
    return containingMatches[0].price
  }

  if (containingMatches.length > 1) {
    console.warn(`Ambiguous legacy Product price match for "${teaName}"; using null.`)
  }
  return null
}

/**
 * Creates or updates DatoCMS schema for models and their fields.
 * @param {string} apiKey
 * @returns {Promise<Record<string, { id: string, name: string, apiKey: string }>>}
 */
export async function createOrUpdateSchema(apiKey) {
  console.log('Fetching existing DatoCMS item types...')
  const existingTypesRes = await cmaFetch('/item-types', apiKey)
  const existingItemTypes = existingTypesRes.data || []

  /** @type {Record<string, { id: string, name: string, apiKey: string }>} */
  const itemTypeMap = {}

  for (const modelDef of SCHEMA_DEFINITIONS) {
    let itemType = existingItemTypes.find((it) => it.attributes.api_key === modelDef.apiKey)

    if (!itemType) {
      console.log(`Creating item type: ${modelDef.name} (${modelDef.apiKey})...`)
      const createRes = await cmaFetch('/item-types', apiKey, {
        method: 'POST',
        body: JSON.stringify({
          data: {
            type: 'item_type',
            attributes: {
              name: modelDef.name,
              api_key: modelDef.apiKey,
              modular_block: modelDef.modularBlock ?? false,
              draft_mode_active: false,
              all_locales_required: false,
              collection_appearance: 'table',
            },
          },
        }),
      })

      if (createRes.status === 202 && createRes.data?.id) {
        const payload = await waitForJob(createRes.data.id, apiKey)
        itemType = payload?.data ?? {
          id: createRes.data.id,
          attributes: { api_key: modelDef.apiKey },
        }
      } else {
        itemType = createRes.data
      }
      console.log(`Created item type ${modelDef.name} with ID: ${itemType.id}`)
    } else {
      console.log(`Item type ${modelDef.name} (${modelDef.apiKey}) already exists: ${itemType.id}`)
    }

    itemTypeMap[modelDef.apiKey] = {
      id: itemType.id,
      name: modelDef.name,
      apiKey: modelDef.apiKey,
    }

    // Fetch existing fields for this model
    const fieldsRes = await cmaFetch(`/item-types/${itemType.id}/fields`, apiKey)
    const existingFields = fieldsRes.data || []

    for (const fieldDef of modelDef.fields) {
      const fieldExists = existingFields.some((f) => f.attributes.api_key === fieldDef.apiKey)
      if (fieldExists) {
        console.log(`  Field "${fieldDef.label}" (${fieldDef.apiKey}) already exists`)
        continue
      }

      console.log(
        `  Creating field "${fieldDef.label}" (${fieldDef.apiKey}, ${fieldDef.fieldType})...`,
      )
      const fieldRes = await cmaFetch(`/item-types/${itemType.id}/fields`, apiKey, {
        method: 'POST',
        body: JSON.stringify({
          data: {
            type: 'field',
            attributes: {
              label: fieldDef.label,
              field_type: fieldDef.fieldType,
              api_key: fieldDef.apiKey,
              localized: false,
              validators: fieldDef.validators ?? {},
              appearance: fieldDef.appearance ?? {
                editor: fieldDef.fieldType,
                parameters: {},
                addons: [],
              },
            },
          },
        }),
      })

      if (fieldRes.status === 202 && fieldRes.data?.id) {
        await waitForJob(fieldRes.data.id, apiKey)
      }
      console.log(`  Created field "${fieldDef.label}"`)
    }
  }

  return itemTypeMap
}

/**
 * Synchronizes organized Single Cultivars and House Blends to DatoCMS.
 * Updates existing records with new fields (city, region, etc.) and creates missing ones.
 * NEVER deletes existing data.
 *
 * @param {string} apiKey
 * @param {Record<string, { id: string }>} itemTypeMap
 */
export async function seedTeaData(apiKey, itemTypeMap) {
  // Get available image uploads to link with blends if needed
  const uploadsRes = await cmaFetch('/uploads?page[limit]=30', apiKey)
  const availableUploads = uploadsRes?.data || []
  console.log(`Found ${availableUploads.length} available image asset(s) in DatoCMS`)
  const legacyProducts = await getLegacyProductPrices(apiKey, itemTypeMap)

  // 1. Sync Single Cultivars
  const cultivarItemTypeId = itemTypeMap.cultivar?.id
  if (!cultivarItemTypeId) {
    throw new Error('Cultivar item type ID not found in itemTypeMap')
  }

  console.log('\n--- Syncing Single Cultivars (Updating & Appending) ---')
  const existingCultivarsRes = await cmaFetch(
    `/items?filter[type]=${cultivarItemTypeId}&page[limit]=100`,
    apiKey,
  )
  const existingCultivars = existingCultivarsRes.data || []
  const claimedItemIds = new Set()

  let cultivarsUpdated = 0
  let cultivarsCreated = 0

  for (const cultivar of ORGANIZED_TEA_DATA.cultivars) {
    const price = findLegacyProductPrice(legacyProducts, cultivar.name)
    const cultivarAttributes = {
      ...cultivar,
      price_clear: price,
      price_latte: price,
    }

    // Find matching existing cultivar item
    // Match by exact name + prefecture, or matching name prefix / city
    const existingMatch = existingCultivars.find((item) => {
      if (claimedItemIds.has(item.id)) return false
      const itemName = item.attributes.name?.trim().toLowerCase()
      const itemPref = item.attributes.prefecture?.trim().toLowerCase()
      const targetName = cultivar.name.trim().toLowerCase()
      const targetPref = cultivar.prefecture.trim().toLowerCase()
      const targetCity = cultivar.city.trim().toLowerCase()

      const exactMatch = itemName === targetName && itemPref === targetPref
      const parenthesisMatch =
        itemName === `${targetName} (${targetCity})`.toLowerCase() && itemPref === targetPref

      return exactMatch || parenthesisMatch
    })

    if (existingMatch) {
      claimedItemIds.add(existingMatch.id)
      // Update existing item with full structured attributes
      await cmaFetch(`/items/${existingMatch.id}`, apiKey, {
        method: 'PUT',
        body: JSON.stringify({
          data: {
            type: 'item',
            id: existingMatch.id,
            attributes: {
              ...existingMatch.attributes,
              ...cultivarAttributes,
            },
          },
        }),
      })
      await cmaFetch(`/items/${existingMatch.id}/publish`, apiKey, { method: 'PUT' })
      cultivarsUpdated++
      console.log(
        `  [UPDATED] Cultivar: "${cultivar.name}" (City: ${cultivar.city}, ${cultivar.prefecture}) - ID: ${existingMatch.id}`,
      )
    } else {
      // Create new record
      const createRes = await cmaFetch('/items', apiKey, {
        method: 'POST',
        body: JSON.stringify({
          data: {
            type: 'item',
            attributes: cultivarAttributes,
            relationships: {
              item_type: {
                data: {
                  type: 'item_type',
                  id: cultivarItemTypeId,
                },
              },
            },
          },
        }),
      })

      const recordId = createRes.data.id
      await cmaFetch(`/items/${recordId}/publish`, apiKey, { method: 'PUT' })
      claimedItemIds.add(recordId)
      cultivarsCreated++
      console.log(
        `  [CREATED] Cultivar: "${cultivar.name}" (City: ${cultivar.city}, ${cultivar.prefecture}) - ID: ${recordId}`,
      )
    }
  }
  console.log(
    `Finished Cultivars: updated ${cultivarsUpdated}, created ${cultivarsCreated} item(s).`,
  )

  // 2. Sync House Blends
  const blendItemTypeId = itemTypeMap.blend?.id
  if (!blendItemTypeId) {
    throw new Error('Blend item type ID not found in itemTypeMap')
  }

  console.log('\n--- Syncing House Blends (Updating & Appending) ---')
  const existingBlendsRes = await cmaFetch(
    `/items?filter[type]=${blendItemTypeId}&page[limit]=100`,
    apiKey,
  )
  const existingBlends = existingBlendsRes.data || []
  const claimedBlendIds = new Set()

  let blendsUpdated = 0
  let blendsCreated = 0

  for (let idx = 0; idx < ORGANIZED_TEA_DATA.blends.length; idx++) {
    const blend = ORGANIZED_TEA_DATA.blends[idx]
    const price = findLegacyProductPrice(legacyProducts, blend.name)
    const blendAttributes = {
      ...blend,
      serving_prices: JSON.stringify({ clear: price, latte: price }),
    }
    const existingMatch = existingBlends.find((item) => {
      if (claimedBlendIds.has(item.id)) return false
      return item.attributes.name?.trim().toLowerCase() === blend.name.trim().toLowerCase()
    })

    const upload =
      availableUploads.length > 0 ? availableUploads[idx % availableUploads.length] : null

    if (existingMatch) {
      claimedBlendIds.add(existingMatch.id)
      const attributes = {
        ...existingMatch.attributes,
        ...blendAttributes,
        cover_image:
          existingMatch.attributes.cover_image || (upload ? { upload_id: upload.id } : null),
      }

      await cmaFetch(`/items/${existingMatch.id}`, apiKey, {
        method: 'PUT',
        body: JSON.stringify({
          data: {
            type: 'item',
            id: existingMatch.id,
            attributes,
          },
        }),
      })
      await cmaFetch(`/items/${existingMatch.id}/publish`, apiKey, { method: 'PUT' })
      blendsUpdated++
      console.log(
        `  [UPDATED] House Blend: "${blend.name}" (City: ${blend.city || '-'}, Region: ${blend.region}) - ID: ${existingMatch.id}`,
      )
    } else {
      const attributes = {
        ...blendAttributes,
        cover_image: upload ? { upload_id: upload.id } : null,
      }

      const createRes = await cmaFetch('/items', apiKey, {
        method: 'POST',
        body: JSON.stringify({
          data: {
            type: 'item',
            attributes,
            relationships: {
              item_type: {
                data: {
                  type: 'item_type',
                  id: blendItemTypeId,
                },
              },
            },
          },
        }),
      })

      const recordId = createRes.data.id
      await cmaFetch(`/items/${recordId}/publish`, apiKey, { method: 'PUT' })
      claimedBlendIds.add(recordId)
      blendsCreated++
      console.log(`  [CREATED] House Blend: "${blend.name}" - ID: ${recordId}`)
    }
  }
  console.log(`Finished Blends: updated ${blendsUpdated}, created ${blendsCreated} item(s).`)
}

/**
 * Main management function to setup schema and sync tea data on DatoCMS.
 * @param {{ apiKey?: string, schemaOnly?: boolean, dataOnly?: boolean }} options
 */
export async function manageContent(options = {}) {
  const apiKey = options.apiKey || process.env.ADMIN_DATOCMS_API_KEY || process.env.DATOCMS_API_KEY
  if (!apiKey) {
    throw new Error(
      'Missing DatoCMS API Key. Please provide ADMIN_DATOCMS_API_KEY or DATOCMS_API_KEY in .env or options.',
    )
  }

  console.log('--- Starting DatoCMS Content Management ---')

  let itemTypeMap
  if (!options.dataOnly) {
    itemTypeMap = await createOrUpdateSchema(apiKey)
    console.log('Schema setup completed successfully.')
  } else {
    const typesRes = await cmaFetch('/item-types', apiKey)
    itemTypeMap = {}
    for (const item of typesRes.data || []) {
      itemTypeMap[item.attributes.api_key] = {
        id: item.id,
        name: item.attributes.name,
        apiKey: item.attributes.api_key,
      }
    }
  }

  if (!options.schemaOnly) {
    await seedTeaData(apiKey, itemTypeMap)
  }

  console.log('--- DatoCMS Content Management Completed ---')
}

// Allow direct execution via CLI: `node scripts/datocms.js`
if (import.meta.url === `file://${process.argv[1]}`) {
  const args = process.argv.slice(2)
  const schemaOnly = args.includes('--schema-only')
  const dataOnly = args.includes('--data-only')

  manageContent({ schemaOnly, dataOnly }).catch((err) => {
    console.error('Error managing DatoCMS content:', err.message)
    process.exit(1)
  })
}
