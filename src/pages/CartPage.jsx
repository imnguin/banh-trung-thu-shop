import { Link } from "react-router-dom";
import { ShoppingCart, Trash } from "@phosphor-icons/react";
import QuantitySelector from "../components/QuantitySelector";
import { useCart } from "../context/CartContext";
import { formatCurrency } from "../lib/format";

export default function CartPage() {
    const { items, updateQty, removeItem, subtotal } = useCart();

    if (items.length === 0) {
        return (
            <div className="mx-auto flex max-w-6xl flex-col items-center px-4 py-20 text-center">
                <ShoppingCart
                    size={56}
                    className="text-muted-foreground"
                    aria-hidden="true"
                />
                <h1 className="mt-4 font-heading text-xl font-bold text-foreground">
                    Giỏ hàng của bạn đang trống
                </h1>
                <p className="mt-2 text-sm text-muted-foreground">
                    Hãy chọn vài chiếc bánh trung thu ngon lành nhé!
                </p>
                <Link
                    to="/san-pham"
                    className="mt-6 inline-flex rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary-hover"
                >
                    Xem sản phẩm
                </Link>
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-6xl px-4 py-8">
            <h1 className="font-heading text-2xl font-bold text-foreground">
                Giỏ hàng ({items.length})
            </h1>

            <div className="mt-6 grid gap-8 lg:grid-cols-3">
                <ul className="flex flex-col gap-4 lg:col-span-2">
                    {items.map((item) => (
                        <li
                            key={item.key}
                            className="flex gap-4 rounded-xl border border-border bg-surface p-4"
                        >
                            <div className="min-w-0 flex-1">
                                <div className="flex items-start justify-between gap-2">
                                    <div>
                                        <h2 className="font-medium text-foreground">
                                            {item.name}
                                        </h2>
                                        <p className="text-sm text-muted-foreground">
                                            {item.variantLabel}
                                        </p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => removeItem(item.key)}
                                        aria-label={`Xóa ${item.name} khỏi giỏ hàng`}
                                        className="cursor-pointer rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                                    >
                                        <Trash size={18} />
                                    </button>
                                </div>
                                <div className="mt-3 flex items-center justify-between">
                                    <QuantitySelector
                                        size="sm"
                                        value={item.qty}
                                        onChange={(v) => updateQty(item.key, v)}
                                    />
                                    <span className="font-semibold text-primary">
                                        {formatCurrency(
                                            item.unitPrice * item.qty,
                                        )}
                                    </span>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>

                <div className="h-fit rounded-xl border border-border bg-surface p-5">
                    <h2 className="font-heading text-lg font-bold text-foreground">
                        Tóm tắt đơn hàng
                    </h2>
                    <div className="mt-4 flex justify-between text-sm">
                        <span className="text-muted-foreground">Tạm tính</span>
                        <span className="font-medium text-foreground">
                            {formatCurrency(subtotal)}
                        </span>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">
                        Phí vận chuyển sẽ được tính ở bước thanh toán.
                    </p>
                    <Link
                        to="/thanh-toan"
                        className="mt-5 block w-full rounded-full bg-accent py-3 text-center text-sm font-semibold text-accent-foreground transition-colors hover:bg-accent-hover"
                    >
                        Tiến hành thanh toán
                    </Link>
                    <Link
                        to="/san-pham"
                        className="mt-3 block text-center text-sm text-primary hover:underline"
                    >
                        Tiếp tục mua sắm
                    </Link>
                </div>
            </div>
        </div>
    );
}
