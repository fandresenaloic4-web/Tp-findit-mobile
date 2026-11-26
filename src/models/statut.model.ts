export type StatutType = 'perdu' | 'retrouve' | 'recupere';

const CODES_STATUT: readonly StatutType[] = ['perdu', 'retrouve', 'recupere'];

/** Garde de type pour les valeurs de statut lues dans Firestore ou dans un événement Ionic. */
export function estStatutType(valeur: string): valeur is StatutType {
  return CODES_STATUT.some((code) => code === valeur);
}

export interface Statut {
  code: StatutType;
  libelle: string;
}

export const STATUTS: Statut[] = [
  { code: 'perdu', libelle: 'Perdu' },
  { code: 'retrouve', libelle: 'Retrouvé' },
  { code: 'recupere', libelle: 'Récupéré' },
];

/** Document de publications/{id}/mouvementsStatut/{mouvementId} */
export interface MouvementStatut {
  id: string;
  statut: StatutType;
  dateChangement: Date;
}
