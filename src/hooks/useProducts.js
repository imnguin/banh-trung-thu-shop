import { useCallback, useEffect, useState } from "react";
import { getAllProducts } from "../services/productService";
import { notify } from "../lib/notify";

export function useProducts({ activeOnly = false } = {}) {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchProducts = useCallback(async () => {
        setLoading(true);
        try {
            const res = await getAllProducts();
            if (res.isError) {
                notify(
                    "error",
                    res.message || "Không thể tải danh sách sản phẩm",
                );
                setProducts([]);
                return;
            }
            const data = res.data ?? [];
            setProducts(activeOnly ? data.filter((p) => p.active) : data);
        } catch {
            notify("error", "Không thể kết nối máy chủ, vui lòng thử lại");
            setProducts([]);
        } finally {
            setLoading(false);
        }
    }, [activeOnly]);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    return { products, loading, refetch: fetchProducts };
}
