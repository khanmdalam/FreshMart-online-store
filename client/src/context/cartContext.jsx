import { createContext, useCallback, useEffect, useRef, useState } from 'react'
import API from '../services/api'

const CartContext = createContext()
const STORAGE_KEY = 'freshmart_cart'
const MONGO_ID_REGEX = /^[a-fA-F0-9]{24}$/

const normalizeName = (value) => String(value || '').trim().toLowerCase()
const normalizeStock = (value) => {
  const stock = Number(value)
  return Number.isFinite(stock) ? stock : undefined
}

const isSameCartProduct = (item, product) => {
  const itemId = String(item?._id || '')
  const productId = String(product?._id || '')
  const sameId = itemId && productId && itemId === productId
  const sameName = normalizeName(item?.name) && normalizeName(item?.name) === normalizeName(product?.name)

  return sameId || sameName
}

const buildProductLookups = (products) => {
  const byId = new Map()
  const byName = new Map()

  products.forEach((product) => {
    if (product?._id) {
      byId.set(String(product._id), product)
    }

    const name = normalizeName(product?.name)
    if (name && !byName.has(name)) {
      byName.set(name, product)
    }
  })

  return { byId, byName }
}

const mergeCartItemWithProduct = (item, product) => {
  if (!product) return item

  const stock = normalizeStock(product.stock)
  const image = product.imageURL || product.image || item.image || item.imageURL || ''

  return {
    ...item,
    _id: product._id || item._id,
    name: product.name || item.name,
    price: product.price ?? item.price,
    unit: product.unit || item.unit || 'per unit',
    image,
    ...(stock !== undefined ? { stock } : {})
  }
}

const mergeCartItemsWithProducts = (cartItems, products) => {
  const { byId, byName } = buildProductLookups(products)

  return cartItems.map((item) => {
    const itemId = String(item?._id || '')
    const dbProduct = MONGO_ID_REGEX.test(itemId)
      ? byId.get(itemId)
      : byName.get(normalizeName(item?.name))

    return mergeCartItemWithProduct(item, dbProduct)
  })
}

const getInitialCartItems = () => {
  try {
    const storedCart = localStorage.getItem(STORAGE_KEY)
    if (!storedCart) return []

    const parsedCart = JSON.parse(storedCart)
    return Array.isArray(parsedCart) ? parsedCart : []
  } catch (error) {
    console.log(error)
    return []
  }
}

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(getInitialCartItems)
  const cartItemsRef = useRef(cartItems)

  useEffect(() => {
    cartItemsRef.current = cartItems
  }, [cartItems])

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cartItems))
    } catch (error) {
      console.log(error)
    }
  }, [cartItems])

  const refreshCartStock = useCallback(async () => {
    if (cartItemsRef.current.length === 0) return []

    try {
      const { data } = await API.get('/products')
      const freshCartItems = mergeCartItemsWithProducts(cartItemsRef.current, data)
      cartItemsRef.current = freshCartItems
      setCartItems(freshCartItems)
      return freshCartItems
    } catch (error) {
      console.log(error)
      return cartItemsRef.current
    }
  }, [])

  useEffect(() => {
    refreshCartStock()
  }, [refreshCartStock])

  // Add to cart
  const addToCart = (product) => {
    setCartItems((prev) => {
      const exists = prev.find((item) => isSameCartProduct(item, product))
      const stock = normalizeStock(product.stock)
      if (exists) {
        return prev.map((item) =>
          isSameCartProduct(item, product)
            ? {
              ...item,
              _id: product._id || item._id,
              name: product.name || item.name,
              unit: product.unit || item.unit,
              image: product.image || product.imageURL || item.image || item.imageURL || '',
              ...(stock !== undefined ? { stock } : {}),
              quantity: stock !== undefined && item.quantity >= stock ? item.quantity : item.quantity + 1,
              price: Math.min(Number(item.price) || 0, Number(product.price) || 0) || item.price
            }
            : item
        )
      }

      return [
        ...prev,
        {
          ...product,
          image: product.image || product.imageURL || '',
          ...(stock !== undefined ? { stock } : {}),
          quantity: 1
        }
      ]
    })
  }

  // Remove from cart
  const removeFromCart = (id) => {
    setCartItems((prev) => prev.filter((item) => item._id !== id))
  }

  // Increase quantity
  const increaseQty = (id) => {
    setCartItems((prev) =>
      prev.map((item) => {
        if (item._id !== id) return item

        const stock = normalizeStock(item.stock)
        if (stock !== undefined && item.quantity >= stock) {
          return item
        }

        return { ...item, quantity: item.quantity + 1 }
      })
    )
  }

  // Decrease quantity
  const decreaseQty = (id) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item._id === id && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      ).filter((item) => item.quantity > 0)
    )
  }

  // Total items count
  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0)

  // Total price
  const cartTotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0)

  // Clear cart
  const clearCart = () => setCartItems([])

  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      removeFromCart,
      increaseQty,
      decreaseQty,
      cartCount,
      cartTotal,
      clearCart,
      refreshCartStock
    }}>
      {children}
    </CartContext.Provider>
  )
}

export { CartContext }
