import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth } from '@/firebase/config';

export const inscrire = (email: string, mdp: string) =>
    createUserWithEmailAndPassword(auth, email, mdp);

export const connecter = (email: string, mdp: string) =>
    signInWithEmailAndPassword(auth, email, mdp);

export const deconnecter = () => signOut(auth);
