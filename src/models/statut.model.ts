export type StatutType = 'perdu' | 'retrouve' | 'recupere';

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
