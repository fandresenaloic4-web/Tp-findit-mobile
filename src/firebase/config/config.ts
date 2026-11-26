type NomVariable =
  | 'VITE_FIREBASE_API_KEY'
  | 'VITE_FIREBASE_AUTH_DOMAIN'
  | 'VITE_FIREBASE_PROJECT_ID'
  | 'VITE_FIREBASE_STORAGE_BUCKET'
  | 'VITE_FIREBASE_MESSAGING_SENDER_ID'
  | 'VITE_FIREBASE_APP_ID';

/** Lit une variable d'environnement et échoue immédiatement si elle manque. */
function lireVariable(nom: NomVariable): string {
  const valeur = import.meta.env[nom];
  if (typeof valeur !== 'string' || valeur.length === 0) {
    throw new Error(
      `Configuration Firebase incomplète : ${nom} est absente. Copiez .env.example vers .env.`,
    );
  }
  return valeur;
}

export const firebaseConfig = {
  apiKey: lireVariable('VITE_FIREBASE_API_KEY'),
  authDomain: lireVariable('VITE_FIREBASE_AUTH_DOMAIN'),
  projectId: lireVariable('VITE_FIREBASE_PROJECT_ID'),
  storageBucket: lireVariable('VITE_FIREBASE_STORAGE_BUCKET'),
  messagingSenderId: lireVariable('VITE_FIREBASE_MESSAGING_SENDER_ID'),
  appId: lireVariable('VITE_FIREBASE_APP_ID'),
};
