import { Link } from 'react-router-dom'
import { ArrowRight, Leaf, ShieldCheck, Truck } from '@phosphor-icons/react'
import ProductCard from '../components/ProductCard'
import ProductImage from '../components/ProductImage'
import { useProducts } from '../hooks/useProducts'
import { CATEGORIES } from '../data/categories'

const FEATURES = [
  { icon: Truck, title: 'Giao hàng nhanh', desc: 'Giao trong 2-4 giờ nội thành' },
  { icon: ShieldCheck, title: 'Cam kết chất lượng', desc: 'Nguyên liệu chọn lọc, không chất bảo quản' },
  { icon: Leaf, title: 'Có bản ít đường', desc: 'Phù hợp người ăn kiêng, tiểu đường' },
]

export default function HomePage() {
  const { products, loading } = useProducts({ activeOnly: true })
  const bestSellers = products.filter((p) => p.tags.includes('best-seller')).slice(0, 4)
  const newProducts = products.filter((p) => p.tags.includes('new')).slice(0, 4)

  return (
    <div>
      <section className="bg-gradient-to-br from-primary to-primary-hover text-primary-foreground">
        <div className="mx-auto grid max-w-6xl items-center gap-8 px-4 py-14 md:grid-cols-2 md:py-20">
          <div>
            <span className="inline-block rounded-full bg-white/15 px-3 py-1 text-xs font-semibold tracking-wide">
              MÙA TRUNG THU 2026
            </span>
            <h1 className="mt-4 font-heading text-3xl font-bold leading-tight md:text-5xl">
              Trọn vị đoàn viên trong từng chiếc bánh
            </h1>
            <p className="mt-4 max-w-md text-base text-primary-foreground/85">
              Bánh trung thu gia truyền Kim Yến - đặt hàng online chỉ trong vài phút, giao tận nơi trên toàn quốc.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                to="/san-pham"
                className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-accent-foreground transition-colors hover:bg-accent-hover"
              >
                Xem sản phẩm <ArrowRight size={18} />
              </Link>
              <Link
                to="/san-pham?danh-muc=cao-cap"
                className="inline-flex items-center gap-2 rounded-full border border-white/40 px-6 py-3 text-sm font-semibold hover:bg-white/10"
              >
                Hộp quà cao cấp
              </Link>
            </div>
          </div>
          <ProductImage category="cao-cap" className="aspect-[4/3] w-full" />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-10">
        <div className="grid gap-4 sm:grid-cols-3">
          {FEATURES.map((f) => (
            <div key={f.title} className="flex items-start gap-3 rounded-xl border border-border bg-surface p-4">
              <f.icon size={28} className="shrink-0 text-primary" aria-hidden="true" />
              <div>
                <div className="font-semibold text-foreground">{f.title}</div>
                <div className="text-sm text-muted-foreground">{f.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-6">
        <h2 className="mb-4 font-heading text-xl font-bold text-foreground">Danh mục sản phẩm</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
          {CATEGORIES.map((cat) => (
            <Link key={cat.id} to={`/san-pham?danh-muc=${cat.id}`} className="group">
              <ProductImage category={cat.id} className="aspect-square w-full" />
              <div className="mt-2 text-center text-sm font-medium text-foreground group-hover:text-primary">
                {cat.name}
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-10">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-heading text-xl font-bold text-foreground">Bán chạy nhất</h2>
          <Link to="/san-pham" className="text-sm font-medium text-primary hover:underline">
            Xem tất cả
          </Link>
        </div>
        {!loading && bestSellers.length === 0 ? (
          <p className="text-muted-foreground">Chưa có sản phẩm bán chạy nào.</p>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {bestSellers.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        )}
      </section>

      {newProducts.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 py-10">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-heading text-xl font-bold text-foreground">Sản phẩm mới</h2>
            <Link to="/san-pham" className="text-sm font-medium text-primary hover:underline">
              Xem tất cả
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {newProducts.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
