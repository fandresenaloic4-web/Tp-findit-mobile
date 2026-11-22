export type ItemStatus = 'lost' | 'found' | 'resolved'

export interface FindItItem {
  id: string
  title: string
  description: string
  category: string
  location: string
  status: ItemStatus
  photoUrl?: string
  ownerId: string
  ownerName: string
  createdAt: number
}
