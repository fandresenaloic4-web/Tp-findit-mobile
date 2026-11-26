/**
 * Utilitaires de dates.
 *
 * Les champs `<input type="date">` attendent une chaîne `AAAA-MM-JJ` exprimée
 * dans le fuseau local. `toISOString()` convertit en UTC et décale d'un jour
 * à Madagascar (UTC+3) en fin de journée : on évite donc cette méthode ici.
 */

export function dateVersInput(date: Date): string {
  const annee = date.getFullYear();
  const mois = String(date.getMonth() + 1).padStart(2, '0');
  const jour = String(date.getDate()).padStart(2, '0');
  return `${annee}-${mois}-${jour}`;
}

export function aujourdhuiLocal(): string {
  return dateVersInput(new Date());
}

export function inputVersDate(valeur: string): Date {
  const [annee, mois, jour] = valeur.split('-').map(Number);
  return new Date(annee, mois - 1, jour);
}

/** Formate une date Firestore, en affichant un tiret si elle est absente. */
export function formaterDate(date: Date | null | undefined): string {
  if (!date || Number.isNaN(date.getTime()) || date.getTime() === 0) return '—';
  return date.toLocaleDateString('fr-FR');
}

export function formaterDateHeure(date: Date | null | undefined): string {
  if (!date || Number.isNaN(date.getTime()) || date.getTime() === 0) return '—';
  return date.toLocaleString('fr-FR');
}
