import { toastController } from '@ionic/vue';
import { DUREE_TOAST } from '@/utils/constantes';

/** Affiche un message d'erreur Ionic, avec une durée cohérente dans toute l'application. */
export async function afficherToastErreur(message: string): Promise<void> {
  const toast = await toastController.create({
    message,
    duration: DUREE_TOAST.erreur,
    color: 'danger',
  });
  await toast.present();
}
