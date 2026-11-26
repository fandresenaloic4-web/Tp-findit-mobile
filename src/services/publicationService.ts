import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
  Timestamp,
  updateDoc,
  where,
  writeBatch,
  type DocumentData,
  type DocumentSnapshot,
  type QueryConstraint,
} from 'firebase/firestore';
import { db } from '@/services/firebase';
import type { Publication, PublicationInput } from '@/models/publication.model';
import { estStatutType, type StatutType } from '@/models/statut.model';
import { COLLECTIONS, LIMITES, SOUS_COLLECTIONS } from '@/utils/constantes';
import { lireChaine, lireChaines, toDate } from '@/utils/firestore';

function lireStatut(donnees: DocumentData): StatutType {
  const valeur = lireChaine(donnees, 'statut');
  return estStatutType(valeur) ? valeur : 'perdu';
}

/**
 * Convertit un snapshot Firestore en modèle applicatif.
 * Les lectures sont typées explicitement plutôt que par `as Publication`.
 */
function versPublication(snapshot: DocumentSnapshot<DocumentData>): Publication {
  const donnees = snapshot.data() ?? {};
  return {
    id: snapshot.id,
    auteurId: lireChaine(donnees, 'auteurId'),
    categorieId: lireChaine(donnees, 'categorieId'),
    villeId: lireChaine(donnees, 'villeId'),
    statut: lireStatut(donnees),
    objet: lireChaine(donnees, 'objet'),
    description: lireChaine(donnees, 'description'),
    localisation: lireChaine(donnees, 'localisation'),
    datePublication: toDate(donnees.datePublication),
    dateTrouve: toDate(donnees.dateTrouve),
    photoUrls: lireChaines(donnees, 'photoUrls'),
  };
}

/** Données du formulaire : le statut est passé séparément et les photos sont désactivées. */
export type PublicationSansPhotos = Omit<PublicationInput, 'photoUrls' | 'statut'>;

function donneesPublication(
  input: PublicationSansPhotos,
  auteurId: string,
  statut: StatutType,
): DocumentData {
  return {
    ...input,
    statut,
    auteurId,
    photoUrls: [],
    datePublication: serverTimestamp(),
    dateTrouve: Timestamp.fromDate(input.dateTrouve),
  };
}

/**
 * Crée la publication et son premier mouvement de statut dans un seul batch :
 * les deux écritures réussissent ou échouent ensemble.
 */
export async function creerPublicationAvecHistorique(
  auteurId: string,
  input: PublicationSansPhotos,
  statut: StatutType,
): Promise<string> {
  const batch = writeBatch(db);
  const publicationRef = doc(collection(db, COLLECTIONS.publications));
  const mouvementRef = doc(collection(publicationRef, SOUS_COLLECTIONS.mouvementsStatut));

  batch.set(publicationRef, donneesPublication(input, auteurId, statut));
  batch.set(mouvementRef, { statut, dateChangement: serverTimestamp() });
  await batch.commit();

  return publicationRef.id;
}

export async function getPublication(id: string): Promise<Publication | null> {
  const snapshot = await getDoc(doc(db, COLLECTIONS.publications, id));
  return snapshot.exists() ? versPublication(snapshot) : null;
}

export async function getPublicationsRecentes(
  nombre: number = LIMITES.publicationsRecentes,
): Promise<Publication[]> {
  const requete = query(
    collection(db, COLLECTIONS.publications),
    orderBy('datePublication', 'desc'),
    limit(nombre),
  );
  const snapshot = await getDocs(requete);
  return snapshot.docs.map(versPublication);
}

export async function getPublicationsParAuteur(auteurId: string): Promise<Publication[]> {
  const requete = query(
    collection(db, COLLECTIONS.publications),
    where('auteurId', '==', auteurId),
    orderBy('datePublication', 'desc'),
  );
  const snapshot = await getDocs(requete);
  return snapshot.docs.map(versPublication);
}

export async function modifierPublication(
  id: string,
  changements: Partial<Omit<PublicationInput, 'statut'>>,
): Promise<void> {
  const donnees: DocumentData = { ...changements };
  if (changements.dateTrouve) donnees.dateTrouve = Timestamp.fromDate(changements.dateTrouve);
  await updateDoc(doc(db, COLLECTIONS.publications, id), donnees);
}

export async function supprimerPublication(id: string): Promise<void> {
  await deleteDoc(doc(db, COLLECTIONS.publications, id));
}

export interface FiltresServeur {
  categorieId?: string;
  villeId?: string;
  statut?: StatutType;
}

export async function rechercherPublications(
  filtres: FiltresServeur = {},
  nombre: number = LIMITES.recherche,
): Promise<Publication[]> {
  const contraintes: QueryConstraint[] = [];

  if (filtres.categorieId) contraintes.push(where('categorieId', '==', filtres.categorieId));
  if (filtres.villeId) contraintes.push(where('villeId', '==', filtres.villeId));
  if (filtres.statut) contraintes.push(where('statut', '==', filtres.statut));

  contraintes.push(orderBy('datePublication', 'desc'), limit(nombre));

  const requete = query(collection(db, COLLECTIONS.publications), ...contraintes);
  const snapshot = await getDocs(requete);
  return snapshot.docs.map(versPublication);
}
