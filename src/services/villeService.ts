import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from '@/firebase/config/config';
import type { Ville } from '@/models/ville.model';

const COLLECTION = 'villes';

export async function getVilles(): Promise<Ville[]> {
    const q = query(collection(db, COLLECTION), orderBy('libelle'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((d) => ({ id: d.id, libelle: d.data().libelle as string }));
}


