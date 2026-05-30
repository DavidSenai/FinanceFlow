import { createContext, useContext, useEffect, useState } from 'react'
import {
  onAuthStateChanged, signInWithEmailAndPassword,
  createUserWithEmailAndPassword, signOut, sendPasswordResetEmail,
  signInWithPopup, GoogleAuthProvider,
} from 'firebase/auth'
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore'
import { auth, db } from '../services/firebase'
import { createUserProfile } from '../services/api'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const providers = user.providerData
        const isGoogle = providers?.some((p) => p.providerId === 'google.com')
        if (isGoogle) {
          try {
            const ref = doc(db, 'users', user.uid)
            const snap = await getDoc(ref)
            if (!snap.exists()) {
              await createUserProfile(user.uid, {
                nome: user.displayName || 'Usuário',
                email: user.email,
              })
            }
          } catch {}
        }
      }
      setUser(user)
      setLoading(false)
    })
    return unsub
  }, [])

  async function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password)
  }

  async function register(email, password, nome) {
    const cred = await createUserWithEmailAndPassword(auth, email, password)
    await createUserProfile(cred.user.uid, { nome, email })
    return cred
  }

  async function loginWithGoogle() {
    const provider = new GoogleAuthProvider()
    return signInWithPopup(auth, provider)
  }

  async function logout() {
    return signOut(auth)
  }

  async function resetPassword(email) {
    return sendPasswordResetEmail(auth, email)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, loginWithGoogle, logout, resetPassword }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
