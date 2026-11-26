import { deleteObject, getDownloadURL, listAll, ref, uploadBytes } from 'firebase/storage';
import { storage } from '@/services/firebase';

/** Taille maximale autorisée par image (5 Mo). */
export const TAILLE_MAX_PHOTO = 5 * 1024 * 1024;
/** Nombre maximal de photos par publication. */
export const NOMBRE_MAX_PHOTOS = 5;

export function validerPhoto(fichier: File): string | null {
  if (!fichier.type.startsWith('image/')) {
    return `« ${fichier.name} » n’est pas une image.`;
  }
  if (fichier.size > TAILLE_MAX_PHOTO) {
    return `« ${fichier.name} » dépasse 5 Mo.`;
  }
  return null;
}

function nettoyerNom(nom: string): string {
  return nom.replace(/[^a-zA-Z0-9._-]/g, '_');
}

/**
 * Envoie les photos dans publications/{publicationId}/photos/ et retourne
 * leurs URLs de téléchargement, à enregistrer dans le champ photoUrls.
 */
export async function uploadPhotosPublication(
  publicationId: string,
  fichiers: File[],
): Promise<string[]> {
  const urls: string[] = [];

  try {
    for (const fichier of fichiers) {
      const erreur = validerPhoto(fichier);
      if (erreur) throw new Error(erreur);

      const nom = `${Date.now()}-${Math.random().toString(36).slice(2)}-${nettoyerNom(fichier.name)}`;
      const destination = ref(storage, `publications/${publicationId}/photos/${nom}`);
      const resultat = await uploadBytes(destination, fichier, { contentType: fichier.type });
      urls.push(await getDownloadURL(resultat.ref));
    }
  } catch (e) {
    // Évite de laisser des fichiers orphelins si un envoi échoue en cours de route.
    await Promise.all(urls.map((url) => supprimerPhoto(url).catch(() => undefined)));
    throw e;
  }

  return urls;
}

/** Supprime une photo à partir de son URL de téléchargement. */
export async function supprimerPhoto(url: string): Promise<void> {
  await deleteObject(ref(storage, url));
}

/** Supprime toutes les photos d'une publication (avant la suppression du document Firestore). */
export async function supprimerPhotosPublication(publicationId: string): Promise<void> {
  const dossier = ref(storage, `publications/${publicationId}/photos`);
  const { items } = await listAll(dossier);
  await Promise.all(items.map((item) => deleteObject(item)));
}
