import { NavLink, Outlet } from 'react-router-dom'
import { ClipboardList, LayoutDashboard, PawPrint, Users } from 'lucide-react'
import Navbar from '../components/layout/Navbar.jsx'

const links = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/users', label: 'Users', icon: Users },
  { to: '/admin/pets', label: 'Pets', icon: PawPrint },
  { to: '/admin/requests', label: 'Requests', icon: ClipboardList },
]

export default function AdminLayout() {
  return (
    <div className="min-h-screen bg-cream">
      <Navbar />
      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-8 lg:grid-cols-[220px_1fr]">
        <aside className="h-fit rounded-3xl bg-ink p-4 text-white">
          <p className="mb-3 px-2 text-sm font-semibold text-white/70">Admin</p>
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `mb-1 flex items-center gap-2 rounded-2xl px-3 py-2 text-sm ${isActive ? 'bg-white/15 font-semibold' : 'text-white/70 hover:bg-white/10'}`
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
