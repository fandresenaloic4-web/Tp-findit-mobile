import {
  collection,
  doc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  writeBatch,
} from 'firebase/firestore';
import { db } from '@/services/firebase';
import {
  estStatutType,
  STATUTS,
  type MouvementStatut,
  type Statut,
  type StatutType,
} from '@/models/statut.model';
import { COLLECTIONS, SOUS_COLLECTIONS } from '@/utils/constantes';
import { toDate } from '@/utils/firestore';

/** Copie en lecture seule : les statuts sont des référentiels, pas un état modifiable. */
export function getStatuts(): readonly Statut[] {
  return STATUTS;
}

export function libelleStatut(code: StatutType): string {
  return STATUTS.find((statut) => statut.code === code)?.libelle ?? code;
}

/**
 * Change le statut d'une publication ET enregistre le mouvement,
 * dans un seul batch : les deux écritures réussissent ou échouent ensemble.
 */
export async function changerStatut(
  publicationId: string,
  nouveauStatut: StatutType,
): Promise<void> {
  const batch = writeBatch(db);
  const publicationRef = doc(db, COLLECTIONS.publications, publicationId);
  const mouvementRef = doc(collection(publicationRef, SOUS_COLLECTIONS.mouvementsStatut));

  batch.update(publicationRef, { statut: nouveauStatut });
  batch.set(mouvementRef, { statut: nouveauStatut, dateChangement: serverTimestamp() });
  await batch.commit();
}

export async function getHistoriqueStatuts(publicationId: string): Promise<MouvementStatut[]> {
  const publicationRef = doc(db, COLLECTIONS.publications, publicationId);
  const requete = query(
    collection(publicationRef, SOUS_COLLECTIONS.mouvementsStatut),
    orderBy('dateChangement', 'desc'),
  );
  const snapshot = await getDocs(requete);

  return snapshot.docs.map((document) => {
    const donnees = document.data();
    const statutBrut = typeof donnees.statut === 'string' ? donnees.statut : '';
    return {
      id: document.id,
      statut: estStatutType(statutBrut) ? statutBrut : 'perdu',
      dateChangement: toDate(donnees.dateChangement),
    };
  });
}
