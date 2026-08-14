import { useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { CaretLeft, Check } from '@phosphor-icons/react'
import StatusBadge from '../../components/StatusBadge'
import { ORDER_STATUSES, STATUS_LABELS, useOrders } from '../../context/OrderContext'
import { formatCurrency, formatDateTime } from '../../lib/format'

export default function SellerOrderDetailPage() {
  const { orderId } = useParams()
  const { getOrderById, updateOrderStatus } = useOrders()
  const order = getOrderById(orderId)
  const [saved, setSaved] = useState(false)

  if (!order) {
    return <Navigate to="/nguoi-ban" replace />
  }

  function handleStatusChange(e) {
    updateOrderStatus(order.id, e.target.value)
    setSaved(true)
    setTimeout(() => setSaved(false), 1800)
  }

  return (
    <div>
      <Link to="/nguoi-ban" className="inline-flex items-center gap-1 text-sm text-primary hover:underline">
        <CaretLeft size={14} /> Danh sách đơn hàng
      </Link>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-heading text-2xl font-bold text-foreground">Đơn hàng {order.id}</h1>
        <StatusBadge status={order.status} />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="rounded-xl border border-border bg-surface p-5 lg:col-span-2">
          <h2 className="font-heading text-lg font-bold text-foreground">Sản phẩm</h2>
          <ul className="mt-3 flex flex-col gap-2">
            {order.items.map((item) => (
              <li key={item.key} className="flex justify-between text-sm">
                <span className="text-foreground">
                  {item.name} ({item.variantLabel}) <span className="text-muted-foreground">x{item.qty}</span>
                </span>
                <span className="font-medium text-foreground">{formatCurrency(item.unitPrice * item.qty)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-4 space-y-1 border-t border-border pt-4 text-sm">
            <div className="flex justify-between text-muted-foreground">
              <span>Tạm tính</span>
              <span>{formatCurrency(order.subtotal)}</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>Phí vận chuyển</span>
              <span>{order.shippingFee === 0 ? 'Miễn phí' : formatCurrency(order.shippingFee)}</span>
            </div>
            <div className="flex justify-between border-t border-border pt-2 text-base font-bold text-foreground">
              <span>Tổng cộng</span>
              <span className="text-primary">{formatCurrency(order.total)}</span>
            </div>
          </div>

          <h2 className="mt-6 font-heading text-lg font-bold text-foreground">Lịch sử trạng thái</h2>
          <ul className="mt-3 flex flex-col gap-2 text-sm">
            {order.statusHistory.map((h, idx) => (
              <li key={idx} className="flex items-center justify-between">
                <span className="text-foreground">{STATUS_LABELS[h.status]}</span>
                <span className="text-muted-foreground">{formatDateTime(h.at)}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col gap-6">
          <div className="rounded-xl border border-border bg-surface p-5">
            <h2 className="font-heading text-lg font-bold text-foreground">Thông tin khách hàng</h2>
            <dl className="mt-3 space-y-2 text-sm">
              <div>
                <dt className="text-muted-foreground">Họ tên</dt>
                <dd className="text-foreground">{order.customer.name}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Số điện thoại</dt>
                <dd className="text-foreground">{order.customer.phone}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Địa chỉ giao hàng</dt>
                <dd className="text-foreground">{order.customer.address}</dd>
              </div>
              {order.customer.note && (
                <div>
                  <dt className="text-muted-foreground">Ghi chú</dt>
                  <dd className="text-foreground">{order.customer.note}</dd>
                </div>
              )}
              <div>
                <dt className="text-muted-foreground">Thanh toán</dt>
                <dd className="text-foreground">{order.paymentMethod === 'cod' ? 'COD - Thanh toán khi nhận hàng' : 'Chuyển khoản ngân hàng'}</dd>
              </div>
            </dl>
          </div>

          <div className="rounded-xl border border-border bg-surface p-5">
            <label htmlFor="status-select" className="mb-2 block text-sm font-semibold text-foreground">
              Cập nhật trạng thái
            </label>
            <select
              id="status-select"
              value={order.status}
              onChange={handleStatusChange}
              className="w-full cursor-pointer rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/30"
            >
              {ORDER_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {STATUS_LABELS[s]}
                </option>
              ))}
            </select>
            {saved && (
              <p className="mt-2 flex items-center gap-1.5 text-sm text-success">
                <Check size={16} /> Đã cập nhật trạng thái
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
