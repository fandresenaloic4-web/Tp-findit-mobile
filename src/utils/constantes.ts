import type { StatutType } from '@/models/statut.model';

/** Noms des collections Firestore, centralisés comme dans les exemples Firebase. */
export const COLLECTIONS = {
  publications: 'publications',
  categories: 'categories',
  villes: 'villes',
  utilisateurs: 'utilisateurs',
} as const;

export const SOUS_COLLECTIONS = {
  mouvementsStatut: 'mouvementsStatut',
} as const;

export const COULEURS_STATUT: Record<StatutType, string> = {
  perdu: 'danger',
  retrouve: 'success',
  recupere: 'medium',
};

export const LIMITES = {
  publicationsRecentes: 20,
  listePublications: 50,
  recherche: 100,
} as const;

export const DUREE_TOAST = {
  erreur: 4000,
  succes: 2500,
} as const;
