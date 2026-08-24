import { NavLink, Outlet } from 'react-router-dom'
import { ClipboardList, LayoutDashboard, PawPrint, Plus } from 'lucide-react'
import Navbar from '../components/layout/Navbar.jsx'

const links = [
  { to: '/owner/dashboard', label: 'Overview', icon: LayoutDashboard },
  { to: '/owner/pets', label: 'My Pets', icon: PawPrint },
  { to: '/owner/pets/create', label: 'Add Pet', icon: Plus },
  { to: '/owner/requests', label: 'Requests', icon: ClipboardList },
]

export default function OwnerLayout() {
  return (
    <div className="min-h-screen bg-cream">
      <Navbar />
      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-8 lg:grid-cols-[220px_1fr]">
        <aside className="h-fit rounded-3xl border border-line bg-card p-4">
          <p className="mb-3 px-2 text-sm font-semibold text-muted">Shelter / Owner</p>
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
