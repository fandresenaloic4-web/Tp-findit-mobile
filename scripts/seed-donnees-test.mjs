import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { applicationDefault, cert, getApps, initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

const DOSSIER_DONNEES = join(dirname(fileURLToPath(import.meta.url)), '..', 'donnees-test');

/** Lit un fichier JSON de la forme : [{ "id": "...", "libelle": "..." }, ...] */
function chargerDonnees(nomFichier) {
  const chemin = join(DOSSIER_DONNEES, nomFichier);
  const donnees = JSON.parse(readFileSync(chemin, 'utf8'));

  if (!Array.isArray(donnees)) {
    throw new Error(`${nomFichier} doit contenir un tableau.`);
  }
  for (const document of donnees) {
    if (!document.id || !document.libelle) {
      throw new Error(`${nomFichier} : chaque document doit avoir "id" et "libelle".`);
    }
  }
  return donnees;
}

function lireFichierEnv() {
  const valeurs = {};
  if (!existsSync('.env')) return valeurs;

  for (const ligne of readFileSync('.env', 'utf8').split(/\r?\n/)) {
    const correspondance = ligne.match(/^([A-Z0-9_]+)=(.*)$/);
    if (correspondance) {
      valeurs[correspondance[1]] = correspondance[2].replace(/^["']|["']$/g, '');
    }
  }
  return valeurs;
}

const CATEGORIES = chargerDonnees('categories.json');
const VILLES = chargerDonnees('villes.json');
const env = lireFichierEnv();
const PROJECT_ID =
  process.env.FIREBASE_PROJECT_ID ?? env.VITE_FIREBASE_PROJECT_ID ?? 'findit-54810';
const SERVICE_ACCOUNT = process.env.FIREBASE_SERVICE_ACCOUNT ?? './serviceAccount.json';

if (process.argv.includes('--dry-run')) {
  console.log('Projet     :', PROJECT_ID);
  console.log('Categories :', CATEGORIES.length, 'documents');
  console.log('Villes     :', VILLES.length, 'documents');
  console.log('Exemples   :', CATEGORIES.slice(0, 3));
  process.exit(0);
}

if (!getApps().length) {
  if (existsSync(SERVICE_ACCOUNT)) {
    const serviceAccount = JSON.parse(readFileSync(SERVICE_ACCOUNT, 'utf8'));
    if (
      !serviceAccount ||
      typeof serviceAccount !== 'object' ||
      !serviceAccount.private_key ||
      !serviceAccount.client_email
    ) {
      console.error(`${SERVICE_ACCOUNT} n’est pas une clé de service Firebase.`);
      console.error('Le fichier doit commencer par {"type":"service_account",...}');
      console.error(
        'Télécharge-le via : Paramètres du projet → Comptes de service → Générer une nouvelle clé privée.',
      );
      process.exit(1);
    }
    initializeApp({ credential: cert(serviceAccount), projectId: PROJECT_ID });
    console.log(`Authentification avec ${SERVICE_ACCOUNT}`);
  } else if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    initializeApp({ credential: applicationDefault(), projectId: PROJECT_ID });
    console.log('Authentification avec Application Default Credentials');
  } else {
    console.error('Impossible d’écrire dans Firestore : aucune credentiel Admin.');
    console.error('Télécharge une clé de service Firebase et enregistre-la sous :');
    console.error(`  ${SERVICE_ACCOUNT}`);
    console.error(
      'Firebase Console → Paramètres du projet → Comptes de service → Générer une nouvelle clé privée.',
    );
    process.exit(1);
  }
}

const db = getFirestore();

async function seedCollection(nom, documents) {
  const batch = db.batch();
  for (const { id, libelle } of documents) {
    // merge: true permet de relancer le script sans écraser les autres champs.
    batch.set(db.collection(nom).doc(id), { libelle }, { merge: true });
  }
  await batch.commit();
  console.log(`${documents.length} documents ecrits dans "${nom}"`);
}

try {
  await seedCollection('categories', CATEGORIES);
  await seedCollection('villes', VILLES);
  console.log('Termine. Recharge l’application pour voir les nouvelles listes.');
} catch (e) {
  console.error('Echec du remplissage Firestore :', e);
  process.exitCode = 1;
}
