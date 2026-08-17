import { useState } from 'react'
import { PencilSimple, Plus, Trash } from '@phosphor-icons/react'
import Modal from '../../components/Modal'
import { useProducts } from '../../hooks/useProducts'
import { saveProduct, deleteProduct, toggleProductStatus } from '../../services/productService'
import { notify } from '../../lib/notify'
import { CATEGORIES } from '../../data/categories'
import { formatCurrency } from '../../lib/format'

const TAG_OPTIONS = [
  { id: 'best-seller', label: 'Bán chạy' },
  { id: 'new', label: 'Mới' },
]

const emptyForm = () => ({
  _id: null,
  name: '',
  category: CATEGORIES[0].id,
  shortDesc: '',
  description: '',
  price: '',
  oldPrice: '',
  weightGram: '',
  image: '',
  active: true,
  tags: [],
  variants: [{ label: 'Mặc định', priceDiff: 0 }],
})

export default function SellerProductsPage() {
  const { products, loading, refetch } = useProducts({ activeOnly: false })
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [form, setForm] = useState(emptyForm())
  const [saving, setSaving] = useState(false)

  function openCreate() {
    setForm(emptyForm())
    setIsModalOpen(true)
  }

  function openEdit(product) {
    setForm({
      _id: product._id,
      name: product.name,
      category: product.category,
      shortDesc: product.shortDesc || '',
      description: product.description || '',
      price: product.price,
      oldPrice: product.oldPrice || '',
      weightGram: product.weightGram || '',
      image: product.image || '',
      active: product.active,
      tags: product.tags || [],
      variants: product.variants?.length ? product.variants.map((v) => ({ label: v.label, priceDiff: v.priceDiff })) : [{ label: 'Mặc định', priceDiff: 0 }],
    })
    setIsModalOpen(true)
  }

  async function handleDelete(product) {
    if (!window.confirm(`Xóa sản phẩm "${product.name}"?`)) return
    const res = await deleteProduct(product._id)
    if (res.isError) {
      notify('error', res.message)
      return
    }
    notify('success', res.message)
    refetch()
  }

  async function handleToggleActive(product) {
    const res = await toggleProductStatus(product._id, !product.active)
    if (res.isError) {
      notify('error', res.message)
      return
    }
    refetch()
  }

  function updateVariant(index, key, value) {
    setForm((prev) => ({
      ...prev,
      variants: prev.variants.map((v, i) => (i === index ? { ...v, [key]: value } : v)),
    }))
  }

  function addVariant() {
    setForm((prev) => ({ ...prev, variants: [...prev.variants, { label: '', priceDiff: 0 }] }))
  }

  function removeVariant(index) {
    setForm((prev) => ({ ...prev, variants: prev.variants.filter((_, i) => i !== index) }))
  }

  function toggleTag(tagId) {
    setForm((prev) => ({
      ...prev,
      tags: prev.tags.includes(tagId) ? prev.tags.filter((t) => t !== tagId) : [...prev.tags, tagId],
    }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.name.trim()) {
      notify('error', 'Vui lòng nhập tên sản phẩm')
      return
    }

    setSaving(true)
    const payload = {
      _id: form._id,
      name: form.name.trim(),
      category: form.category,
      shortDesc: form.shortDesc.trim(),
      description: form.description.trim(),
      price: Number(form.price) || 0,
      oldPrice: form.oldPrice ? Number(form.oldPrice) : null,
      weightGram: Number(form.weightGram) || 0,
      image: form.image.trim(),
      active: form.active,
      tags: form.tags,
      variants: form.variants
        .filter((v) => v.label.trim())
        .map((v, i) => ({ id: `v${i + 1}`, label: v.label.trim(), priceDiff: Number(v.priceDiff) || 0 })),
    }

    try {
      const res = await saveProduct(payload)
      if (res.isError) {
        notify('error', res.message)
        return
      }
      notify('success', res.message)
      setIsModalOpen(false)
      refetch()
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-heading text-2xl font-bold text-foreground">Quản lý sản phẩm</h1>
        <button
          type="button"
          onClick={openCreate}
          className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary-hover"
        >
          <Plus size={18} /> Thêm sản phẩm
        </button>
      </div>

      {loading ? (
        <p className="mt-8 text-center text-muted-foreground">Đang tải...</p>
      ) : products.length === 0 ? (
        <p className="mt-8 text-center text-muted-foreground">Chưa có sản phẩm nào, hãy thêm sản phẩm đầu tiên.</p>
      ) : (
        <div className="mt-4 overflow-x-auto rounded-xl border border-border bg-surface">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="border-b border-border text-xs uppercase text-muted-foreground">
              <tr>
                <th className="px-4 py-3">Sản phẩm</th>
                <th className="px-4 py-3">Danh mục</th>
                <th className="px-4 py-3">Giá</th>
                <th className="px-4 py-3">Hiển thị</th>
                <th className="px-4 py-3">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p._id} className="border-b border-border last:border-0 hover:bg-muted">
                  <td className="px-4 py-3 font-medium text-foreground">{p.name}</td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {CATEGORIES.find((c) => c.id === p.category)?.name ?? p.category}
                  </td>
                  <td className="px-4 py-3 text-foreground">{formatCurrency(p.price)}</td>
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      onClick={() => handleToggleActive(p)}
                      className={`cursor-pointer rounded-full px-2.5 py-1 text-xs font-semibold ${
                        p.active ? 'bg-emerald-100 text-emerald-800' : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      {p.active ? 'Đang bán' : 'Ngừng bán'}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => openEdit(p)}
                        aria-label={`Sửa ${p.name}`}
                        className="cursor-pointer rounded-full p-1.5 text-muted-foreground hover:bg-muted hover:text-primary"
                      >
                        <PencilSimple size={18} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(p)}
                        aria-label={`Xóa ${p.name}`}
                        className="cursor-pointer rounded-full p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                      >
                        <Trash size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)} title={form._id ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới'} maxWidthClass="max-w-2xl">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-foreground">Tên sản phẩm</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/30"
                required
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-foreground">Danh mục</label>
              <select
                value={form.category}
                onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                className="w-full cursor-pointer rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/30"
              >
                {CATEGORIES.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-foreground">Mô tả ngắn</label>
            <input
              type="text"
              value={form.shortDesc}
              onChange={(e) => setForm((f) => ({ ...f, shortDesc: e.target.value }))}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/30"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-foreground">Mô tả chi tiết</label>
            <textarea
              rows={3}
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/30"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="mb-1 block text-sm font-medium text-foreground">Giá bán</label>
              <input
                type="number"
                min={0}
                value={form.price}
                onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/30"
                required
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-foreground">Giá gốc (nếu giảm giá)</label>
              <input
                type="number"
                min={0}
                value={form.oldPrice}
                onChange={(e) => setForm((f) => ({ ...f, oldPrice: e.target.value }))}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/30"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-foreground">Khối lượng (g)</label>
              <input
                type="number"
                min={0}
                value={form.weightGram}
                onChange={(e) => setForm((f) => ({ ...f, weightGram: e.target.value }))}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/30"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-foreground">Link ảnh (tùy chọn)</label>
            <input
              type="text"
              value={form.image}
              onChange={(e) => setForm((f) => ({ ...f, image: e.target.value }))}
              placeholder="https://..."
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/30"
            />
          </div>

          <div className="flex flex-wrap items-center gap-4">
            {TAG_OPTIONS.map((tag) => (
              <label key={tag.id} className="flex cursor-pointer items-center gap-2 text-sm text-foreground">
                <input
                  type="checkbox"
                  checked={form.tags.includes(tag.id)}
                  onChange={() => toggleTag(tag.id)}
                  className="h-4 w-4 accent-[var(--color-primary)]"
                />
                {tag.label}
              </label>
            ))}
            <label className="flex cursor-pointer items-center gap-2 text-sm text-foreground">
              <input
                type="checkbox"
                checked={form.active}
                onChange={(e) => setForm((f) => ({ ...f, active: e.target.checked }))}
                className="h-4 w-4 accent-[var(--color-primary)]"
              />
              Đang bán
            </label>
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className="text-sm font-semibold text-foreground">Quy cách / Variant</label>
              <button type="button" onClick={addVariant} className="cursor-pointer text-sm font-medium text-primary hover:underline">
                + Thêm quy cách
              </button>
            </div>
            <div className="flex flex-col gap-2">
              {form.variants.map((v, i) => (
                <div key={i} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Tên quy cách (VD: Hộp 2 bánh)"
                    value={v.label}
                    onChange={(e) => updateVariant(i, 'label', e.target.value)}
                    className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/30"
                  />
                  <input
                    type="number"
                    placeholder="Chênh lệch giá"
                    value={v.priceDiff}
                    onChange={(e) => updateVariant(i, 'priceDiff', e.target.value)}
                    className="w-40 rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/30"
                  />
                  {form.variants.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeVariant(i)}
                      aria-label="Xóa quy cách"
                      className="cursor-pointer rounded-lg px-3 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                    >
                      <Trash size={16} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="mt-2 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="cursor-pointer rounded-full border border-border px-5 py-2.5 text-sm font-semibold text-foreground hover:bg-muted"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={saving}
              className="cursor-pointer rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary-hover disabled:cursor-wait disabled:opacity-70"
            >
              {saving ? 'Đang lưu...' : form._id ? 'Lưu thay đổi' : 'Thêm sản phẩm'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
