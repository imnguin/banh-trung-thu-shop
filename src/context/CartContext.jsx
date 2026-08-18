import { createContext, useContext, useEffect, useMemo, useState } from "react";

const CartContext = createContext(null);
const STORAGE_KEY = "ktt_cart";

function loadCart() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? JSON.parse(raw) : [];
    } catch {
        return [];
    }
}

export function CartProvider({ children }) {
    const [items, setItems] = useState(loadCart);

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    }, [items]);

    function addItem(product, variant, qty) {
        const key = `${product._id}::${variant.id}`;
        const unitPrice = product.price + variant.priceDiff;
        setItems((prev) => {
            const existing = prev.find((i) => i.key === key);
            if (existing) {
                return prev.map((i) =>
                    i.key === key ? { ...i, qty: i.qty + qty } : i,
                );
            }
            return [
                ...prev,
                {
                    key,
                    productId: product._id,
                    slug: product.slug,
                    variantId: variant.id,
                    name: product.name,
                    variantLabel: variant.label,
                    unitPrice,
                    qty,
                },
            ];
        });
    }

    function updateQty(key, qty) {
        if (qty <= 0) {
            removeItem(key);
            return;
        }
        setItems((prev) =>
            prev.map((i) => (i.key === key ? { ...i, qty } : i)),
        );
    }

    function removeItem(key) {
        setItems((prev) => prev.filter((i) => i.key !== key));
    }

    function clearCart() {
        setItems([]);
    }

    const subtotal = useMemo(
        () => items.reduce((sum, i) => sum + i.unitPrice * i.qty, 0),
        [items],
    );
    const itemCount = useMemo(
        () => items.reduce((sum, i) => sum + i.qty, 0),
        [items],
    );

    const value = {
        items,
        addItem,
        updateQty,
        removeItem,
        clearCart,
        subtotal,
        itemCount,
    };

    return (
        <CartContext.Provider value={value}>{children}</CartContext.Provider>
    );
}

export function useCart() {
    const ctx = useContext(CartContext);
    if (!ctx) throw new Error("useCart must be used within CartProvider");
    return ctx;
}
