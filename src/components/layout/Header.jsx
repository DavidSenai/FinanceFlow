import { useAuth } from '../../contexts/AuthContext'
import { useTheme } from '../../contexts/ThemeContext'
import { LogOut, Sun, Moon, User } from 'lucide-react'

export default function Header() {
  const { user, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()

  return (
    <header className="flex items-center justify-end lg:justify-between px-6 h-16 bg-dark-900 border-b border-dark-700/50">
      <div className="hidden lg:block">
        <h1 className="text-base font-medium text-light-200">Controle de Gastos</h1>
      </div>

      <div className="flex items-center gap-2">
        <button onClick={toggleTheme}
          className="p-2 rounded-lg hover:bg-dark-800 transition-all text-dark-500 hover:text-light-200">
          {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-dark-800/50">
          <User className="w-3.5 h-3.5 text-dark-500" />
          <span className="text-sm text-light-200">{user?.email?.split('@')[0]}</span>
        </div>

        <button onClick={logout}
          className="p-2 rounded-lg hover:bg-dark-800 transition-all text-dark-500 hover:text-danger">
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </header>
  )
}
