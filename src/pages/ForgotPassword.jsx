import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Mail, ArrowLeft } from 'lucide-react'
import toast from 'react-hot-toast'

export default function ForgotPassword() {
  const { resetPassword } = useAuth()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    try {
      await resetPassword(email)
      setSent(true)
      toast.success('Email de recuperação enviado!')
    } catch (err) {
      toast.error(err.message.replace('Firebase: ', ''))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-dark-900 p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center text-white text-lg font-bold mx-auto mb-4">G</div>
          <h1 className="text-xl font-semibold text-light-100">Recuperar Senha</h1>
        </div>

        <form onSubmit={handleSubmit} className="bg-dark-800 rounded-2xl p-6 border border-dark-700/50 space-y-4">
          {sent ? (
            <div className="text-center space-y-3">
              <p className="text-sm text-light-200">Email de recuperação enviado para <strong>{email}</strong></p>
              <p className="text-xs text-dark-500">Verifique sua caixa de entrada.</p>
            </div>
          ) : (
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-light-200">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-500" />
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-dark-700/30 border border-dark-600 rounded-lg text-sm text-light-100 placeholder:text-dark-500 focus:outline-none focus:border-primary/40 focus:ring-1 focus:ring-primary/20 transition-all"
                  placeholder="seu@email.com" required />
              </div>
            </div>
          )}

          {!sent && (
            <button type="submit" disabled={loading}
              className="w-full py-2.5 bg-primary hover:bg-primary-hover text-white text-sm font-medium rounded-lg transition-all disabled:opacity-50">
              {loading ? 'Enviando...' : 'Enviar'}
            </button>
          )}

          <Link to="/login" className="flex items-center justify-center gap-1.5 text-xs text-dark-500 hover:text-primary transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" />
            Voltar para o login
          </Link>
        </form>
      </div>
    </div>
  )
}
