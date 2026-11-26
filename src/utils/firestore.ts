import { Timestamp, type DocumentData } from 'firebase/firestore';

/**
 * Convertit une valeur Firestore (Timestamp, Date, chaîne ou nombre) en Date.
 * Retourne l'époque UNIX pour une valeur absente afin d'éviter les exceptions
 * lors de l'affichage d'une publication partiellement renseignée.
 */
export function toDate(valeur: unknown): Date {
  if (valeur instanceof Date) return valeur;
  if (valeur instanceof Timestamp) return valeur.toDate();

  if (typeof valeur === 'string' || typeof valeur === 'number') {
    const date = new Date(valeur);
    if (!Number.isNaN(date.getTime())) return date;
  }

  return new Date(0);
}

/** Lit un champ texte Firestore sans assertion de type. */
export function lireChaine(donnees: DocumentData, champ: string): string {
  const valeur = donnees[champ];
  return typeof valeur === 'string' ? valeur : '';
}

/** Lit un tableau de chaînes Firestore (utilisé pour `photoUrls`). */
export function lireChaines(donnees: DocumentData, champ: string): string[] {
  const valeur = donnees[champ];
  return Array.isArray(valeur)
    ? valeur.filter((element): element is string => typeof element === 'string')
    : [];
}
