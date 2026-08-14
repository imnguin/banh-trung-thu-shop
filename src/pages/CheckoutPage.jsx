import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useOrders } from '../context/OrderContext'
import { formatCurrency } from '../lib/format'

const FREE_SHIP_THRESHOLD = 500000
const SHIPPING_FEE = 30000

const PAYMENT_METHODS = [
  { id: 'cod', label: 'Thanh toán khi nhận hàng (COD)' },
  { id: 'bank', label: 'Chuyển khoản ngân hàng' },
]

function validateField(name, value) {
  if (name === 'name') return value.trim() ? '' : 'Vui lòng nhập họ tên'
  if (name === 'phone') return /^0\d{9,10}$/.test(value.trim()) ? '' : 'Số điện thoại không hợp lệ'
  if (name === 'address') return value.trim() ? '' : 'Vui lòng nhập địa chỉ giao hàng'
  return ''
}

export default function CheckoutPage() {
  const { items, subtotal, clearCart } = useCart()
  const { createOrder } = useOrders()
  const navigate = useNavigate()

  const [form, setForm] = useState({ name: '', phone: '', address: '', note: '' })
  const [errors, setErrors] = useState({})
  const [payment, setPayment] = useState('cod')
  const [submitting, setSubmitting] = useState(false)

  const shippingFee = subtotal >= FREE_SHIP_THRESHOLD ? 0 : SHIPPING_FEE
  const total = subtotal + shippingFee

  if (items.length === 0) {
    return <Navigate to="/gio-hang" replace />
  }

  function handleChange(e) {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  function handleBlur(e) {
    const { name, value } = e.target
    setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    const nextErrors = {
      name: validateField('name', form.name),
      phone: validateField('phone', form.phone),
      address: validateField('address', form.address),
    }
    setErrors(nextErrors)
    if (Object.values(nextErrors).some(Boolean)) return

    setSubmitting(true)
    setTimeout(() => {
      const order = createOrder({
        customer: { name: form.name.trim(), phone: form.phone.trim(), address: form.address.trim(), note: form.note.trim() },
        items,
        subtotal,
        shippingFee,
        total,
        paymentMethod: payment,
      })
      clearCart()
      navigate(`/dat-hang-thanh-cong/${order.id}`)
    }, 600)
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="font-heading text-2xl font-bold text-foreground">Thanh toán</h1>

      <div className="mt-6 grid gap-8 lg:grid-cols-3">
        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5 lg:col-span-2">
          <div className="rounded-xl border border-border bg-surface p-5">
            <h2 className="font-heading text-lg font-bold text-foreground">Thông tin nhận hàng</h2>

            <div className="mt-4 flex flex-col gap-4">
              <div>
                <label htmlFor="name" className="mb-1 block text-sm font-medium text-foreground">
                  Họ và tên
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={form.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  aria-invalid={Boolean(errors.name)}
                  aria-describedby={errors.name ? 'name-error' : undefined}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/30"
                />
                {errors.name && (
                  <p id="name-error" className="mt-1 text-xs text-destructive">
                    {errors.name}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="phone" className="mb-1 block text-sm font-medium text-foreground">
                  Số điện thoại
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={form.phone}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  aria-invalid={Boolean(errors.phone)}
                  aria-describedby={errors.phone ? 'phone-error' : undefined}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/30"
                />
                {errors.phone && (
                  <p id="phone-error" className="mt-1 text-xs text-destructive">
                    {errors.phone}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="address" className="mb-1 block text-sm font-medium text-foreground">
                  Địa chỉ giao hàng
                </label>
                <input
                  id="address"
                  name="address"
                  type="text"
                  value={form.address}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  aria-invalid={Boolean(errors.address)}
                  aria-describedby={errors.address ? 'address-error' : undefined}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/30"
                />
                {errors.address && (
                  <p id="address-error" className="mt-1 text-xs text-destructive">
                    {errors.address}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="note" className="mb-1 block text-sm font-medium text-foreground">
                  Ghi chú (tùy chọn)
                </label>
                <textarea
                  id="note"
                  name="note"
                  rows={3}
                  value={form.note}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/30"
                />
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-surface p-5">
            <h2 className="font-heading text-lg font-bold text-foreground">Phương thức thanh toán</h2>
            <div className="mt-3 flex flex-col gap-2">
              {PAYMENT_METHODS.map((m) => (
                <label
                  key={m.id}
                  className={`flex cursor-pointer items-center gap-3 rounded-lg border px-4 py-3 text-sm ${
                    payment === m.id ? 'border-primary bg-primary/5' : 'border-border'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value={m.id}
                    checked={payment === m.id}
                    onChange={() => setPayment(m.id)}
                    className="h-4 w-4 accent-[var(--color-primary)]"
                  />
                  {m.label}
                </label>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full cursor-pointer rounded-full bg-accent py-3.5 text-sm font-semibold text-accent-foreground transition-colors hover:bg-accent-hover disabled:cursor-wait disabled:opacity-70"
          >
            {submitting ? 'Đang xử lý đơn hàng...' : `Đặt hàng - ${formatCurrency(total)}`}
          </button>
        </form>

        <div className="h-fit rounded-xl border border-border bg-surface p-5">
          <h2 className="font-heading text-lg font-bold text-foreground">Đơn hàng ({items.length})</h2>
          <ul className="mt-4 flex flex-col gap-3">
            {items.map((item) => (
              <li key={item.key} className="flex justify-between text-sm">
                <span className="text-foreground">
                  {item.name} <span className="text-muted-foreground">x{item.qty}</span>
                </span>
                <span className="font-medium text-foreground">{formatCurrency(item.unitPrice * item.qty)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-4 space-y-2 border-t border-border pt-4 text-sm">
            <div className="flex justify-between text-muted-foreground">
              <span>Tạm tính</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>Phí vận chuyển</span>
              <span>{shippingFee === 0 ? 'Miễn phí' : formatCurrency(shippingFee)}</span>
            </div>
            <div className="flex justify-between border-t border-border pt-2 text-base font-bold text-foreground">
              <span>Tổng cộng</span>
              <span className="text-primary">{formatCurrency(total)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
