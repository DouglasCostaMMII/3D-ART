import { useState, useEffect, useRef, useCallback } from 'react'
import { API_URL } from '../lib/api'
import { useCart } from '../context/CartContext'

function formatPrice(price) {
  return `R$ ${price.toFixed(2).replace('.', ',')}`
}

function getImageUrl(product) {
  if (product.images && product.images.length > 0) {
    const primary = product.images.find((i) => i.is_primary === 1) || product.images[0]
    return primary.url.startsWith('http') ? primary.url : `${API_URL}${primary.url}`
  }
  return `https://placehold.co/400x400/4f46e5/ffffff?text=${encodeURIComponent(product.name.charAt(0))}`
}

export default function ProductCarousel() {
  const [products, setProducts] = useState([])
  const [current, setCurrent] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [added, setAdded] = useState(null)
  const trackRef = useRef(null)
  const intervalRef = useRef(null)
  const startXRef = useRef(null)
  const { addItem, openCart } = useCart()

  useEffect(() => {
    fetch(`${API_URL}/api/products`)
      .then((r) => r.json())
      .then((d) => {
        if (d.success) setProducts(d.products)
      })
      .catch(() => {})
  }, [])

  const total = products.length
  const [visibleCount, setVisibleCount] = useState(() =>
    window.innerWidth >= 1024 ? 3 : window.innerWidth >= 640 ? 2 : 1
  )

  useEffect(() => {
    function onResize() {
      setVisibleCount(window.innerWidth >= 1024 ? 3 : window.innerWidth >= 640 ? 2 : 1)
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const next = useCallback(() => {
    setCurrent((c) => (c + 1) % total)
  }, [total])

  const prev = useCallback(() => {
    setCurrent((c) => (c - 1 + total) % total)
  }, [total])

  // Auto-advance
  useEffect(() => {
    if (total < 2 || isPaused) return
    intervalRef.current = setInterval(next, 3000)
    return () => clearInterval(intervalRef.current)
  }, [next, total, isPaused])

  // Touch support
  function onTouchStart(e) {
    startXRef.current = e.touches[0].clientX
    setIsPaused(true)
  }
  function onTouchMove(e) {
    // allow native scroll to take over on vertical swipes
    if (startXRef.current === null) return
    const dx = Math.abs(e.touches[0].clientX - startXRef.current)
    const dy = Math.abs(e.touches[0].clientY - (e.touches[0].clientY))
    if (dx > 8) e.preventDefault()
  }
  function onTouchEnd(e) {
    if (startXRef.current === null) return
    const diff = startXRef.current - e.changedTouches[0].clientX
    if (Math.abs(diff) > 30) diff > 0 ? next() : prev()
    startXRef.current = null
    setTimeout(() => setIsPaused(false), 2000)
  }

  function handleAddToCart(product) {
    const firstVariation = product.variations && product.variations.length > 0
      ? { [product.variations[0].type]: product.variations[0].value }
      : null
    addItem(product, firstVariation)
    setAdded(product.id)
    setTimeout(() => setAdded(null), 1500)
    openCart()
  }

  if (products.length === 0) return null

  // Duplicate for infinite feel: [...products, ...products]
  const looped = [...products, ...products]

  return (
    <section className="py-6 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-3 flex items-center justify-between">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-gray-900">Destaques</h2>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => { prev(); setIsPaused(true); setTimeout(() => setIsPaused(false), 4000) }}
            className="w-9 h-9 flex items-center justify-center rounded-full border border-gray-200 text-gray-500 hover:border-indigo-400 hover:text-indigo-600 transition-colors"
            aria-label="Anterior"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={() => { next(); setIsPaused(true); setTimeout(() => setIsPaused(false), 4000) }}
            className="w-9 h-9 flex items-center justify-center rounded-full border border-gray-200 text-gray-500 hover:border-indigo-400 hover:text-indigo-600 transition-colors"
            aria-label="Próximo"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Track */}
      <div
        className="relative cursor-grab active:cursor-grabbing select-none"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        ref={trackRef}
      >
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{
            transform: `translateX(calc(-${current * (100 / visibleCount)}% ))`,
            willChange: 'transform',
          }}
        >
          {looped.map((product, idx) => (
            <div
              key={`${product.id}-${idx}`}
              className="flex-shrink-0 px-2"
              style={{ width: `${100 / visibleCount}%` }}
            >
              <div className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200 group">
                {/* Image */}
                <div className="relative h-32 sm:h-40 overflow-hidden bg-gray-50">
                  <img
                    src={getImageUrl(product)}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    draggable={false}
                    onError={(e) => {
                      e.target.src = `https://placehold.co/400x400/4f46e5/ffffff?text=${encodeURIComponent(product.name.charAt(0))}`
                    }}
                  />
                  {product.stock === 0 && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <span className="bg-white text-gray-700 text-xs font-bold px-3 py-1 rounded-full">Esgotado</span>
                    </div>
                  )}
                  {product.category && (
                    <span className="absolute top-2 left-2 bg-indigo-600/90 text-white text-xs font-medium px-2 py-0.5 rounded-full backdrop-blur-sm">
                      {product.category}
                    </span>
                  )}
                </div>

                {/* Info */}
                <div className="p-2.5">
                  <h3 className="font-semibold text-gray-900 text-xs sm:text-sm leading-snug line-clamp-1">{product.name}</h3>
                  <div className="flex items-center justify-between mt-1.5">
                    <span className="text-indigo-700 font-extrabold text-sm">{formatPrice(product.price)}</span>
                    <button
                      onClick={() => handleAddToCart(product)}
                      disabled={product.stock === 0}
                      className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-bold transition-all duration-150 active:scale-95 ${
                        added === product.id
                          ? 'bg-emerald-500 text-white'
                          : product.stock === 0
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                      }`}
                    >
                      {added === product.id ? (
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                        </svg>
                      )}
                      {added === product.id ? 'OK' : '+'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Dots */}
      <div className="flex justify-center gap-1.5 mt-3">
        {products.map((_, i) => (
          <button
            key={i}
            onClick={() => { setCurrent(i); setIsPaused(true); setTimeout(() => setIsPaused(false), 4000) }}
            className={`rounded-full transition-all duration-300 ${
              i === current % total
                ? 'w-5 h-2 bg-indigo-600'
                : 'w-2 h-2 bg-gray-200 hover:bg-gray-300'
            }`}
            aria-label={`Ir para produto ${i + 1}`}
          />
        ))}
      </div>
    </section>
  )
}
