import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from '@/services/firebase';
import type { Ville } from '@/models/ville.model';
import { COLLECTIONS } from '@/utils/constantes';
import { lireChaine } from '@/utils/firestore';

export async function getVilles(): Promise<Ville[]> {
  const requete = query(collection(db, COLLECTIONS.villes), orderBy('libelle'));
  const snapshot = await getDocs(requete);

  return snapshot.docs.map((document) => ({
    id: document.id,
    libelle: lireChaine(document.data(), 'libelle'),
  }));
}
