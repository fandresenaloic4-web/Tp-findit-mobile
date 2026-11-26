import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from '@/firebase/config/config';
import type { Categorie } from '@/models/categorie.model';

const COLLECTION = 'categories';

export async function getCategories(): Promise<Categorie[]> {
    const q = query(collection(db, COLLECTION), orderBy('libelle'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((d) => ({ id: d.id, libelle: d.data().libelle as string }));
}
