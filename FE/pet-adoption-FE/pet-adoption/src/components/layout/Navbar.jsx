import { Link, NavLink, useNavigate } from 'react-router-dom'
import { Heart, Menu, PawPrint, X } from 'lucide-react'
import { useState } from 'react'
import { useAuth } from '../../context/AuthContext.jsx'
import { dashboardPath } from '../../utils/format.js'

const linkClass = ({ isActive }) =>
  `rounded-full px-3 py-2 text-sm font-medium ${isActive ? 'bg-sand text-ink' : 'text-muted hover:text-ink'}`

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-cream/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link to="/" className="flex items-center gap-2 font-display text-xl">
          <span className="rounded-2xl bg-brand p-2 text-white">
            <PawPrint size={18} />
          </span>
          PawHome
        </Link>
        <nav className="hidden items-center gap-1 md:flex">
          <NavLink to="/" className={linkClass} end>
            Home
          </NavLink>
          <NavLink to="/pets" className={linkClass}>
            Find Pets
          </NavLink>
          {isAuthenticated ? (
            <NavLink to={dashboardPath(user.role)} className={linkClass}>
              Dashboard
            </NavLink>
          ) : null}
        </nav>
        <div className="hidden items-center gap-3 md:flex">
          {isAuthenticated ? (
            <>
              <span className="text-sm text-muted">{user.name}</span>
              <button
                type="button"
                onClick={() => {
                  logout()
                  navigate('/')
                }}
                className="rounded-full px-4 py-2 text-sm font-semibold text-muted hover:text-ink"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm font-semibold text-muted hover:text-ink">
                Login
              </Link>
              <Link to="/register" className="rounded-full bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand-dark">
                Register
              </Link>
            </>
          )}
        </div>
        <button type="button" className="md:hidden" onClick={() => setOpen((v) => !v)}>
          {open ? <X /> : <Menu />}
        </button>
      </div>
      {open ? (
        <div className="space-y-2 border-t border-line px-4 py-4 md:hidden">
          <NavLink to="/" onClick={() => setOpen(false)} className="block py-2">
            Home
          </NavLink>
          <NavLink to="/pets" onClick={() => setOpen(false)} className="block py-2">
            Find Pets
          </NavLink>
          {isAuthenticated ? (
            <NavLink to={dashboardPath(user.role)} onClick={() => setOpen(false)} className="block py-2">
              Dashboard
            </NavLink>
          ) : (
            <Link to="/login" onClick={() => setOpen(false)} className="block py-2">
              Login
            </Link>
          )}
        </div>
      ) : null}
      <div className="hidden" aria-hidden>
        <Heart />
      </div>
    </header>
  )
}
