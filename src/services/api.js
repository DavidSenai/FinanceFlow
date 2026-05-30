import { collection, addDoc, updateDoc, deleteDoc, doc, setDoc, query, where, orderBy, onSnapshot, serverTimestamp } from 'firebase/firestore'
import { db } from './firebase'

export async function createUserProfile(uid, data) {
  await setDoc(doc(db, 'users', uid), { uid, ...data, criadoEm: serverTimestamp() })
}

export function listenExpenses(userId, callback) {
  const q = query(collection(db, 'expenses'), where('userId', '==', userId), orderBy('data', 'desc'))
  return onSnapshot(
    q,
    (snap) => callback(snap.docs.map((d) => ({ id: d.id, ...d.data() }))),
    (error) => { console.error('listenExpenses error:', error); callback([]) }
  )
}

export async function createExpense(data) {
  return addDoc(collection(db, 'expenses'), { ...data, criadoEm: serverTimestamp() })
}

export async function updateExpense(id, data) {
  return updateDoc(doc(db, 'expenses', id), data)
}

export async function deleteExpense(id) {
  return deleteDoc(doc(db, 'expenses', id))
}
