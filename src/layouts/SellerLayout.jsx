import { Link, Outlet, useNavigate } from 'react-router-dom'
import { MoonStars, SignOut } from '@phosphor-icons/react'
import { useAuth } from '../context/AuthContext'

export default function SellerLayout() {
  const { logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/nguoi-ban/dang-nhap')
  }

  return (
    <div className="min-h-screen bg-muted text-foreground">
      <header className="border-b border-border bg-foreground text-background">
        <div className="mx-auto flex h-14 max-w-6xl items-center gap-4 px-4">
          <Link to="/nguoi-ban" className="flex items-center gap-2 font-heading text-base font-bold">
            <MoonStars size={22} weight="fill" aria-hidden="true" />
            Kim Yến - Kênh người bán
          </Link>
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
  )
}
