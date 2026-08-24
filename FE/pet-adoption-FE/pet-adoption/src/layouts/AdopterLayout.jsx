import { NavLink, Outlet } from 'react-router-dom'
import { HeartHandshake, LayoutDashboard, PawPrint, UserRound } from 'lucide-react'
import Navbar from '../components/layout/Navbar.jsx'

const links = [
  { to: '/adopter/dashboard', label: 'Overview', icon: LayoutDashboard },
  { to: '/adopter/requests', label: 'My Requests', icon: HeartHandshake },
  { to: '/adopter/profile', label: 'Profile', icon: UserRound },
]

export default function AdopterLayout() {
  return (
    <div className="min-h-screen bg-cream">
      <Navbar />
      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-8 lg:grid-cols-[220px_1fr]">
        <aside className="h-fit rounded-3xl border border-line bg-card p-4">
          <p className="mb-3 flex items-center gap-2 px-2 text-sm font-semibold text-muted">
            <PawPrint size={16} /> Adopter
          </p>
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `mb-1 flex items-center gap-2 rounded-2xl px-3 py-2 text-sm ${isActive ? 'bg-sand font-semibold' : 'text-muted hover:bg-sand/60'}`
              }
            >
              <link.icon size={16} /> {link.label}
            </NavLink>
          ))}
        </aside>
        <Outlet />
      </div>
    </div>
  )
}
