import { useState } from 'react'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import { CaretRight, Check, ShoppingCart } from '@phosphor-icons/react'
import ProductImage from '../components/ProductImage'
import QuantitySelector from '../components/QuantitySelector'
import { getProductBySlug } from '../data/products'
import { getCategoryName } from '../data/categories'
import { useCart } from '../context/CartContext'
import { formatCurrency } from '../lib/format'

export default function ProductDetailPage() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const { addItem } = useCart()
  const product = getProductBySlug(slug)

  const [variantId, setVariantId] = useState(product?.variants[0]?.id)
  const [qty, setQty] = useState(1)
  const [added, setAdded] = useState(false)

  if (!product) {
    return <Navigate to="/san-pham" replace />
  }

  const variant = product.variants.find((v) => v.id === variantId)
  const unitPrice = product.price + variant.priceDiff

  function handleAddToCart() {
    addItem(product, variant, qty)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  function handleBuyNow() {
    addItem(product, variant, qty)
    navigate('/gio-hang')
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <nav className="mb-4 flex items-center gap-1.5 text-sm text-muted-foreground" aria-label="Breadcrumb">
        <Link to="/" className="hover:text-primary">
          Trang chủ
        </Link>
        <CaretRight size={12} aria-hidden="true" />
        <Link to={`/san-pham?danh-muc=${product.category}`} className="hover:text-primary">
          {getCategoryName(product.category)}
        </Link>
        <CaretRight size={12} aria-hidden="true" />
        <span className="text-foreground">{product.name}</span>
      </nav>

      <div className="grid gap-8 md:grid-cols-2">
        <ProductImage category={product.category} className="aspect-square w-full" />

        <div>
          <h1 className="font-heading text-2xl font-bold text-foreground">{product.name}</h1>
          <p className="mt-1 text-sm text-muted-foreground">Khối lượng: {product.weightGram}g</p>

          <div className="mt-4 flex items-baseline gap-3">
            <span className="text-2xl font-bold text-primary">{formatCurrency(unitPrice)}</span>
            {product.oldPrice && (
              <span className="text-base text-muted-foreground line-through">{formatCurrency(product.oldPrice)}</span>
            )}
          </div>

          <p className="mt-4 text-sm leading-relaxed text-foreground">{product.description}</p>

          {product.variants.length > 1 && (
            <fieldset className="mt-6">
              <legend className="mb-2 text-sm font-semibold text-foreground">Chọn quy cách</legend>
              <div className="flex flex-wrap gap-2">
                {product.variants.map((v) => (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() => setVariantId(v.id)}
                    aria-pressed={variantId === v.id}
                    className={`cursor-pointer rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
                      variantId === v.id
                        ? 'border-primary bg-primary text-primary-foreground'
                        : 'border-border text-foreground hover:border-primary'
                    }`}
                  >
                    {v.label}
                  </button>
                ))}
              </div>
            </fieldset>
          )}

          <div className="mt-6">
            <div className="mb-2 text-sm font-semibold text-foreground">Số lượng</div>
            <QuantitySelector value={qty} onChange={setQty} />
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={handleAddToCart}
              className="inline-flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-full border border-primary px-6 py-3 text-sm font-semibold text-primary transition-colors hover:bg-primary/10"
            >
              {added ? (
                <>
                  <Check size={18} /> Đã thêm vào giỏ
                </>
              ) : (
                <>
                  <ShoppingCart size={18} /> Thêm vào giỏ
                </>
              )}
            </button>
            <button
              type="button"
              onClick={handleBuyNow}
              className="flex-1 cursor-pointer rounded-full bg-accent px-6 py-3 text-sm font-semibold text-accent-foreground transition-colors hover:bg-accent-hover"
            >
              Mua ngay
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
