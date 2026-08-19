import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import { useProducts } from "../hooks/useProducts";
import { useCategoryContext } from "../context/CategoryContext";

const SORT_OPTIONS = [
    { value: "default", label: "Nổi bật" },
    { value: "price-asc", label: "Giá tăng dần" },
    { value: "price-desc", label: "Giá giảm dần" },
];

export default function ProductsPage() {
    const { products, loading } = useProducts({ activeOnly: true });
    const { categories } = useCategoryContext();
    const [searchParams, setSearchParams] = useSearchParams();
    const activeCategory = searchParams.get("danh-muc") ?? "";
    const query = searchParams.get("q") ?? "";
    const sort = searchParams.get("sort") ?? "default";

    const filtered = useMemo(() => {
        let list = products;
        if (activeCategory) {
            list = list.filter((p) => p.category === activeCategory);
        }
        if (query) {
            const q = query.toLowerCase();
            list = list.filter(
                (p) =>
                    p.name.toLowerCase().includes(q) ||
                    p.shortDesc.toLowerCase().includes(q),
            );
        }
        if (sort === "price-asc") {
            list = [...list].sort((a, b) => a.price - b.price);
        } else if (sort === "price-desc") {
            list = [...list].sort((a, b) => b.price - a.price);
        }
        return list;
    }, [products, activeCategory, query, sort]);

    function setParam(key, value) {
        const next = new URLSearchParams(searchParams);
        if (value) next.set(key, value);
        else next.delete(key);
        setSearchParams(next);
    }

    return (
        <div className="mx-auto max-w-6xl px-4 py-8">
            <h1 className="font-heading text-2xl font-bold text-foreground">
                Tất cả sản phẩm
            </h1>
            {query && (
                <p className="mt-1 text-sm text-muted-foreground">
                    Kết quả tìm kiếm cho "
                    <span className="font-medium text-foreground">{query}</span>
                    "
                </p>
            )}

            <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div
                    className="flex gap-2 overflow-x-auto pb-1"
                    role="group"
                    aria-label="Lọc theo danh mục"
                >
                    <button
                        type="button"
                        onClick={() => setParam("danh-muc", "")}
                        className={`shrink-0 cursor-pointer rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                            activeCategory === ""
                                ? "border-primary bg-primary text-primary-foreground"
                                : "border-border text-foreground hover:border-primary"
                        }`}
                    >
                        Tất cả
                    </button>
                    {categories.map((cat) => (
                        <button
                            key={cat._id}
                            type="button"
                            onClick={() => setParam("danh-muc", cat._id)}
                            className={`shrink-0 cursor-pointer rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                                activeCategory === cat._id
                                    ? "border-primary bg-primary text-primary-foreground"
                                    : "border-border text-foreground hover:border-primary"
                            }`}
                        >
                            {cat.name}
                        </button>
                    ))}
                </div>

                <label className="flex shrink-0 items-center gap-2 text-sm">
                    <span className="text-muted-foreground">Sắp xếp:</span>
                    <select
                        value={sort}
                        onChange={(e) => setParam("sort", e.target.value)}
                        className="cursor-pointer rounded-lg border border-border bg-surface px-3 py-2 outline-none focus:border-primary focus:ring-2 focus:ring-primary/30"
                    >
                        {SORT_OPTIONS.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                                {opt.label}
                            </option>
                        ))}
                    </select>
                </label>
            </div>

            {loading ? (
                <div className="mt-16 text-center text-muted-foreground">
                    Đang tải sản phẩm...
                </div>
            ) : filtered.length === 0 ? (
                <div className="mt-16 text-center text-muted-foreground">
                    Không tìm thấy sản phẩm phù hợp. Thử chọn danh mục khác hoặc
                    từ khóa khác.
                </div>
            ) : (
                <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                    {filtered.map((p) => (
                        <ProductCard key={p._id} product={p} />
                    ))}
                </div>
            )}
        </div>
    );
}
