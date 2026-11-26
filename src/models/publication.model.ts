import type { StatutType } from './statut.model';

export interface Publication {
  id: string;
  auteurId: string;
  categorieId: string;
  villeId: string;
  statut: StatutType;
  objet: string;
  description: string;
  localisation: string;
  datePublication: Date;
  dateTrouve: Date;
  photoUrls: string[];
}

/** Données saisies dans le formulaire (id, auteur et date de publication sont ajoutés par le service). */
export type PublicationInput = Omit<Publication, 'id' | 'auteurId' | 'datePublication'>;
