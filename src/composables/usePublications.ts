import { computed, reactive, ref } from 'vue';
import type { Publication } from '@/models/publication.model';
import type { Categorie } from '@/models/categorie.model';
import type { Ville } from '@/models/ville.model';
import type { StatutType } from '@/models/statut.model';
import { rechercherPublications } from '@/services/publicationService';
import { getCategories } from '@/services/categorieService';
import { getVilles } from '@/services/villeService';
import { LIMITES } from '@/utils/constantes';
import { inputVersDate } from '@/utils/date';

// ---- Référentiels (catégories et villes), chargés une seule fois et partagés ----
const categories = ref<Categorie[]>([]);
const villes = ref<Ville[]>([]);
const erreurReferentiels = ref('');
let referentielsCharges = false;

export function useReferentiels() {
  async function chargerReferentiels() {
    if (referentielsCharges) return;
    try {
      [categories.value, villes.value] = await Promise.all([getCategories(), getVilles()]);
      referentielsCharges = true;
      erreurReferentiels.value = '';
    } catch (e) {
      console.error(e);
      erreurReferentiels.value = 'Impossible de charger les catégories et les villes.';
    }
  }
  const libelleCategorie = (id: string) =>
    categories.value.find((c) => c.id === id)?.libelle ?? '—';
  const libelleVille = (id: string) => villes.value.find((v) => v.id === id)?.libelle ?? '—';
  return {
    categories,
    villes,
    erreurReferentiels,
    chargerReferentiels,
    libelleCategorie,
    libelleVille,
  };
}

// ---- Liste, recherche et filtres ----
export interface Filtres {
  texte: string;
  categorieId: string;
  villeId: string;
  statut: '' | StatutType;
  dateDebut: string; // yyyy-mm-dd
  dateFin: string;
}

const filtresVides = (): Filtres => ({
  texte: '',
  categorieId: '',
  villeId: '',
  statut: '',
  dateDebut: '',
  dateFin: '',
});

export function usePublications() {
  const publications = ref<Publication[]>([]);
  const filtres = reactive<Filtres>(filtresVides());
  const chargement = ref(false);
  const erreur = ref('');

  /** Catégorie, ville et statut sont filtrés par Firestore ; texte et dates côté client. */
  async function charger() {
    chargement.value = true;
    erreur.value = '';
    try {
      publications.value = await rechercherPublications(
        {
          categorieId: filtres.categorieId || undefined,
          villeId: filtres.villeId || undefined,
          statut: filtres.statut || undefined,
        },
        LIMITES.recherche,
      );
    } catch (e) {
      console.error(e);
      erreur.value = 'Impossible de charger les publications.';
    } finally {
      chargement.value = false;
    }
  }

  const resultats = computed(() => {
    const texte = filtres.texte.trim().toLowerCase();
    const debut = filtres.dateDebut ? inputVersDate(filtres.dateDebut) : null;
    const fin = filtres.dateFin ? inputVersDate(filtres.dateFin) : null;
    if (fin) fin.setHours(23, 59, 59, 999);
    return publications.value.filter((p) => {
      if (
        texte &&
        !p.objet.toLowerCase().includes(texte) &&
        !p.description.toLowerCase().includes(texte)
      )
        return false;
      if (debut && p.datePublication < debut) return false;
      if (fin && p.datePublication > fin) return false;
      return true;
    });
  });

  function majFiltres(patch: Partial<Filtres>) {
    Object.assign(filtres, patch);
  }
  function reinitialiser() {
    Object.assign(filtres, filtresVides());
  }

  return {
    publications,
    resultats,
    filtres,
    chargement,
    erreur,
    charger,
    majFiltres,
    reinitialiser,
  };
}
