import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { User, Mail, Lock } from 'lucide-react'
import toast from 'react-hot-toast'

export default function Register() {
  const { register, loginWithGoogle } = useAuth()
  const navigate = useNavigate()
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    if (password.length < 6) { toast.error('Senha deve ter no mínimo 6 caracteres'); return }
    setLoading(true)
    try {
      await register(email, password, nome)
      toast.success('Conta criada!')
      navigate('/')
    } catch (err) {
      toast.error(err.message.replace('Firebase: ', ''))
    } finally {
      setLoading(false)
    }
  }

  async function handleGoogle() {
    try {
      await loginWithGoogle()
      toast.success('Conta criada com Google!')
      navigate('/')
    } catch (err) {
      if (err.code !== 'auth/popup-closed-by-user') {
        toast.error(err.message.replace('Firebase: ', ''))
      }
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-dark-900 p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center text-white text-lg font-bold mx-auto mb-4">G</div>
          <h1 className="text-xl font-semibold text-light-100">Criar Conta</h1>
          <p className="text-sm text-dark-500 mt-1">Comece a controlar seus gastos</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-dark-800 rounded-2xl p-6 border border-dark-700/50 space-y-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-light-200">Nome</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-500" />
              <input type="text" value={nome} onChange={(e) => setNome(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 bg-dark-700/30 border border-dark-600 rounded-lg text-sm text-light-100 placeholder:text-dark-500 focus:outline-none focus:border-primary/40 focus:ring-1 focus:ring-primary/20 transition-all"
                placeholder="Seu nome" required />
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-light-200">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-500" />
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 bg-dark-700/30 border border-dark-600 rounded-lg text-sm text-light-100 placeholder:text-dark-500 focus:outline-none focus:border-primary/40 focus:ring-1 focus:ring-primary/20 transition-all"
                placeholder="seu@email.com" required />
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-light-200">Senha</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-500" />
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 bg-dark-700/30 border border-dark-600 rounded-lg text-sm text-light-100 placeholder:text-dark-500 focus:outline-none focus:border-primary/40 focus:ring-1 focus:ring-primary/20 transition-all"
                placeholder="Mínimo 6 caracteres" required />
            </div>
          </div>

          <button type="submit" disabled={loading}
            className="w-full py-2.5 bg-primary hover:bg-primary-hover text-white text-sm font-medium rounded-lg transition-all disabled:opacity-50">
            {loading ? 'Criando...' : 'Criar Conta'}
          </button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-dark-700/50" /></div>
            <div className="relative flex justify-center text-xs"><span className="px-2 bg-dark-800 text-dark-500">ou</span></div>
          </div>

          <button type="button" onClick={handleGoogle} disabled={loading}
            className="w-full py-2.5 bg-white hover:bg-gray-100 text-dark-900 text-sm font-medium rounded-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2">
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Criar com Google
          </button>

          <p className="text-center text-xs text-dark-500">
            Já tem conta?{' '}
            <Link to="/login" className="text-primary hover:text-primary-hover">Entrar</Link>
          </p>
        </form>
      </div>
    </div>
  )
}
