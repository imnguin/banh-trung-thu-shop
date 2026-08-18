import { createContext, useContext, useEffect, useState } from "react";

const OrderContext = createContext(null);
const STORAGE_KEY = "ktt_orders";

export const ORDER_STATUSES = [
    "pending",
    "confirmed",
    "shipping",
    "completed",
    "cancelled",
];

export const STATUS_LABELS = {
    pending: "Chờ xác nhận",
    confirmed: "Đã xác nhận",
    shipping: "Đang giao",
    completed: "Hoàn thành",
    cancelled: "Đã hủy",
};

function loadOrders() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? JSON.parse(raw) : [];
    } catch {
        return [];
    }
}

function generateOrderId() {
    const now = new Date();
    const stamp = now.getTime().toString().slice(-6);
    return `KY${stamp}`;
}

export function OrderProvider({ children }) {
    const [orders, setOrders] = useState(loadOrders);

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
    }, [orders]);

    function createOrder({
        customer,
        items,
        subtotal,
        shippingFee,
        total,
        paymentMethod,
    }) {
        const nowIso = new Date().toISOString();
        const order = {
            id: generateOrderId(),
            createdAt: nowIso,
            customer,
            items,
            subtotal,
            shippingFee,
            total,
            paymentMethod,
            status: "pending",
            statusHistory: [{ status: "pending", at: nowIso }],
        };
        setOrders((prev) => [order, ...prev]);
        return order;
    }

    function updateOrderStatus(orderId, status) {
        setOrders((prev) =>
            prev.map((o) =>
                o.id === orderId
                    ? {
                          ...o,
                          status,
                          statusHistory: [
                              ...o.statusHistory,
                              { status, at: new Date().toISOString() },
                          ],
                      }
                    : o,
            ),
        );
    }

    function getOrderById(orderId) {
        return orders.find((o) => o.id === orderId);
    }

    function getOrdersByPhone(phone) {
        return orders.filter((o) => o.customer.phone === phone);
    }

    const value = {
        orders,
        createOrder,
        updateOrderStatus,
        getOrderById,
        getOrdersByPhone,
    };

    return (
        <OrderContext.Provider value={value}>{children}</OrderContext.Provider>
    );
}

export function useOrders() {
    const ctx = useContext(OrderContext);
    if (!ctx) throw new Error("useOrders must be used within OrderProvider");
    return ctx;
}
