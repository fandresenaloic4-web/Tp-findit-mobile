
import { storeToRefs } from 'pinia';
import { useAuthStore } from '../stores/authStore';

export function useAuth() {
  const authStore = useAuthStore();

  // Récupération des états réactifs
  const {
    user,
    profile,
    loading,
    authInitialized,
    error,
    isAuthenticated
  } = storeToRefs(authStore);

  // Initialisation de l'observation Firebase
  authStore.initializeAuth();

  return {
    // États
    user,
    profile,
    loading,
    authInitialized,
    error,
    isAuthenticated,

    // Actions
    clearError: authStore.clearError,
    register: authStore.register,
    login: authStore.login,
    logout: authStore.logout
  };
}
