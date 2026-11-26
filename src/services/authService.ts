import { FirebaseError } from 'firebase/app';
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  type User,
} from 'firebase/auth';
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import { auth, db } from '@/services/firebase';
import { COLLECTIONS } from '@/utils/constantes';
import { lireChaine } from '@/utils/firestore';

/** Informations complémentaires stockées dans `utilisateurs/{uid}`. */
export interface UserProfile {
  nom: string;
  email: string;
  telephone: string;
  photoUrl: string;
}

export async function registerUser(
  email: string,
  password: string,
  profile: UserProfile,
): Promise<User> {
  const { user } = await createUserWithEmailAndPassword(auth, email, password);

  // Le compte Firebase est créé : une erreur Firestore ne doit pas être
  // signalée comme un échec d'inscription (sinon l'utilisateur reste sur le formulaire).
  try {
    await setDoc(doc(db, COLLECTIONS.utilisateurs, user.uid), {
      nom: profile.nom,
      email: user.email,
      telephone: profile.telephone,
      photoUrl: profile.photoUrl,
      dateCreation: serverTimestamp(),
    });
  } catch (profileError) {
    console.error('Erreur lors de la création du profil :', profileError);
  }

  return user;
}

export async function loginUser(email: string, password: string): Promise<User> {
  const { user } = await signInWithEmailAndPassword(auth, email, password);
  return user;
}

export async function logoutUser(): Promise<void> {
  await signOut(auth);
}

export function observeAuthState(callback: (user: User | null) => void): () => void {
  return onAuthStateChanged(auth, callback);
}

export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  const snapshot = await getDoc(doc(db, COLLECTIONS.utilisateurs, userId));
  if (!snapshot.exists()) return null;

  const donnees = snapshot.data();
  return {
    nom: lireChaine(donnees, 'nom'),
    email: lireChaine(donnees, 'email'),
    telephone: lireChaine(donnees, 'telephone'),
    photoUrl: lireChaine(donnees, 'photoUrl'),
  };
}

/** Traduit les erreurs Firebase Authentication en messages affichables. */
export function getMessageErreurAuth(error: unknown): string {
  const code = error instanceof FirebaseError ? error.code : '';

  switch (code) {
    case 'auth/invalid-email':
      return 'L’adresse e-mail n’est pas valide.';
    case 'auth/email-already-in-use':
      return 'Cette adresse e-mail est déjà utilisée.';
    case 'auth/weak-password':
      return 'Le mot de passe est trop faible (6 caractères minimum).';
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
    case 'auth/user-not-found':
      return 'E-mail ou mot de passe incorrect.';
    case 'auth/missing-password':
      return 'Le mot de passe est obligatoire.';
    case 'auth/too-many-requests':
      return 'Trop de tentatives. Veuillez réessayer plus tard.';
    case 'auth/network-request-failed':
      return 'Connexion réseau impossible. Vérifiez votre connexion.';
    default:
      return 'Une erreur est survenue. Veuillez réessayer.';
  }
}
