import { useEffect, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { CheckCircle } from "@phosphor-icons/react";
import { getOrderByCode } from "../services/orderService";
import { formatCurrency, formatDateTime } from "../lib/format";

export default function OrderSuccessPage() {
    const { orderId } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let active = true;
        getOrderByCode(orderId).then((res) => {
            if (!active) return;
            setOrder(res.isError ? null : res.data);
            setLoading(false);
        });
        return () => {
            active = false;
        };
    }, [orderId]);

    if (loading) {
        return (
            <div className="mx-auto max-w-2xl px-4 py-16 text-center text-muted-foreground">
                Đang tải đơn hàng...
            </div>
        );
    }

    if (!order) {
        return <Navigate to="/" replace />;
    }

    return (
        <div className="mx-auto max-w-2xl px-4 py-12 text-center">
            <CheckCircle
                size={64}
                weight="fill"
                className="mx-auto text-success"
                aria-hidden="true"
            />
            <h1 className="mt-4 font-heading text-2xl font-bold text-foreground">
                Đặt hàng thành công!
            </h1>
            <p className="mt-2 text-muted-foreground">
                Cảm ơn{" "}
                <span className="font-medium text-foreground">
                    {order.customer.name}
                </span>
                , đơn hàng của bạn đã được ghi nhận và đang chờ xác nhận.
            </p>

            <div className="mt-6 rounded-xl border border-border bg-surface p-5 text-left">
                <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                        Mã đơn hàng
                    </span>
                    <span className="font-heading text-lg font-bold text-primary">
                        {order.orderCode}
                    </span>
                </div>
                <div className="mt-1 flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Thời gian đặt</span>
                    <span className="text-foreground">
                        {formatDateTime(order.createdAt)}
                    </span>
                </div>

                <ul className="mt-4 flex flex-col gap-2 border-t border-border pt-4">
                    {order.items.map((item) => (
                        <li
                            key={item.key}
                            className="flex justify-between text-sm"
                        >
                            <span className="text-foreground">
                                {item.name} ({item.variantLabel}){" "}
                                <span className="text-muted-foreground">
                                    x{item.qty}
                                </span>
                            </span>
                            <span className="font-medium text-foreground">
                                {formatCurrency(item.unitPrice * item.qty)}
                            </span>
                        </li>
                    ))}
                </ul>

                <div className="mt-4 flex justify-between border-t border-border pt-4 text-base font-bold">
                    <span className="text-foreground">Tổng cộng</span>
                    <span className="text-primary">
                        {formatCurrency(order.total)}
                    </span>
                </div>

                <div className="mt-4 border-t border-border pt-4 text-sm text-muted-foreground">
                    Giao đến:{" "}
                    <span className="text-foreground">
                        {order.customer.address}
                    </span>
                    <br />
                    SĐT:{" "}
                    <span className="text-foreground">
                        {order.customer.phone}
                    </span>
                </div>
            </div>

            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                <Link
                    to="/tra-cuu-don-hang"
                    className="rounded-full border border-primary px-6 py-3 text-sm font-semibold text-primary"
                >
                    Tra cứu đơn hàng
                </Link>
                <Link
                    to="/san-pham"
                    className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary-hover"
                >
                    Tiếp tục mua sắm
                </Link>
            </div>
        </div>
    );
}
