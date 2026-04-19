const normalize = (value) => String(value || '').trim().toLowerCase()

export const inferProductUnit = (name, categoryName = '') => {
  const normalizedName = normalize(name)
  const normalizedCategory = normalize(categoryName)

  if (/egg/.test(normalizedName)) return 'per dozen'
  if (/milk|juice|lemonade/.test(normalizedName)) return 'per litre'
  if (/tea/.test(normalizedName)) return 'per pack'
  if (/smoothie/.test(normalizedName)) return 'per bottle'
  if (/bread/.test(normalizedName)) return 'per loaf'
  if (/croissant|muffin|baguette|coconut water|pineapple/.test(normalizedName)) return 'per piece'
  if (/butter/.test(normalizedName)) return 'per 100g'
  if (/paneer/.test(normalizedName)) return 'per 200g'
  if (/curd/.test(normalizedName)) return 'per 500g'
  if (/cigarette|marlboro|advance|red/.test(normalizedName)) return 'per pack'

  if (
    /vegetable|fruit|meat|fish/.test(normalizedCategory) ||
    /spinach|broccoli|pepper|carrot|tomato|tomatoes|cucumber|apple|banana|orange|pomegranate|watermelon|mango|chicken|salmon|prawn|prawns|mutton|tuna/.test(normalizedName)
  ) {
    return 'per kg'
  }

  return 'per unit'
}
