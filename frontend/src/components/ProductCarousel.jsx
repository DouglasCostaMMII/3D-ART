import { useState, useEffect, useRef, useCallback } from 'react'
import { API_URL } from '../lib/api'
import { useCart } from '../context/CartContext'
import { carousel, products as productContent } from '../config/content'

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

function getAllImages(product) {
  if (!product.images || product.images.length === 0) return [getImageUrl(product)]
  return product.images.map((img) =>
    img.url.startsWith('http') ? img.url : `${API_URL}${img.url}`
  )
}

// ── Modal ──────────────────────────────────────────────────────────────────
function ProductModal({ product, onClose, onAddToCart, added }) {
  const [imgIndex, setImgIndex] = useState(0)
  const images = getAllImages(product)

  // Close on Escape
  useEffect(() => {
    function onKey(e) { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  // Lock scroll
  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = prev }
  }, [])

  function handleBackdropClick(e) {
    if (e.target === e.currentTarget) onClose()
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in"
      onClick={handleBackdropClick}
    >
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-white/90 shadow text-gray-500 hover:text-gray-900 hover:bg-white transition-colors"
          aria-label="Fechar"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Image area */}
        <div className="relative bg-gray-50 rounded-t-2xl overflow-hidden" style={{ aspectRatio: '4/3' }}>
          <img
            src={images[imgIndex]}
            alt={product.name}
            className="w-full h-full object-contain"
            onError={(e) => {
              e.target.onerror = null
              e.target.src = `https://placehold.co/600x450/4f46e5/ffffff?text=${encodeURIComponent(product.name)}`
            }}
          />
          {product.category && (
            <span className="absolute top-3 left-3 bg-indigo-600/90 text-white text-xs font-medium px-2.5 py-1 rounded-full backdrop-blur-sm">
              {product.category}
            </span>
          )}
          {product.stock === 0 && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <span className="bg-white text-gray-800 font-bold text-sm px-4 py-2 rounded-lg shadow">
                {productContent.outOfStock}
              </span>
            </div>
          )}
        </div>

        {/* Thumbnails (only if more than 1 image) */}
        {images.length > 1 && (
          <div className="flex gap-2 px-4 pt-3 overflow-x-auto">
            {images.map((url, i) => (
              <button
                key={i}
                onClick={() => setImgIndex(i)}
                className={`flex-shrink-0 w-14 h-14 rounded-lg overflow-hidden border-2 transition-all ${
                  i === imgIndex ? 'border-indigo-500 scale-105' : 'border-transparent opacity-60 hover:opacity-100'
                }`}
              >
                <img src={url} alt={`${product.name} ${i + 1}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}

        {/* Info */}
        <div className="p-5 space-y-3">
          <div className="flex items-start justify-between gap-3">
            <h2 className="text-lg font-bold text-gray-900 leading-snug">{product.name}</h2>
            <span className="text-indigo-700 font-extrabold text-xl whitespace-nowrap">{formatPrice(product.price)}</span>
          </div>

          {product.description && (
            <p className="text-gray-500 text-sm leading-relaxed">{product.description}</p>
          )}

          <button
            onClick={() => onAddToCart(product)}
            disabled={product.stock === 0}
            className={`w-full py-3 rounded-xl font-semibold text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-1 ${
              product.stock === 0
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : added
                ? 'bg-green-500 text-white scale-95'
                : 'bg-indigo-600 hover:bg-indigo-700 text-white active:scale-95'
            }`}
          >
            {product.stock === 0 ? productContent.outOfStock : added ? productContent.added : productContent.addToCart}
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Carousel ───────────────────────────────────────────────────────────────
export default function ProductCarousel() {
  const [products, setProducts] = useState([])
  const [current, setCurrent] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [added, setAdded] = useState(null)
  const [modalProduct, setModalProduct] = useState(null)
  const trackRef = useRef(null)
  const intervalRef = useRef(null)
  const startXRef = useRef(null)
  const draggedRef = useRef(false)
  const { addItem } = useCart()

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
    if (total < 2 || isPaused || modalProduct) return
    intervalRef.current = setInterval(next, 3000)
    return () => clearInterval(intervalRef.current)
  }, [next, total, isPaused, modalProduct])

  // Touch support
  function onTouchStart(e) {
    startXRef.current = e.touches[0].clientX
    draggedRef.current = false
    setIsPaused(true)
  }
  function onTouchMove(e) {
    if (startXRef.current === null) return
    const dx = Math.abs(e.touches[0].clientX - startXRef.current)
    if (dx > 8) {
      draggedRef.current = true
      e.preventDefault()
    }
  }
  function onTouchEnd(e) {
    if (startXRef.current === null) return
    const diff = startXRef.current - e.changedTouches[0].clientX
    if (Math.abs(diff) > 30) diff > 0 ? next() : prev()
    startXRef.current = null
    setTimeout(() => setIsPaused(false), 2000)
  }

  // Mouse drag detection (to avoid opening modal on drag)
  function onMouseDown(e) {
    startXRef.current = e.clientX
    draggedRef.current = false
  }
  function onMouseMove(e) {
    if (startXRef.current === null) return
    if (Math.abs(e.clientX - startXRef.current) > 6) {
      draggedRef.current = true
    }
  }
  function onMouseUp() {
    startXRef.current = null
  }

  function handleImageClick(product) {
    if (draggedRef.current) return
    setModalProduct(product)
    setIsPaused(true)
  }

  function handleCloseModal() {
    setModalProduct(null)
    setIsPaused(false)
  }

  function handleAddToCart(product) {
    const firstVariation = product.variations && product.variations.length > 0
      ? { [product.variations[0].type]: product.variations[0].value }
      : null
    addItem(product, firstVariation)
    setAdded(product.id)
    setTimeout(() => setAdded(null), 1500)
  }

  if (products.length === 0) return null

  // Duplicate for infinite feel
  const looped = [...products, ...products]

  return (
    <>
      <section className="py-6 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-3 flex items-center justify-between">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-gray-900">{carousel.sectionTitle}</h2>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => { prev(); setIsPaused(true); setTimeout(() => setIsPaused(false), 4000) }}
              className="w-9 h-9 flex items-center justify-center rounded-full border border-gray-200 text-gray-500 hover:border-indigo-400 hover:text-indigo-600 transition-colors"
              aria-label={carousel.prevLabel}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={() => { next(); setIsPaused(true); setTimeout(() => setIsPaused(false), 4000) }}
              className="w-9 h-9 flex items-center justify-center rounded-full border border-gray-200 text-gray-500 hover:border-indigo-400 hover:text-indigo-600 transition-colors"
              aria-label={carousel.nextLabel}
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
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
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
                  {/* Image — clickable */}
                  <div
                    className="relative h-32 sm:h-40 overflow-hidden bg-gray-50 cursor-pointer"
                    onClick={() => handleImageClick(product)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === 'Enter' && handleImageClick(product)}
                    aria-label={`Ver detalhes de ${product.name}`}
                  >
                    <img
                      src={getImageUrl(product)}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      draggable={false}
                      onError={(e) => {
                        e.target.onerror = null
                        e.target.src = `https://placehold.co/400x400/4f46e5/ffffff?text=${encodeURIComponent(product.name.charAt(0))}`
                      }}
                    />
                    {/* Expand hint overlay */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200 flex items-center justify-center">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-white/90 rounded-full p-2 shadow">
                        <svg className="w-4 h-4 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" />
                        </svg>
                      </div>
                    </div>
                    {product.stock === 0 && (
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <span className="bg-white text-gray-700 text-xs font-bold px-3 py-1 rounded-full">{productContent.outOfStock}</span>
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
                        {added === product.id ? '✓' : '+'}
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
              aria-label={carousel.dotLabel(i)}
            />
          ))}
        </div>
      </section>

      {/* Modal */}
      {modalProduct && (
        <ProductModal
          product={modalProduct}
          onClose={handleCloseModal}
          onAddToCart={handleAddToCart}
          added={added === modalProduct.id}
        />
      )}
    </>
  )
}
