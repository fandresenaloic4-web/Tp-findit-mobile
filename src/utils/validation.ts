// Messages de validation partagés entre les formulaires d'inscription et de connexion.

export type ErreursFormulaire = Record<string, string>;

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const TELEPHONE_REGEX = /^\+?[0-9\s().-]{8,20}$/;
const MOT_DE_PASSE_MINIMAL = 6;

export const validerNom = (nom: string): string | null => {
  if (!nom.trim()) {
    return 'Le nom est obligatoire.';
  }

  if (nom.trim().length < 2) {
    return 'Le nom doit contenir au moins 2 caractères.';
  }

  return null;
};

export const validerEmail = (email: string): string | null => {
  if (!email.trim()) {
    return 'L’adresse e-mail est obligatoire.';
  }

  if (!EMAIL_REGEX.test(email.trim())) {
    return 'L’adresse e-mail n’est pas valide.';
  }

  return null;
};

export const validerTelephone = (telephone: string): string | null => {
  if (!telephone.trim()) {
    return 'Le numéro de téléphone est obligatoire.';
  }

  if (!TELEPHONE_REGEX.test(telephone.trim())) {
    return 'Le numéro de téléphone n’est pas valide.';
  }

  return null;
};

export const validerMotDePasse = (motDePasse: string): string | null => {
  if (!motDePasse) {
    return 'Le mot de passe est obligatoire.';
  }

  if (motDePasse.length < MOT_DE_PASSE_MINIMAL) {
    return `Le mot de passe doit contenir au moins ${MOT_DE_PASSE_MINIMAL} caractères.`;
  }

  return null;
};

export const validerFormulaireConnexion = (
  email: string,
  motDePasse: string
): ErreursFormulaire => {
  const erreurs: ErreursFormulaire = {};

  const erreurEmail = validerEmail(email);
  if (erreurEmail) {
    erreurs.email = erreurEmail;
  }

  const erreurMotDePasse = validerMotDePasse(motDePasse);
  if (erreurMotDePasse) {
    erreurs.motDePasse = erreurMotDePasse;
  }

  return erreurs;
};

export const validerFormulaireInscription = (
  nom: string,
  email: string,
  telephone: string,
  motDePasse: string,
  confirmationMotDePasse: string
): ErreursFormulaire => {
  const erreurs: ErreursFormulaire = {};

  const erreurNom = validerNom(nom);
  if (erreurNom) {
    erreurs.nom = erreurNom;
  }

  const erreurEmail = validerEmail(email);
  if (erreurEmail) {
    erreurs.email = erreurEmail;
  }

  const erreurTelephone = validerTelephone(telephone);
  if (erreurTelephone) {
    erreurs.telephone = erreurTelephone;
  }

  const erreurMotDePasse = validerMotDePasse(motDePasse);
  if (erreurMotDePasse) {
    erreurs.motDePasse = erreurMotDePasse;
  }

  if (!confirmationMotDePasse) {
    erreurs.confirmationMotDePasse = 'La confirmation du mot de passe est obligatoire.';
  } else if (motDePasse !== confirmationMotDePasse) {
    erreurs.confirmationMotDePasse = 'Les mots de passe ne correspondent pas.';
  }

  return erreurs;
};
