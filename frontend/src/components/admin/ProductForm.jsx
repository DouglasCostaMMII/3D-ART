import { API_URL } from '../../lib/api'
import { useState, useEffect } from 'react'
import { admin } from '../../config/content'

const CATEGORIES = admin.categories
const VARIATION_TYPES = admin.variationTypes

function formatPrice(price) {
  return `R$ ${price.toFixed(2).replace('.', ',')}`
}

export default function ProductForm({ product, onClose, onSaved }) {
  const isEdit = !!product
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const [form, setForm] = useState({
    name: product?.name || '',
    description: product?.description || '',
    price: product?.price ?? '',
    category: product?.category || 'Decoração',
    active: product ? Boolean(product.active) : true,
    stock: product?.stock ?? 1,
  })

  const [variations, setVariations] = useState(
    product?.variations?.map((v) => ({ type: v.type, value: v.value })) || []
  )

  const [existingImages, setExistingImages] = useState(product?.images || [])
  const [newFiles, setNewFiles] = useState([])
  const [filePreviews, setFilePreviews] = useState([])

  useEffect(() => {
    return () => {
      filePreviews.forEach((url) => URL.revokeObjectURL(url))
    }
  }, [filePreviews])

  function handleChange(e) {
    const { name, value, type, checked } = e.target
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  function addVariation() {
    setVariations((prev) => [...prev, { type: 'cor', value: '' }])
  }

  function removeVariation(index) {
    setVariations((prev) => prev.filter((_, i) => i !== index))
  }

  function updateVariation(index, field, value) {
    setVariations((prev) => prev.map((v, i) => (i === index ? { ...v, [field]: value } : v)))
  }

  function handleFileChange(e) {
    const files = Array.from(e.target.files)
    setNewFiles((prev) => [...prev, ...files])
    const previews = files.map((f) => URL.createObjectURL(f))
    setFilePreviews((prev) => [...prev, ...previews])
    e.target.value = ''
  }

  function removeNewFile(index) {
    URL.revokeObjectURL(filePreviews[index])
    setNewFiles((prev) => prev.filter((_, i) => i !== index))
    setFilePreviews((prev) => prev.filter((_, i) => i !== index))
  }

  async function deleteExistingImage(productId, imageId) {
    try {
      const res = await fetch(`${API_URL}/api/products/${productId}/images/${imageId}`, {
        method: 'DELETE',
        credentials: 'include',
      })
      if (!res.ok) throw new Error('Falha ao remover imagem.')
      setExistingImages((prev) => prev.filter((img) => img.id !== imageId))
    } catch (err) {
      alert(err.message)
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const body = {
        name: form.name.trim(),
        description: form.description.trim(),
        price: parseFloat(form.price),
        category: form.category,
        active: form.active ? 1 : 0,
        stock: parseInt(form.stock) || 1,
        variations: JSON.stringify(variations.filter((v) => v.value.trim())),
      }

      if (!body.name || isNaN(body.price)) {
        throw new Error('Nome e preço são obrigatórios.')
      }

      const url = isEdit ? `/api/products/${product.id}` : '/api/products'
      const method = isEdit ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(body),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Erro ao salvar produto.')

      const savedProduct = data.product

      // Upload new images if any
      if (newFiles.length > 0) {
        const formData = new FormData()
        newFiles.forEach((file) => formData.append('images', file))

        const imgRes = await fetch(`${API_URL}/api/products/${savedProduct.id}/images`, {
          method: 'POST',
          credentials: 'include',
          body: formData,
        })

        if (!imgRes.ok) {
          const imgData = await imgRes.json().catch(() => ({}))
          throw new Error(imgData.message || 'Produto salvo, mas falha ao enviar imagens. Tente novamente.')
        }
      }

      onSaved()
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto py-4 px-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl my-auto">
        {/* Modal header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900">
            {isEdit ? admin.productForm.titleEdit : admin.productForm.titleCreate}
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Fechar"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-6 space-y-5">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
              {error}
            </div>
          )}

          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              {admin.productForm.nameLabel} <span className="text-red-500">*</span>
            </label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              placeholder={admin.productForm.namePlaceholder}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">{admin.productForm.descriptionLabel}</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={3}
              placeholder={admin.productForm.descriptionPlaceholder}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent resize-none"
            />
          </div>

          {/* Price + Category */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                {admin.productForm.priceLabel} <span className="text-red-500">*</span>
              </label>
              <input
                name="price"
                type="number"
                step="0.01"
                min="0"
                value={form.price}
                onChange={handleChange}
                required
                placeholder={admin.productForm.priceLabel}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">{admin.productForm.categoryLabel}</label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent bg-white"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Stock + Active */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">{admin.productForm.stockLabel}</label>
              <input
                name="stock"
                type="number"
                min="0"
                value={form.stock}
                onChange={handleChange}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
              />
            </div>
            <div className="flex items-end pb-2.5">
              <label className="flex items-center gap-3 cursor-pointer">
                <div className="relative">
                  <input
                    type="checkbox"
                    name="active"
                    checked={form.active}
                    onChange={handleChange}
                    className="sr-only"
                  />
                  <div
                    onClick={() => setForm((prev) => ({ ...prev, active: !prev.active }))}
                    className={`w-11 h-6 rounded-full transition-colors cursor-pointer ${
                      form.active ? 'bg-indigo-600' : 'bg-gray-300'
                    }`}
                  >
                    <div
                      className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                        form.active ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </div>
                </div>
                <span className="text-sm font-medium text-gray-700">
                  {form.active ? admin.productForm.activeLabel : admin.productForm.inactiveLabel}
                </span>
              </label>
            </div>
          </div>

          {/* Variations */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-gray-700">{admin.productForm.variationsLabel}</label>
              <button
                type="button"
                onClick={addVariation}
                className="text-xs text-indigo-600 hover:text-indigo-800 font-medium flex items-center gap-1"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
                {admin.productForm.addVariation}
              </button>
            </div>
            <div className="space-y-2">
              {variations.map((v, i) => (
                <div key={i} className="flex gap-2 items-center">
                  <select
                    value={v.type}
                    onChange={(e) => updateVariation(i, 'type', e.target.value)}
                    className="flex-shrink-0 w-32 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white"
                  >
                    {VARIATION_TYPES.map((t) => (
                      <option key={t.value} value={t.value}>{t.label}</option>
                    ))}
                  </select>
                  <input
                    value={v.value}
                    onChange={(e) => updateVariation(i, 'value', e.target.value)}
                    placeholder={admin.productForm.variationPlaceholder}
                    className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  />
                  <button
                    type="button"
                    onClick={() => removeVariation(i)}
                    className="p-2 text-gray-300 hover:text-red-500 transition-colors"
                    aria-label="Remover variação"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
              {variations.length === 0 && (
                <p className="text-xs text-gray-400 italic">Nenhuma variação adicionada.</p>
              )}
            </div>
          </div>

          {/* Images */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">{admin.productForm.imagesLabel}</label>

            {/* Existing images */}
            {existingImages.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {existingImages.map((img) => (
                  <div key={img.id} className="relative group">
                    <img
                      src={img.url}
                      alt="Imagem do produto"
                      className="w-20 h-20 object-cover rounded-lg border border-gray-200"
                      onError={(e) => { e.target.src = 'https://placehold.co/80x80/e5e7eb/9ca3af?text=Img' }}
                    />
                    {img.is_primary === 1 && (
                      <span className="absolute top-0.5 left-0.5 bg-indigo-600 text-white text-xs px-1 rounded text-[9px]">
                        {admin.productForm.primaryBadge}
                      </span>
                    )}
                    {isEdit && (
                      <button
                        type="button"
                        onClick={() => deleteExistingImage(product.id, img.id)}
                        className="absolute -top-1.5 -right-1.5 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow"
                        aria-label="Remover imagem"
                      >
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* New files preview */}
            {filePreviews.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {filePreviews.map((url, i) => (
                  <div key={i} className="relative group">
                    <img
                      src={url}
                      alt={`Nova imagem ${i + 1}`}
                      className="w-20 h-20 object-cover rounded-lg border-2 border-dashed border-indigo-300"
                    />
                    <button
                      type="button"
                      onClick={() => removeNewFile(i)}
                      className="absolute -top-1.5 -right-1.5 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow"
                      aria-label="Remover nova imagem"
                    >
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                    <span className="absolute bottom-0.5 left-0 right-0 text-center text-white text-[9px] bg-indigo-600/80 rounded-b-lg">
                      {admin.productForm.newBadge}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* File input */}
            <label className="flex items-center justify-center gap-2 border-2 border-dashed border-gray-300 rounded-xl py-4 cursor-pointer hover:border-indigo-400 hover:bg-indigo-50 transition-colors">
              <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
              </svg>
              <span className="text-sm text-gray-500">
                {admin.productForm.uploadHint}
              </span>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-gray-200 text-gray-700 py-3 rounded-xl font-medium hover:bg-gray-50 transition-colors text-sm"
            >
              {admin.productForm.cancelButton}
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white py-3 rounded-xl font-semibold transition-colors text-sm flex items-center justify-center gap-2"
            >
              {loading && (
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              )}
              {loading ? admin.productForm.savingButton : isEdit ? admin.productForm.saveButton : admin.productForm.createButton}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
