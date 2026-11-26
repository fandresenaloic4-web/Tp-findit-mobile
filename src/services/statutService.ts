import {
    collection, doc, getDocs, orderBy, query, serverTimestamp, writeBatch,
} from 'firebase/firestore';
import { db } from '@/firebase/config/config';
import { STATUTS, type MouvementStatut, type Statut, type StatutType } from '@/models/statut.model';
import { toDate } from '@/utils/firestore';

export function getStatuts(): Statut[] {
    return STATUTS;
}

export function libelleStatut(code: StatutType): string {
    return STATUTS.find((s) => s.code === code)?.libelle ?? code;
}

/**
 * Change le statut d'une publication ET enregistre le mouvement,
 * dans un seul batch : les deux écritures réussissent ou échouent ensemble.
 */
export async function changerStatut(publicationId: string, nouveauStatut: StatutType): Promise<void> {
    const batch = writeBatch(db);
    const publicationRef = doc(db, 'publications', publicationId);
    const mouvementRef = doc(collection(publicationRef, 'mouvementsStatut'));

    batch.update(publicationRef, { statut: nouveauStatut });
    batch.set(mouvementRef, { statut: nouveauStatut, dateChangement: serverTimestamp() });
    await batch.commit();
}

export async function getHistoriqueStatuts(publicationId: string): Promise<MouvementStatut[]> {
    const q = query(
        collection(db, 'publications', publicationId, 'mouvementsStatut'),
        orderBy('dateChangement', 'desc'),
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((d) => ({
        id: d.id,
        statut: d.data().statut as StatutType,
        dateChangement: toDate(d.data().dateChangement),
    }));
}
