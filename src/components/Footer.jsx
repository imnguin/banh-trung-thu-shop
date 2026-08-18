import { Link } from "react-router-dom";
import { MapPin, Phone, Storefront } from "@phosphor-icons/react";
import { CATEGORIES } from "../data/categories";

export default function Footer() {
    return (
        <footer className="mt-16 border-t border-border bg-muted">
            <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:grid-cols-2 md:grid-cols-4">
                <div>
                    <h3 className="font-heading text-lg font-bold text-primary">
                        Bách Hóa SV
                    </h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                        Bánh trung thu truyền thống &amp; cao cấp, gia truyền
                        hơn 20 năm. Đặt hàng online, giao tận nơi.
                    </p>
                </div>
                <div>
                    <h4 className="mb-3 text-sm font-semibold text-foreground">
                        Danh mục
                    </h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                        {CATEGORIES.map((cat) => (
                            <li key={cat.id}>
                                <Link
                                    to={`/san-pham?danh-muc=${cat.id}`}
                                    className="hover:text-primary"
                                >
                                    {cat.name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
                <div>
                    <h4 className="mb-3 text-sm font-semibold text-foreground">
                        Hỗ trợ khách hàng
                    </h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                        <li>
                            <Link
                                to="/tra-cuu-don-hang"
                                className="hover:text-primary"
                            >
                                Tra cứu đơn hàng
                            </Link>
                        </li>
                        <li className="flex items-center gap-2">
                            <Phone size={16} aria-hidden="true" /> 0332093438
                        </li>
                        <li className="flex items-center gap-2">
                            <MapPin size={16} aria-hidden="true" /> Tôn Thất Tùng, phường Đông Hòa, TP Dĩ An
                        </li>
                    </ul>
                </div>
                <div>
                    <h4 className="mb-3 text-sm font-semibold text-foreground">
                        Dành cho người bán
                    </h4>
                    <Link
                        to="/nguoi-ban/dang-nhap"
                        className="inline-flex items-center gap-2 rounded-lg border border-border bg-surface px-3 py-2 text-sm font-medium text-foreground hover:border-primary hover:text-primary"
                    >
                        <Storefront size={18} aria-hidden="true" />
                        Kênh người bán
                    </Link>
                </div>
            </div>
            <div className="border-t border-border py-4 text-center text-xs text-muted-foreground">
                © 2026 Bách Hóa SV.
            </div>
        </footer>
    );
}
