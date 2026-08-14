import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { MoonStars } from '@phosphor-icons/react'
import { useAuth } from '../../context/AuthContext'

export default function SellerLoginPage() {
  const { isAuthenticated, login } = useAuth()
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  if (isAuthenticated) {
    return <Navigate to="/nguoi-ban" replace />
  }

  function handleSubmit(e) {
    e.preventDefault()
    const ok = login(username.trim(), password)
    if (ok) {
      navigate('/nguoi-ban')
    } else {
      setError('Sai tài khoản hoặc mật khẩu')
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted px-4">
      <div className="w-full max-w-sm rounded-xl border border-border bg-surface p-6">
        <div className="flex items-center justify-center gap-2 font-heading text-lg font-bold text-primary">
          <MoonStars size={24} weight="fill" aria-hidden="true" />
          Kênh người bán
        </div>
        <p className="mt-1 text-center text-sm text-muted-foreground">Đăng nhập để xem và xử lý đơn hàng</p>

        <form onSubmit={handleSubmit} noValidate className="mt-6 flex flex-col gap-4">
          <div>
            <label htmlFor="username" className="mb-1 block text-sm font-medium text-foreground">
              Tài khoản
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/30"
            />
          </div>
          <div>
            <label htmlFor="password" className="mb-1 block text-sm font-medium text-foreground">
              Mật khẩu
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              aria-invalid={Boolean(error)}
              aria-describedby={error ? 'login-error' : undefined}
              className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/30"
            />
          </div>
          {error && (
            <p id="login-error" className="text-sm text-destructive">
              {error}
            </p>
          )}
          <button
            type="submit"
            className="mt-1 cursor-pointer rounded-full bg-primary py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary-hover"
          >
            Đăng nhập
          </button>
        </form>

        <p className="mt-4 rounded-lg bg-muted p-3 text-center text-xs text-muted-foreground">
          Demo: tài khoản <span className="font-semibold text-foreground">seller</span> / mật khẩu{' '}
          <span className="font-semibold text-foreground">123456</span>
        </p>
      </div>
    </div>
  )
}
