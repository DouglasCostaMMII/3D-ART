import { API_URL } from '../../lib/api'
import { useState, useEffect } from 'react'
import ProductForm from './ProductForm'
import { admin } from '../../config/content'

function formatPrice(price) {
  return `R$ ${price.toFixed(2).replace('.', ',')}`
}

function StatusBadge({ product }) {
  if (product.stock === 0) {
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-700">
        {admin.productList.statusOutOfStock}
      </span>
    )
  }
  if (product.active) {
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
        {admin.productList.statusActive}
      </span>
    )
  }
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
      {admin.productList.statusInactive}
    </span>
  )
}

export default function ProductList() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [editingProduct, setEditingProduct] = useState(null)
  const [showNewForm, setShowNewForm] = useState(false)
  const [deletingId, setDeletingId] = useState(null)
  const [togglingId, setTogglingId] = useState(null)

  useEffect(() => {
    fetchProducts()
  }, [])

  async function fetchProducts() {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`${API_URL}/api/products/all`, {
        credentials: 'include',
      })
      if (!res.ok) throw new Error('Falha ao carregar produtos.')
      const data = await res.json()
      setProducts(data.products || [])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(id) {
    if (!window.confirm(admin.productList.confirmDelete)) return
    setDeletingId(id)
    try {
      const res = await fetch(`${API_URL}/api/products/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      })
      if (!res.ok) throw new Error('Falha ao remover produto.')
      setProducts((prev) => prev.filter((p) => p.id !== id))
    } catch (err) {
      alert(err.message)
    } finally {
      setDeletingId(null)
    }
  }

  async function handleToggleActive(id) {
    setTogglingId(id)
    try {
      const res = await fetch(`${API_URL}/api/products/${id}/toggle-active`, {
        method: 'PUT',
        credentials: 'include',
      })
      if (!res.ok) throw new Error('Falha ao alternar status.')
      const data = await res.json()
      setProducts((prev) => prev.map((p) => (p.id === id ? data.product : p)))
    } catch (err) {
      alert(err.message)
    } finally {
      setTogglingId(null)
    }
  }

  function handleSaved() {
    setEditingProduct(null)
    setShowNewForm(false)
    fetchProducts()
  }

  if (loading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-white rounded-xl p-4 animate-pulse flex gap-4">
            <div className="w-14 h-14 bg-gray-200 rounded-lg flex-shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-200 rounded w-1/3" />
              <div className="h-3 bg-gray-200 rounded w-1/4" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-4">{error}</p>
        <button
          onClick={fetchProducts}
          className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-medium hover:bg-indigo-700 transition-colors"
        >
          Tentar novamente
        </button>
      </div>
    )
  }

  return (
    <div>
      {/* Header actions */}
      <div className="flex items-center justify-between mb-5">
        <p className="text-sm text-gray-500">
          {products.length} produto{products.length !== 1 ? 's' : ''} cadastrado{products.length !== 1 ? 's' : ''}
        </p>
        <button
          onClick={() => setShowNewForm(true)}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-xl font-medium text-sm transition-colors shadow-sm"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          {admin.productList.newProduct}
        </button>
      </div>

      {/* Products list */}
      {products.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-gray-200">
          <p className="text-gray-400 mb-4">{admin.productList.empty}</p>
          <button
            onClick={() => setShowNewForm(true)}
            className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-medium hover:bg-indigo-700 transition-colors text-sm"
          >
            {admin.productList.firstProduct}
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          {products.map((product) => {
            const image =
              product.images && product.images.length > 0
                ? (product.images.find((i) => i.is_primary === 1) || product.images[0]).url
                : `https://placehold.co/56x56/4f46e5/ffffff?text=${encodeURIComponent(product.name.charAt(0))}`

            return (
              <div
                key={product.id}
                className={`bg-white rounded-xl border transition-all ${
                  product.active ? 'border-gray-100' : 'border-gray-200 opacity-60'
                } p-4 flex items-center gap-4`}
              >
                {/* Thumbnail */}
                <div className="w-14 h-14 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                  <img
                    src={image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = `https://placehold.co/56x56/4f46e5/ffffff?text=${encodeURIComponent(product.name.charAt(0))}`
                    }}
                  />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-semibold text-gray-900 text-sm truncate">{product.name}</p>
                    <StatusBadge product={product} />
                  </div>
                  <div className="flex items-center gap-3 mt-0.5 flex-wrap">
                    <span className="text-indigo-700 font-bold text-sm">{formatPrice(product.price)}</span>
                    <span className="text-gray-400 text-xs">{product.category}</span>
                    <span className="text-gray-400 text-xs">{admin.productList.stockLabel}: {product.stock}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  {/* Toggle active */}
                  <button
                    onClick={() => handleToggleActive(product.id)}
                    disabled={togglingId === product.id}
                    title={product.active ? admin.productList.statusInactive : admin.productList.statusActive}
                    className={`p-2 rounded-lg transition-colors text-xs font-medium ${
                      product.active
                        ? 'text-green-600 hover:bg-green-50'
                        : 'text-gray-400 hover:bg-gray-50'
                    }`}
                    aria-label={product.active ? 'Desativar produto' : 'Ativar produto'}
                  >
                    {togglingId === product.id ? (
                      <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    )}
                  </button>

                  {/* Edit */}
                  <button
                    onClick={() => setEditingProduct(product)}
                    className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                    aria-label="Editar produto"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>

                  {/* Delete */}
                  <button
                    onClick={() => handleDelete(product.id)}
                    disabled={deletingId === product.id}
                    className="p-2 text-red-400 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors"
                    aria-label="Remover produto"
                  >
                    {deletingId === product.id ? (
                      <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Modals */}
      {showNewForm && (
        <ProductForm
          product={null}
          onClose={() => setShowNewForm(false)}
          onSaved={handleSaved}
        />
      )}
      {editingProduct && (
        <ProductForm
          product={editingProduct}
          onClose={() => setEditingProduct(null)}
          onSaved={handleSaved}
        />
      )}
    </div>
  )
}
