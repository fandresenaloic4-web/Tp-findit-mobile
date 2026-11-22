import { describe, expect, it } from 'vitest'
import { filterItems } from './utils'
import type { FindItItem } from './types'

const items: FindItItem[] = [
  {
    id: '1',
    title: 'Clés bleues',
    description: 'Un trousseau',
    category: 'Clés',
    location: 'Antananarivo',
    status: 'found',
    ownerId: 'a',
    ownerName: 'A',
    createdAt: 1,
  },
  {
    id: '2',
    title: 'Téléphone',
    description: 'Noir',
    category: 'Électronique',
    location: 'Antsirabe',
    status: 'lost',
    ownerId: 'b',
    ownerName: 'B',
    createdAt: 2,
  },
]

describe('filterItems', () => {
  it('filters by status and text', () => {
    expect(filterItems(items, 'clés', 'found')).toHaveLength(1)
    expect(filterItems(items, '', 'lost')).toEqual([items[1]])
    expect(filterItems(items, 'Antsirabe', 'all')).toEqual([items[1]])
  })
})
