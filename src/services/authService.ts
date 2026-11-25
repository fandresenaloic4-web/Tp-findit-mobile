
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  type User
} from 'firebase/auth';

import {
  doc,
  setDoc,
  getDoc,
  serverTimestamp
} from 'firebase/firestore';

import { auth, db } from './firebase';

// Type des informations complémentaires de l'utilisateur
export interface UserProfile {
  nom: string;
  email: string;
  telephone: string;
  photoUrl: string;
}

// Inscription d'un utilisateur
export const registerUser = async (
  email: string,
  password: string,
  profile: UserProfile
) => {
  // 1. Création du compte Firebase Authentication
  const userCredential = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );

  const user = userCredential.user;

  // 2. Création du profil dans Firestore
  await setDoc(doc(db, 'utilisateurs', user.uid), {
    nom: profile.nom,
    email: user.email,
    telephone: profile.telephone,
    photoUrl: profile.photoUrl,
    dateCreation: serverTimestamp()
  });

  return user;
};

// Connexion d'un utilisateur
export const loginUser = async (
  email: string,
  password: string
) => {
  const userCredential = await signInWithEmailAndPassword(
    auth,
    email,
    password
  );

  return userCredential.user;
};

// Récupération du profil utilisateur
export const getUserProfile = async (
  userId: string
): Promise<UserProfile | null> => {
  const userRef = doc(db, 'utilisateurs', userId);
  const userSnapshot = await getDoc(userRef);

  if (userSnapshot.exists()) {
    return userSnapshot.data() as UserProfile;
  }

  return null;
};


// Déconnexion
export const logoutUser = async () => {
  await signOut(auth);
};

// Observation de l'état de connexion
export const observeAuthState = (
  callback: (user: User | null) => void
) => {
  return onAuthStateChanged(auth, callback);
};

// Traduction des erreurs Firebase Authentication en messages affichables
export const getMessageErreurAuth = (error: unknown): string => {
  const code = (error as { code?: string } | null)?.code;

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
};
