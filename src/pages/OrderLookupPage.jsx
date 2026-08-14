import { useState } from 'react'
import { MagnifyingGlass } from '@phosphor-icons/react'
import StatusBadge from '../components/StatusBadge'
import { useOrders } from '../context/OrderContext'
import { formatCurrency, formatDateTime } from '../lib/format'

export default function OrderLookupPage() {
  const { getOrdersByPhone } = useOrders()
  const [phone, setPhone] = useState('')
  const [results, setResults] = useState(null)
  const [error, setError] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    if (!/^0\d{9,10}$/.test(phone.trim())) {
      setError('Số điện thoại không hợp lệ')
      setResults(null)
      return
    }
    setError('')
    const found = getOrdersByPhone(phone.trim())
    setResults(found)
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="font-heading text-2xl font-bold text-foreground">Tra cứu đơn hàng</h1>
      <p className="mt-1 text-sm text-muted-foreground">Nhập số điện thoại đã dùng khi đặt hàng để xem trạng thái đơn.</p>

      <form onSubmit={handleSubmit} className="mt-6 flex gap-2">
        <div className="flex-1">
          <label htmlFor="lookup-phone" className="sr-only">
            Số điện thoại
          </label>
          <input
            id="lookup-phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Nhập số điện thoại, VD: 0901234567"
            aria-invalid={Boolean(error)}
            aria-describedby={error ? 'lookup-phone-error' : undefined}
            className="w-full rounded-lg border border-border bg-surface px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/30"
          />
        </div>
        <button
          type="submit"
          className="flex cursor-pointer items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary-hover"
        >
          <MagnifyingGlass size={18} /> Tra cứu
        </button>
      </form>
      {error && (
        <p id="lookup-phone-error" className="mt-2 text-sm text-destructive">
          {error}
        </p>
      )}

      {results !== null && (
        <div className="mt-8">
          {results.length === 0 ? (
            <p className="text-center text-muted-foreground">Không tìm thấy đơn hàng nào với số điện thoại này.</p>
          ) : (
            <ul className="flex flex-col gap-4">
              {results.map((order) => (
                <li key={order.id} className="rounded-xl border border-border bg-surface p-5">
                  <div className="flex items-center justify-between">
                    <span className="font-heading font-bold text-primary">{order.id}</span>
                    <StatusBadge status={order.status} />
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">{formatDateTime(order.createdAt)}</p>
                  <ul className="mt-3 flex flex-col gap-1 text-sm">
                    {order.items.map((item) => (
                      <li key={item.key} className="flex justify-between">
                        <span className="text-foreground">
                          {item.name} x{item.qty}
                        </span>
                        <span className="text-foreground">{formatCurrency(item.unitPrice * item.qty)}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-3 flex justify-between border-t border-border pt-3 text-sm font-semibold">
                    <span className="text-foreground">Tổng cộng</span>
                    <span className="text-primary">{formatCurrency(order.total)}</span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}
