import { useState, useMemo } from 'react'
import { useCart } from '../context/CartContext'
import { products as productContent } from '../config/content'
import { API_URL } from '../lib/api'

function formatPrice(price) {
  return `R$ ${price.toFixed(2).replace('.', ',')}`
}

const COLOR_MAP = {
  branco: '#f9fafb',
  preto: '#111827',
  azul: '#3b82f6',
  vermelho: '#ef4444',
  verde: '#22c55e',
  amarelo: '#eab308',
  rosa: '#ec4899',
  roxo: '#8b5cf6',
  laranja: '#f97316',
  cinza: '#6b7280',
}

function getColorHex(colorName) {
  return COLOR_MAP[colorName.toLowerCase()] || '#9ca3af'
}

export default function ProductCard({ product }) {
  const { addItem } = useCart()
  const [added, setAdded] = useState(false)
  const [selectedVariations, setSelectedVariations] = useState({})

  const primaryImage = useMemo(() => {
    if (!product.images || product.images.length === 0) {
      return `https://placehold.co/400x400/4f46e5/ffffff?text=${encodeURIComponent(product.name)}`
    }
    const primary = product.images.find((img) => img.is_primary === 1) || product.images[0]
    const url = primary.url
    return url.startsWith('http') ? url : `${API_URL}${url}`
  }, [product.images, product.name])

  // Group variations by type
  const variationsByType = useMemo(() => {
    if (!product.variations || product.variations.length === 0) return {}
    return product.variations.reduce((acc, v) => {
      if (!acc[v.type]) acc[v.type] = []
      if (!acc[v.type].includes(v.value)) acc[v.type].push(v.value)
      return acc
    }, {})
  }, [product.variations])

  const variationTypes = Object.keys(variationsByType)

  function selectVariation(type, value) {
    setSelectedVariations((prev) => ({
      ...prev,
      [type]: prev[type] === value ? undefined : value,
    }))
  }

  function handleAddToCart() {
    const variation = variationTypes.length > 0 ? selectedVariations : null
    addItem(product, variation)
    setAdded(true)
    setTimeout(() => setAdded(false), 1500)
  }

  const typeLabel = productContent.variationLabels

  return (
    <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col group">
      {/* Image */}
      <div className="relative overflow-hidden bg-gray-50 aspect-square">
        <img
          src={primaryImage}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
          onError={(e) => {
            e.target.onerror = null
            e.target.src = `https://placehold.co/400x400/4f46e5/ffffff?text=${encodeURIComponent(product.name)}`
          }}
        />
        {/* Category badge */}
        {product.category && (
          <span className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm text-indigo-700 text-xs font-semibold px-2 py-0.5 rounded-full shadow-sm">
            {product.category}
          </span>
        )}
        {/* Out of stock overlay */}
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="bg-white text-gray-800 font-bold text-sm px-3 py-1.5 rounded-lg shadow">
              {productContent.outOfStock}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-3 sm:p-4 gap-2">
        {/* Name */}
        <h3 className="font-semibold text-gray-900 text-sm sm:text-base leading-snug">
          {product.name}
        </h3>

        {/* Description */}
        <p className="text-gray-500 text-xs sm:text-sm line-clamp-2 leading-relaxed flex-1">
          {product.description}
        </p>

        {/* Variations */}
        {variationTypes.length > 0 && (
          <div className="space-y-2">
            {variationTypes.map((type) => (
              <div key={type}>
                <p className="text-xs text-gray-400 font-medium mb-1">{typeLabel[type] || type}:</p>
                <div className="flex flex-wrap gap-1.5">
                  {variationsByType[type].map((value) => {
                    const isSelected = selectedVariations[type] === value
                    if (type === 'cor') {
                      const hex = getColorHex(value)
                      const isLight = hex === '#f9fafb' || hex === '#eab308'
                      return (
                        <button
                          key={value}
                          onClick={() => selectVariation(type, value)}
                          title={value}
                          className={`w-6 h-6 rounded-full border-2 transition-all ${
                            isSelected
                              ? 'border-indigo-500 scale-110 shadow-md'
                              : isLight
                              ? 'border-gray-300'
                              : 'border-transparent hover:border-gray-400'
                          }`}
                          style={{ backgroundColor: hex }}
                          aria-label={`Cor: ${value}`}
                          aria-pressed={isSelected}
                        />
                      )
                    }
                    return (
                      <button
                        key={value}
                        onClick={() => selectVariation(type, value)}
                        className={`px-2 py-0.5 rounded-md text-xs font-medium border transition-colors ${
                          isSelected
                            ? 'bg-indigo-600 text-white border-indigo-600'
                            : 'bg-white text-gray-600 border-gray-300 hover:border-indigo-400'
                        }`}
                        aria-pressed={isSelected}
                      >
                        {value}
                      </button>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Price + Add to cart */}
        <div className="flex flex-col gap-2 mt-auto pt-1">
          <span className="text-indigo-700 font-bold text-lg sm:text-xl">
            {formatPrice(product.price)}
          </span>

          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className={`w-full py-3 rounded-xl font-semibold text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-1 ${
              product.stock === 0
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : added
                ? 'bg-green-500 text-white scale-95'
                : 'bg-indigo-600 hover:bg-indigo-700 text-white active:scale-95'
            }`}
            aria-label={`Adicionar ${product.name} ao carrinho`}
          >
            {product.stock === 0 ? productContent.outOfStock : added ? productContent.added : productContent.addToCart}
          </button>
        </div>
      </div>
    </div>
  )
}
