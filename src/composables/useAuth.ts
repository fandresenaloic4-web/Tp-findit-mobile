import { storeToRefs } from 'pinia';
import { useAuthStore } from '@/stores/authStore';

/** Expose l'état d'authentification sous forme de refs, comme recommandé par Pinia. */
export function useAuth() {
  const authStore = useAuthStore();
  const { user, profile, loading, authInitialized, error, isAuthenticated } =
    storeToRefs(authStore);

  return {
    user,
    profile,
    loading,
    authInitialized,
    error,
    isAuthenticated,
    clearError: authStore.clearError,
    register: authStore.register,
    login: authStore.login,
    logout: authStore.logout,
  };
}
