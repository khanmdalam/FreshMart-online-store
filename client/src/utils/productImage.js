const isHttpUrl = (value) => /^https?:\/\//i.test(String(value || '').trim())
const isLocalImagePath = (value) => /(^|\/)product-images\//i.test(String(value || '').trim())

const baseUrl = (() => {
  const raw = String(import.meta.env.BASE_URL || '/')
  return raw.endsWith('/') ? raw : `${raw}/`
})()

const productKeywordRules = [
  { test: /(cig|cigar|smok)/, asset: 'cigarette.jpg' },
  { test: /(basmati|rice)/, asset: 'rice.jpg' },
  { test: /(egg|eggs)/, asset: 'eggs.jpg' },
  { test: /(milk)/, asset: 'milk.jpg' },
  { test: /(paneer|cheese)/, asset: 'paneer.jpg' },
  { test: /(curd|yogurt)/, asset: 'curd.jpg' },
  { test: /(butter)/, asset: 'butter.jpg' },
  { test: /(bread|baguette|croissant|muffin|cookies|bakery)/, asset: 'bread.jpg' },
  { test: /(chicken)/, asset: 'chicken.jpg' },
  { test: /(fish|salmon|tuna|prawn|prawns|mutton|meat)/, asset: 'fish.jpg' },
  { test: /(juice|smoothie|tea|lemonade|beverage|drink|coconut water)/, asset: 'juice.jpg' },
  { test: /(tomato|tomatoes)/, asset: 'tomato.jpg' },
  { test: /(spinach|broccoli|pepper|capsicum|carrot|vegetable|vegetables|veggie)/, asset: 'vegetables.jpg' },
  { test: /(grape|grapes|strawberry|strawberries|kiwi|pomegranate|papaya|mango|watermelon|pineapple|orange|banana|apple|fruit|fruits)/, asset: 'fruits.jpg' },
]

const assetFromName = (name) => {
  const normalized = String(name || '').trim().toLowerCase()
  if (!normalized) return 'fruits.jpg'

  const matched = productKeywordRules.find((rule) => rule.test.test(normalized))
  return matched?.asset || 'fruits.jpg'
}

export const productImageAssetPath = (asset) =>
  `${baseUrl}product-images/${asset}`

export const defaultProductImagePath = () =>
  productImageAssetPath('fruits.jpg')

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
  'cigeratte': 'cigeratte.jpg',
  'cigeratee': 'cigeratte.jpg',
  'cigarette': 'cigarette.jpg',
  'cigarettes': 'cigarette.jpg',
  'seedless-green-grapes': 'seedless-green-grapes.jpg',
  'organic-strawberries': 'organic-strawberries.jpg',
  'imported-kiwi': 'imported-kiwi.jpg',
  'sweet-pomegranate': 'sweet-pomegranate.jpg',
  'rose-papaya': 'rose-papaya.jpg',
  'fresh-mango': 'fresh-mango.jpg',
  'watermelon': 'watermelon.jpg',
  'pineapple': 'pineapple.jpg',
  'fresh-orange': 'fresh-orange.jpg',
  'banana-bunch': 'banana-bunch.jpg',
  'fresh-whole-milk': 'fresh-whole-milk.jpg',
  'farm-eggs': 'farm-eggs.jpg',
  'butter': 'butter.jpg',
  'paneer': 'paneer.jpg',
  'curd': 'curd.jpg',
  'whole-wheat-bread': 'whole-wheat-bread.jpg',
  'croissant': 'croissant.jpg',
  'muffin': 'muffin.jpg',
  'baguette': 'baguette.jpg',
  'cookies': 'cookies.jpg',
  'fresh-chicken': 'fresh-chicken.jpg',
  'salmon-fillet': 'salmon-fillet.jpg',
  'prawns': 'prawns.jpg',
  'mutton': 'mutton.jpg',
  'tuna': 'tuna.jpg',
  'orange-juice': 'orange-juice.jpg',
  'green-tea': 'green-tea.jpg',
  'coconut-water': 'coconut-water.jpg',
  'lemonade': 'lemonade.jpg',
  'mango-smoothie': 'mango-smoothie.jpg',
  'organic-red-tomatoes': 'organic-red-tomatoes.jpg',
  'fresh-bananas': 'fresh-bananas.jpg',
  'fresh-banana': 'fresh-bananas.jpg',
  'premium-basmati-rice': 'premium-basmati-rice.jpg',
  'organic-spinach': 'organic-spinach.jpg',
  'fresh-broccoli': 'fresh-broccoli.jpg',
  'red-bell-pepper': 'red-bell-pepper.jpg',
  'carrot-bunch': 'carrot-bunch.jpg',
  'fresh-apple': 'fresh-apple.jpg',
  'banana': 'banana.jpg',
  'orange': 'orange.jpg',
  'pomegranate': 'pomegranate.jpg',
  'tomatoes': 'tomatoes.jpg'
}

export const resolveProductImage = (name, image) => {
  const exactAsset = exactProductImageMap[normalizeName(name)]
  if (exactAsset) return productItemImagePath(exactAsset)

  if (isHttpUrl(image) || isLocalImagePath(image)) return image

  const asset = assetFromName(name)
  return productImageAssetPath(asset)
}

export { isHttpUrl }
