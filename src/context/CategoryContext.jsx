import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useState,
} from "react";
import { getAllCategories } from "../services/categoryService";
import { notify } from "../lib/notify";

const CategoryContext = createContext(null);
const DEFAULT_THEME = "from-amber-700 to-amber-900";

export function CategoryProvider({ children }) {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchCategories = useCallback(async () => {
        setLoading(true);
        try {
            const res = await getAllCategories();
            if (res.isError) {
                notify(
                    "error",
                    res.message || "Không thể tải danh sách danh mục",
                );
                setCategories([]);
                return;
            }
            setCategories(res.data ?? []);
        } catch {
            notify("error", "Không thể kết nối máy chủ, vui lòng thử lại");
            setCategories([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    function getCategoryName(id) {
        return categories.find((c) => c._id === id)?.name ?? id;
    }

    function getCategoryTheme(id) {
        return categories.find((c) => c._id === id)?.theme ?? DEFAULT_THEME;
    }

    const value = {
        categories,
        loading,
        refetch: fetchCategories,
        getCategoryName,
        getCategoryTheme,
    };

    return (
        <CategoryContext.Provider value={value}>
            {children}
        </CategoryContext.Provider>
    );
}

export function useCategoryContext() {
    const ctx = useContext(CategoryContext);
    if (!ctx)
        throw new Error(
            "useCategoryContext must be used within CategoryProvider",
        );
    return ctx;
}
