import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from '@/services/firebase';
import type { Categorie } from '@/models/categorie.model';
import { COLLECTIONS } from '@/utils/constantes';
import { lireChaine } from '@/utils/firestore';

export async function getCategories(): Promise<Categorie[]> {
  const requete = query(collection(db, COLLECTIONS.categories), orderBy('libelle'));
  const snapshot = await getDocs(requete);

  return snapshot.docs.map((document) => ({
    id: document.id,
    libelle: lireChaine(document.data(), 'libelle'),
  }));
}
