const isHttpUrl = (value) => /^https?:\/\//i.test(String(value || '').trim())
const isLocalImagePath = (value) => /(^|\/)product-images\//i.test(String(value || '').trim())

const baseUrl = (() => {
  const raw = String(import.meta.env.BASE_URL || '/')
  return raw.endsWith('/') ? raw : `${raw}/`
})()

const productKeywordRules = [
  { test: /(cig|cigar|smok)/, asset: 'cigarette.webp' },
  { test: /(basmati|rice)/, asset: 'rice.webp' },
  { test: /(egg|eggs)/, asset: 'eggs.webp' },
  { test: /(milk)/, asset: 'milk.webp' },
  { test: /(paneer|cheese)/, asset: 'paneer.webp' },
  { test: /(curd|yogurt)/, asset: 'curd.webp' },
  { test: /(butter)/, asset: 'butter.webp' },
  { test: /(bread|baguette|croissant|muffin|cookies|bakery)/, asset: 'bread.webp' },
  { test: /(chicken)/, asset: 'chicken.webp' },
  { test: /(fish|salmon|tuna|prawn|prawns|mutton|meat)/, asset: 'fish.webp' },
  { test: /(juice|smoothie|tea|lemonade|beverage|drink|coconut water)/, asset: 'juice.webp' },
  { test: /(tomato|tomatoes)/, asset: 'tomato.webp' },
  { test: /(spinach|broccoli|pepper|capsicum|carrot|vegetable|vegetables|veggie)/, asset: 'vegetables.webp' },
  { test: /(grape|grapes|strawberry|strawberries|kiwi|pomegranate|papaya|mango|watermelon|pineapple|orange|banana|apple|fruit|fruits)/, asset: 'fruits.webp' },
]

const assetFromName = (name) => {
  const normalized = String(name || '').trim().toLowerCase()
  if (!normalized) return 'fruits.webp'

  const matched = productKeywordRules.find((rule) => rule.test.test(normalized))
  return matched?.asset || 'fruits.webp'
}

export const productImageAssetPath = (asset) =>
  `${baseUrl}product-images/${asset}`

export const defaultProductImagePath = () =>
  productImageAssetPath('fruits.webp')

export const productItemImagePath = (asset) =>
  `${baseUrl}product-images/items/${asset}`

const normalizeName = (value) =>
  String(value || '')
    .trim()
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')

const exactProductImageMap = {
  'cigeratte': 'cigeratte.webp',
  'cigeratee': 'cigeratte.webp',
  'cigarette': 'cigarette.webp',
  'cigarettes': 'cigarette.webp',
  'seedless-green-grapes': 'seedless-green-grapes.webp',
  'organic-strawberries': 'organic-strawberries.webp',
  'imported-kiwi': 'imported-kiwi.webp',
  'sweet-pomegranate': 'sweet-pomegranate.webp',
  'rose-papaya': 'rose-papaya.webp',
  'fresh-mango': 'fresh-mango.webp',
  'watermelon': 'watermelon.webp',
  'pineapple': 'pineapple.webp',
  'fresh-orange': 'fresh-orange.webp',
  'banana-bunch': 'banana-bunch.webp',
  'fresh-whole-milk': 'fresh-whole-milk.webp',
  'farm-eggs': 'farm-eggs.webp',
  'butter': 'butter.webp',
  'paneer': 'paneer.webp',
  'curd': 'curd.webp',
  'whole-wheat-bread': 'whole-wheat-bread.webp',
  'croissant': 'croissant.webp',
  'muffin': 'muffin.webp',
  'baguette': 'baguette.webp',
  'cookies': 'cookies.webp',
  'fresh-chicken': 'fresh-chicken.webp',
  'salmon-fillet': 'salmon-fillet.webp',
  'prawns': 'prawns.webp',
  'mutton': 'mutton.webp',
  'tuna': 'tuna.webp',
  'orange-juice': 'orange-juice.webp',
  'green-tea': 'green-tea.webp',
  'coconut-water': 'coconut-water.webp',
  'lemonade': 'lemonade.webp',
  'mango-smoothie': 'mango-smoothie.webp',
  'organic-red-tomatoes': 'organic-red-tomatoes.webp',
  'fresh-bananas': 'fresh-bananas.webp',
  'fresh-banana': 'fresh-bananas.webp',
  'premium-basmati-rice': 'premium-basmati-rice.webp',
  'organic-spinach': 'organic-spinach.webp',
  'fresh-broccoli': 'fresh-broccoli.webp',
  'red-bell-pepper': 'red-bell-pepper.webp',
  'carrot-bunch': 'carrot-bunch.webp',
  'fresh-apple': 'fresh-apple.webp',
  'banana': 'banana.webp',
  'orange': 'orange.webp',
  'pomegranate': 'pomegranate.webp',
  'tomatoes': 'tomatoes.webp'
}

export const resolveProductImage = (name, image) => {
  if (isHttpUrl(image) || isLocalImagePath(image)) return image

  const exactAsset = exactProductImageMap[normalizeName(name)]
  if (exactAsset) return productItemImagePath(exactAsset)

  const asset = assetFromName(name)
  return productImageAssetPath(asset)
}

export { isHttpUrl }
