import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import type { User } from 'firebase/auth';

import {
  registerUser,
  loginUser,
  logoutUser,
  observeAuthState,
  getUserProfile,
  getMessageErreurAuth,
  type UserProfile
} from '../services/authService';

export const useAuthStore = defineStore('auth', () => {

  // États
  const user = ref<User | null>(null);
  const profile = ref<UserProfile | null>(null);
  const loading = ref(true);
  const authInitialized = ref(false);
  const error = ref<string | null>(null);

  // État calculé
  const isAuthenticated = computed(() => user.value !== null);

  // Promesse résolue dès que le premier état d'authentification est connu
  let resolveAuthReady: (() => void) | null = null;
  const authReadyPromise = new Promise<void>((resolve) => {
    resolveAuthReady = resolve;
  });

  const clearError = () => {
    error.value = null;
  };

  // La lecture du profil ne doit jamais faire échouer une authentification réussie.
  const loadProfile = async (userId: string) => {
    try {
      profile.value = await getUserProfile(userId);
    } catch (profileError) {
      console.error('Erreur récupération profil :', profileError);
      profile.value = null;
    }
  };

  // Observer l'état de connexion
  let unsubscribeAuth: (() => void) | null = null;

  const initializeAuth = () => {
    if (unsubscribeAuth) return;

    unsubscribeAuth = observeAuthState((currentUser) => {
      user.value = currentUser;

      // La décision de navigation dépend uniquement de l'état Firebase Auth,
      // pas de la disponibilité de Firestore.
      loading.value = false;
      authInitialized.value = true;

      if (resolveAuthReady) {
        resolveAuthReady();
        resolveAuthReady = null;
      }

      if (currentUser) {
        void loadProfile(currentUser.uid);
      } else {
        profile.value = null;
      }
    });
  };

  // Attendre la restauration de la session au démarrage de l'application
  const waitForAuth = () => {
    initializeAuth();
    return authReadyPromise;
  };

  // Inscription
  const register = async (
    email: string,
    password: string,
    userProfile: UserProfile
  ) => {
    loading.value = true;
    clearError();

    try {
      const newUser = await registerUser(
        email,
        password,
        userProfile
      );

      user.value = newUser;
      profile.value = userProfile;

      return newUser;
    } catch (authError) {
      error.value = getMessageErreurAuth(authError);
      throw authError;
    } finally {
      loading.value = false;
    }
  };

  // Connexion
  const login = async (email: string, password: string) => {
    loading.value = true;
    clearError();

    try {
      const loggedUser = await loginUser(email, password);

      user.value = loggedUser;
      void loadProfile(loggedUser.uid);

      return loggedUser;
    } catch (authError) {
      error.value = getMessageErreurAuth(authError);
      throw authError;
    } finally {
      loading.value = false;
    }
  };

  // Déconnexion
  const logout = async () => {
    loading.value = true;
    clearError();

    try {
      await logoutUser();

      user.value = null;
      profile.value = null;
    } catch (authError) {
      error.value = getMessageErreurAuth(authError);
      throw authError;
    } finally {
      loading.value = false;
    }
  };

  return {
    user,
    profile,
    loading,
    authInitialized,
    error,
    isAuthenticated,
    clearError,
    initializeAuth,
    waitForAuth,
    register,
    login,
    logout
  };
});
