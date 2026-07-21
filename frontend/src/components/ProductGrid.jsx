import { API_URL } from '../lib/api'
import { useState, useEffect, useMemo } from 'react'
import ProductCard from './ProductCard'
import { products, productGrid } from '../config/content'

function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden animate-pulse">
      <div className="aspect-square bg-gray-200" />
      <div className="p-4 space-y-3">
        <div className="h-4 bg-gray-200 rounded w-3/4" />
        <div className="h-3 bg-gray-200 rounded w-full" />
        <div className="h-3 bg-gray-200 rounded w-2/3" />
        <div className="h-6 bg-gray-200 rounded w-1/3 mt-2" />
        <div className="h-11 bg-gray-200 rounded-xl" />
      </div>
    </div>
  )
}

export default function ProductGrid() {
  const [productList, setProductList] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState(products.categories[0])

  useEffect(() => {
    fetchProducts()
  }, [])

  async function fetchProducts() {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`${API_URL}/api/products`)
      if (!res.ok) throw new Error(productGrid.loadError)
      const data = await res.json()
      setProductList(data.products || [])
    } catch (err) {
      setError(err.message || 'Erro ao carregar produtos.')
    } finally {
      setLoading(false)
    }
  }

  const filteredProducts = useMemo(() => {
    return productList.filter((p) => {
      const matchesSearch =
        !search ||
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        (p.description && p.description.toLowerCase().includes(search.toLowerCase()))
      const matchesCategory = activeCategory === products.categories[0] || p.category === activeCategory
      return matchesSearch && matchesCategory
    })
  }, [productList, search, activeCategory])

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Search and filter */}
      <div className="mb-6 space-y-4">
        {/* Search bar */}
        <div className="relative">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <svg
              className="w-5 h-5 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={productGrid.searchPlaceholder}
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent text-sm bg-white shadow-sm"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-600"
              aria-label={productGrid.clearSearch}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* Category pills */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {products.categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                activeCategory === cat
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-indigo-300'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Results count */}
      {!loading && !error && (
        <p className="text-sm text-gray-400 mb-4">
          {filteredProducts.length === 0
            ? productGrid.notFound + '.'
            : `${filteredProducts.length} produto${filteredProducts.length !== 1 ? 's' : ''} encontrado${filteredProducts.length !== 1 ? 's' : ''}`}
        </p>
      )}

      {/* Error state */}
      {error && (
        <div className="text-center py-16">
          <div className="text-5xl mb-4">⚠️</div>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchProducts}
            className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-medium hover:bg-indigo-700 transition-colors"
          >
            {productGrid.retryButton}
          </button>
        </div>
      )}

      {/* Products grid */}
      {!error && (
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
          {loading
            ? Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
            : filteredProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
        </div>
      )}

      {/* Empty state (not loading, no error, no results) */}
      {!loading && !error && filteredProducts.length === 0 && (
        <div className="text-center py-16">
          <div className="text-5xl mb-4">🔍</div>
          <p className="text-gray-500 text-lg font-medium">{productGrid.notFound}</p>
          <p className="text-gray-400 text-sm mt-1">
            {productGrid.notFoundHint}
          </p>
          <button
            onClick={() => { setSearch(''); setActiveCategory(products.categories[0]) }}
            className="mt-4 text-indigo-600 font-medium hover:underline text-sm"
          >
            {productGrid.clearFilters}
          </button>
        </div>
      )}
    </section>
  )
}
