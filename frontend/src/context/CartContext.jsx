import React, { createContext, useContext, useState, useMemo } from 'react'

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const [items, setItems] = useState([])
  const [isOpen, setIsOpen] = useState(false)

  function getItemKey(productId, variation) {
    return `${productId}::${variation ? JSON.stringify(variation) : 'none'}`
  }

  function addItem(product, variation = null) {
    setItems((prev) => {
      const key = getItemKey(product.id, variation)
      const existing = prev.find((i) => getItemKey(i.product.id, i.variation) === key)
      if (existing) {
        return prev.map((i) =>
          getItemKey(i.product.id, i.variation) === key
            ? { ...i, quantity: i.quantity + 1 }
            : i
        )
      }
      return [...prev, { product, variation, quantity: 1 }]
    })
    setIsOpen(true)
  }

  function removeItem(productId, variation) {
    setItems((prev) =>
      prev.filter((i) => getItemKey(i.product.id, i.variation) !== getItemKey(productId, variation))
    )
  }

  function updateQuantity(productId, variation, qty) {
    if (qty < 1) return
    setItems((prev) =>
      prev.map((i) =>
        getItemKey(i.product.id, i.variation) === getItemKey(productId, variation)
          ? { ...i, quantity: qty }
          : i
      )
    )
  }

  function clearCart() {
    setItems([])
  }

  function openCart() {
    setIsOpen(true)
  }

  function closeCart() {
    setIsOpen(false)
  }

  const totalItems = useMemo(() => items.reduce((sum, i) => sum + i.quantity, 0), [items])
  const totalPrice = useMemo(() => items.reduce((sum, i) => sum + i.product.price * i.quantity, 0), [items])

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
        isOpen,
        openCart,
        closeCart,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used inside CartProvider')
  return ctx
}
