import { NavLink } from 'react-router-dom'
import { LayoutDashboard, Wallet, LogOut, Menu, X } from 'lucide-react'
import { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'

const links = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/gastos', icon: Wallet, label: 'Gastos' },
]

export default function Sidebar() {
  const [open, setOpen] = useState(false)
  const { logout } = useAuth()

  return (
    <>
      <button onClick={() => setOpen(true)}
        className="fixed top-4 left-4 z-50 lg:hidden p-2 bg-dark-800 rounded-xl border border-dark-700/50 shadow-card">
        <Menu className="w-5 h-5 text-light-100" />
      </button>

      {open && <div className="fixed inset-0 z-40 bg-black/70 lg:hidden" onClick={() => setOpen(false)} />}

      <aside className={`fixed lg:sticky top-0 left-0 z-50 h-screen w-60 bg-dark-900 border-r border-dark-700/50 flex flex-col transition-transform duration-300 ${open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="flex items-center gap-3 px-5 h-16 border-b border-dark-700/50">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white text-sm font-bold shrink-0">
            G
          </div>
          <span className="text-base font-semibold text-light-100">Gastos</span>
          <button onClick={() => setOpen(false)} className="lg:hidden ml-auto p-1 rounded-lg hover:bg-dark-700/50">
            <X className="w-4 h-4 text-dark-500" />
          </button>
        </div>

        <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
          {links.map(({ to, icon: Icon, label }) => (
            <NavLink key={to} to={to} end={to === '/'} onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-primary/10 text-primary'
                    : 'text-dark-500 hover:text-light-100 hover:bg-dark-800'
                }`}>
              <Icon className="w-4 h-4" />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="p-3 border-t border-dark-700/50">
          <button onClick={logout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-dark-500 hover:text-danger hover:bg-dark-800 transition-all w-full">
            <LogOut className="w-4 h-4" />
            Sair
          </button>
        </div>
      </aside>
    </>
  )
}
