import type { FindItItem, ItemStatus } from './types'

export function filterItems(items: FindItItem[], search: string, filter: 'all' | ItemStatus) {
  const term = search.trim().toLowerCase()
  return items.filter((item) => {
    const matchesFilter = filter === 'all' || item.status === filter
    const matchesText =
      !term ||
      `${item.title} ${item.description} ${item.category} ${item.location}`
        .toLowerCase()
        .includes(term)
    return matchesFilter && matchesText
  })
}
