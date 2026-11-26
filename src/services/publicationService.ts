import {
    addDoc, collection, deleteDoc, doc, getDoc, getDocs,
    limit, orderBy, query, serverTimestamp, updateDoc, where,
    Timestamp, type DocumentData,
} from 'firebase/firestore';
import { db } from '@/firebase/config/config';
import type { Publication, PublicationInput } from '@/models/publication.model';
import { toDate } from '@/utils/firestore';

const COLLECTION = 'publications';

function versPublication(d: { id: string; data: () => DocumentData | undefined }): Publication {
    const data = d.data() ?? {};
    return {
        id: d.id,
        auteurId: data.auteurId,
        categorieId: data.categorieId,
        villeId: data.villeId,
        statut: data.statut,
        objet: data.objet,
        description: data.description ?? '',
        localisation: data.localisation ?? '',
        datePublication: toDate(data.datePublication),
        dateTrouve: toDate(data.dateTrouve),
        photoUrls: data.photoUrls ?? [],
    };
}


//creer pub

export async function creerPublication(auteurId: string, input: PublicationInput): Promise<string> {
    const ref = await addDoc(collection(db, COLLECTION), {
        ...input,
        auteurId,
        datePublication: serverTimestamp(),
        dateTrouve: Timestamp.fromDate(input.dateTrouve),
    });
    return ref.id;
}

export async function getPublication(id: string): Promise<Publication | null> {
    const snap = await getDoc(doc(db, COLLECTION, id));
    return snap.exists() ? versPublication(snap) : null;
}

export async function getPublicationsRecentes(nombre = 20): Promise<Publication[]> {
    const q = query(collection(db, COLLECTION), orderBy('datePublication', 'desc'), limit(nombre));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(versPublication);
}

export async function getPublicationsParAuteur(auteurId: string): Promise<Publication[]> {
    const q = query(
        collection(db, COLLECTION),
        where('auteurId', '==', auteurId),
        orderBy('datePublication', 'desc'),
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(versPublication);
}


//modifier statut

export async function modifierPublication(
    id: string,
    changements: Partial<Omit<PublicationInput, 'statut'>>,
): Promise<void> {
    const data: DocumentData = { ...changements };
    if (changements.dateTrouve) data.dateTrouve = Timestamp.fromDate(changements.dateTrouve);
    await updateDoc(doc(db, COLLECTION, id), data);
}

export async function supprimerPublication(id: string): Promise<void> {
    await deleteDoc(doc(db, COLLECTION, id));
}


export interface FiltresServeur {
    categorieId?: string;
    villeId?: string;
    statut?: StatutType;
}


export async function rechercherPublications(filtres: FiltresServeur = {}, nombre = 100): Promise<Publication[]> {
    const contraintes: QueryConstraint[] = [];
    if (filtres.categorieId) contraintes.push(where('categorieId', '==', filtres.categorieId));
    if (filtres.villeId) contraintes.push(where('villeId', '==', filtres.villeId));
    if (filtres.statut) contraintes.push(where('statut', '==', filtres.statut));
    contraintes.push(orderBy('datePublication', 'desc'), limit(nombre));
    const snapshot = await getDocs(query(collection(db, COLLECTION), ...contraintes));
    return snapshot.docs.map(versPublication);
}



