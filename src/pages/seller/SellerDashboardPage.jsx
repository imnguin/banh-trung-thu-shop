import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Package, ShoppingBag, Wallet } from '@phosphor-icons/react'
import StatusBadge from '../../components/StatusBadge'
import { ORDER_STATUSES, STATUS_LABELS, useOrders } from '../../context/OrderContext'
import { formatCurrency, formatDateTime } from '../../lib/format'

export default function SellerDashboardPage() {
  const { orders } = useOrders()
  const [statusFilter, setStatusFilter] = useState('all')

  const stats = useMemo(() => {
    const pending = orders.filter((o) => o.status === 'pending').length
    const revenue = orders.filter((o) => o.status === 'completed').reduce((sum, o) => sum + o.total, 0)
    return { total: orders.length, pending, revenue }
  }, [orders])

  const filtered = statusFilter === 'all' ? orders : orders.filter((o) => o.status === statusFilter)

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold text-foreground">Quản lý đơn hàng</h1>

      <div className="mt-4 grid gap-4 sm:grid-cols-3">
        <div className="flex items-center gap-3 rounded-xl border border-border bg-surface p-4">
          <ShoppingBag size={28} className="text-primary" aria-hidden="true" />
          <div>
            <div className="text-xl font-bold text-foreground">{stats.total}</div>
            <div className="text-sm text-muted-foreground">Tổng số đơn</div>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-xl border border-border bg-surface p-4">
          <Package size={28} className="text-amber-600" aria-hidden="true" />
          <div>
            <div className="text-xl font-bold text-foreground">{stats.pending}</div>
            <div className="text-sm text-muted-foreground">Chờ xác nhận</div>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-xl border border-border bg-surface p-4">
          <Wallet size={28} className="text-success" aria-hidden="true" />
          <div>
            <div className="text-xl font-bold text-foreground">{formatCurrency(stats.revenue)}</div>
            <div className="text-sm text-muted-foreground">Doanh thu (đã hoàn thành)</div>
          </div>
        </div>
      </div>

      <div className="mt-6 flex gap-2 overflow-x-auto pb-1">
        <button
          type="button"
          onClick={() => setStatusFilter('all')}
          className={`shrink-0 cursor-pointer rounded-full border px-4 py-2 text-sm font-medium ${
            statusFilter === 'all' ? 'border-primary bg-primary text-primary-foreground' : 'border-border text-foreground'
          }`}
        >
          Tất cả
        </button>
        {ORDER_STATUSES.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setStatusFilter(s)}
            className={`shrink-0 cursor-pointer rounded-full border px-4 py-2 text-sm font-medium ${
              statusFilter === s ? 'border-primary bg-primary text-primary-foreground' : 'border-border text-foreground'
            }`}
          >
            {STATUS_LABELS[s]}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="mt-10 text-center text-muted-foreground">Chưa có đơn hàng nào.</div>
      ) : (
        <div className="mt-4 overflow-x-auto rounded-xl border border-border bg-surface">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="border-b border-border text-xs uppercase text-muted-foreground">
              <tr>
                <th className="px-4 py-3">Mã đơn</th>
                <th className="px-4 py-3">Khách hàng</th>
                <th className="px-4 py-3">Thời gian</th>
                <th className="px-4 py-3">Tổng tiền</th>
                <th className="px-4 py-3">Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((order) => (
                <tr key={order.id} className="border-b border-border last:border-0 hover:bg-muted">
                  <td className="px-4 py-3">
                    <Link to={`/nguoi-ban/don-hang/${order.id}`} className="font-semibold text-primary hover:underline">
                      {order.id}
                    </Link>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-foreground">{order.customer.name}</div>
                    <div className="text-xs text-muted-foreground">{order.customer.phone}</div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{formatDateTime(order.createdAt)}</td>
                  <td className="px-4 py-3 font-medium text-foreground">{formatCurrency(order.total)}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={order.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
