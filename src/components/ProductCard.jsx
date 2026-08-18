import { Link } from "react-router-dom";
import ProductImage from "./ProductImage";
import { formatCurrency } from "../lib/format";

export default function ProductCard({ product }) {
    const discount = product.oldPrice
        ? Math.round(
              ((product.oldPrice - product.price) / product.oldPrice) * 100,
          )
        : null;

    return (
        <Link
            to={`/san-pham/${product.slug}`}
            className="group flex flex-col overflow-hidden rounded-xl border border-border bg-surface transition-shadow hover:shadow-lg"
        >
            <div className="relative p-3 pb-0">
                <ProductImage
                    category={product.category}
                    image={product.image}
                    alt={product.name}
                    className="aspect-square w-full"
                />
                <div className="absolute left-5 top-5 flex flex-col gap-1">
                    {product.tags.includes("best-seller") && (
                        <span className="rounded-full bg-accent px-2 py-0.5 text-xs font-semibold text-accent-foreground">
                            Bán chạy
                        </span>
                    )}
                    {product.tags.includes("new") && (
                        <span className="rounded-full bg-success px-2 py-0.5 text-xs font-semibold text-success-foreground">
                            Mới
                        </span>
                    )}
                </div>
                {discount && (
                    <span className="absolute right-5 top-5 rounded-full bg-primary px-2 py-0.5 text-xs font-semibold text-primary-foreground">
                        -{discount}%
                    </span>
                )}
            </div>
            <div className="flex flex-1 flex-col gap-1.5 p-4">
                <h3 className="font-heading text-base font-semibold leading-snug text-foreground group-hover:text-primary">
                    {product.name}
                </h3>
                <p className="line-clamp-2 text-sm text-muted-foreground">
                    {product.shortDesc}
                </p>
                <div className="mt-auto flex items-baseline gap-2 pt-2">
                    <span className="text-lg font-bold text-primary">
                        {formatCurrency(product.price)}
                    </span>
                    {product.oldPrice && (
                        <span className="text-sm text-muted-foreground line-through">
                            {formatCurrency(product.oldPrice)}
                        </span>
                    )}
                </div>
            </div>
        </Link>
    );
}
