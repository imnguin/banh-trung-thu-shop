import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    List,
    MagnifyingGlass,
    MoonStars,
    ShoppingCart,
    X,
} from "@phosphor-icons/react";
import { useCart } from "../context/CartContext";
import { useCategoryContext } from "../context/CategoryContext";

const NAV_LINKS = [
    { to: "/", label: "Trang chủ" },
    { to: "/san-pham", label: "Tất cả sản phẩm" },
    { to: "/tra-cuu-don-hang", label: "Tra cứu đơn hàng" },
];

export default function Header() {
    const { itemCount } = useCart();
    const { categories } = useCategoryContext();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [search, setSearch] = useState("");
    const navigate = useNavigate();

    function handleSearchSubmit(e) {
        e.preventDefault();
        navigate(
            search.trim()
                ? `/san-pham?q=${encodeURIComponent(search.trim())}`
                : "/san-pham",
        );
        setMobileOpen(false);
    }

    return (
        <header className="sticky top-0 z-40 border-b border-border bg-surface/95 backdrop-blur">
            <div className="mx-auto flex h-16 max-w-6xl items-center gap-4 px-4">
                <Link
                    to="/"
                    className="flex shrink-0 items-center gap-2 font-heading text-lg font-bold text-primary"
                >
                    <MoonStars size={26} weight="fill" aria-hidden="true" />
                    <span>Bách Hóa SV</span>
                </Link>

                <nav
                    className="hidden items-center gap-6 md:flex"
                    aria-label="Điều hướng chính"
                >
                    {NAV_LINKS.map((link) => (
                        <Link
                            key={link.to}
                            to={link.to}
                            className="text-sm font-medium text-foreground transition-colors hover:text-primary"
                        >
                            {link.label}
                        </Link>
                    ))}
                </nav>

                <form
                    onSubmit={handleSearchSubmit}
                    className="ml-auto hidden max-w-xs flex-1 items-center md:flex"
                >
                    <label htmlFor="header-search" className="sr-only">
                        Tìm bánh trung thu
                    </label>
                    <div className="relative w-full">
                        <MagnifyingGlass
                            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                            size={18}
                        />
                        <input
                            id="header-search"
                            type="search"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Tìm bánh trung thu..."
                            className="w-full rounded-full border border-border bg-background py-2 pl-9 pr-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/30"
                        />
                    </div>
                </form>

                <Link
                    to="/gio-hang"
                    aria-label={`Giỏ hàng, ${itemCount} sản phẩm`}
                    className="relative ml-auto flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-foreground transition-colors hover:bg-muted md:ml-0"
                >
                    <ShoppingCart size={22} />
                    {itemCount > 0 && (
                        <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1 text-xs font-bold text-accent-foreground">
                            {itemCount}
                        </span>
                    )}
                </Link>

                <button
                    type="button"
                    onClick={() => setMobileOpen((v) => !v)}
                    aria-label={mobileOpen ? "Đóng menu" : "Mở menu"}
                    aria-expanded={mobileOpen}
                    className="flex h-10 w-10 items-center justify-center rounded-full text-foreground hover:bg-muted md:hidden"
                >
                    {mobileOpen ? <X size={22} /> : <List size={22} />}
                </button>
            </div>

            {mobileOpen && (
                <div className="border-t border-border bg-surface px-4 pb-4 md:hidden">
                    <form
                        onSubmit={handleSearchSubmit}
                        className="relative py-3"
                    >
                        <MagnifyingGlass
                            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                            size={18}
                        />
                        <input
                            type="search"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Tìm bánh trung thu..."
                            className="w-full rounded-full border border-border bg-background py-2 pl-9 pr-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/30"
                        />
                    </form>
                    <nav
                        className="flex flex-col gap-1"
                        aria-label="Điều hướng di động"
                    >
                        {NAV_LINKS.map((link) => (
                            <Link
                                key={link.to}
                                to={link.to}
                                onClick={() => setMobileOpen(false)}
                                className="rounded-lg px-2 py-2.5 text-sm font-medium text-foreground hover:bg-muted"
                            >
                                {link.label}
                            </Link>
                        ))}
                        <div className="mt-2 border-t border-border pt-2 text-xs font-semibold uppercase text-muted-foreground">
                            Danh mục
                        </div>
                        {categories.map((cat) => (
                            <Link
                                key={cat._id}
                                to={`/san-pham?danh-muc=${cat._id}`}
                                onClick={() => setMobileOpen(false)}
                                className="rounded-lg px-2 py-2.5 text-sm text-foreground hover:bg-muted"
                            >
                                {cat.name}
                            </Link>
                        ))}
                    </nav>
                </div>
            )}
        </header>
    );
}
