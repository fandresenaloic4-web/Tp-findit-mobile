import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
  where,
} from 'firebase/firestore'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import { auth, db, storage } from '../firebase'
import type { FindItItem, ItemStatus } from '../types'

export async function listItems(): Promise<FindItItem[]> {
  if (!db) return []
  const snapshot = await getDocs(query(collection(db, 'items'), orderBy('createdAt', 'desc')))
  return snapshot.docs.map((item) => ({ id: item.id, ...item.data() } as FindItItem))
}

export function subscribeItems(callback: (items: FindItItem[]) => void) {
  if (!db) return () => undefined
  return onSnapshot(query(collection(db, 'items'), orderBy('createdAt', 'desc')), (snapshot) => {
    callback(snapshot.docs.map((item) => ({ id: item.id, ...item.data() } as FindItItem)))
  })
}

export async function createItem(input: Omit<FindItItem, 'id' | 'ownerId' | 'ownerName' | 'createdAt'>) {
  if (!db) throw new Error('Firebase n’est pas configuré.')
  const user = auth?.currentUser
  if (!user) throw new Error('Vous devez être connecté.')
  const result = await addDoc(collection(db, 'items'), {
    ...input,
    ownerId: user.uid,
    ownerName: user.displayName || user.email || 'Utilisateur',
    createdAt: Date.now(),
  })
  return result.id
}

export async function updateItemStatus(id: string, status: ItemStatus) {
  if (!db) throw new Error('Firebase n’est pas configuré.')
  await updateDoc(doc(db, 'items', id), { status })
}

export async function listMyItems(ownerId: string): Promise<FindItItem[]> {
  if (!db) return []
  const snapshot = await getDocs(query(collection(db, 'items'), where('ownerId', '==', ownerId)))
  return snapshot.docs.map((item) => ({ id: item.id, ...item.data() } as FindItItem))
}

export async function getItem(id: string): Promise<FindItItem | null> {
  if (!db) return null
  const snapshot = await getDoc(doc(db, 'items', id))
  return snapshot.exists() ? ({ id: snapshot.id, ...snapshot.data() } as FindItItem) : null
}

export async function uploadPhoto(file: Blob, ownerId: string): Promise<string> {
  if (!storage) throw new Error('Firebase n’est pas configuré.')
  const photoRef = ref(storage, `items/${ownerId}/${Date.now()}.jpg`)
  await uploadBytes(photoRef, file)
  return getDownloadURL(photoRef)
}
