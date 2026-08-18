import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { MoonStars, SignOut } from "@phosphor-icons/react";
import { useAuth } from "../context/AuthContext";

const NAV_LINKS = [
    { to: "/nguoi-ban", label: "Đơn hàng", end: true },
    { to: "/nguoi-ban/san-pham", label: "Sản phẩm", end: false },
];

export default function SellerLayout() {
    const { logout } = useAuth();
    const navigate = useNavigate();

    async function handleLogout() {
        await logout();
        navigate("/nguoi-ban/dang-nhap");
    }

    return (
        <div className="min-h-screen bg-muted text-foreground">
            <header className="border-b border-border bg-foreground text-background">
                <div className="mx-auto flex h-14 max-w-6xl items-center gap-6 px-4">
                    <Link
                        to="/nguoi-ban"
                        className="flex items-center gap-2 font-heading text-base font-bold"
                    >
                        <MoonStars size={22} weight="fill" aria-hidden="true" />
                        Bách Hóa SV
                    </Link>
                    <nav
                        className="flex items-center gap-1"
                        aria-label="Điều hướng người bán"
                    >
                        {NAV_LINKS.map((link) => (
                            <NavLink
                                key={link.to}
                                to={link.to}
                                end={link.end}
                                className={({ isActive }) =>
                                    `rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                                        isActive
                                            ? "bg-white/15 text-background"
                                            : "text-background/70 hover:bg-white/10 hover:text-background"
                                    }`
                                }
                            >
                                {link.label}
                            </NavLink>
                        ))}
                    </nav>
                    <button
                        type="button"
                        onClick={handleLogout}
                        className="ml-auto flex cursor-pointer items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium hover:bg-white/10"
                    >
                        <SignOut size={18} /> Đăng xuất
                    </button>
                </div>
            </header>
            <main className="mx-auto max-w-6xl px-4 py-6">
                <Outlet />
            </main>
        </div>
    );
}
