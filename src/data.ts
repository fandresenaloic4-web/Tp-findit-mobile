import type { FindItItem } from './types'

export const demoItems: FindItItem[] = [
  {
    id: 'demo-1',
    title: 'Clés avec porte-clés bleu',
    description: 'Jeu de clés trouvé près de l’arrêt de bus.',
    category: 'Clés',
    location: 'Antananarivo',
    status: 'found',
    ownerId: 'demo',
    ownerName: 'Nomena',
    createdAt: Date.now() - 3600000,
  },
  {
    id: 'demo-2',
    title: 'Téléphone perdu',
    description: 'Smartphone noir avec coque verte.',
    category: 'Électronique',
    location: 'Antsirabe',
    status: 'lost',
    ownerId: 'demo',
    ownerName: 'Hery',
    createdAt: Date.now() - 86400000,
  },
]
