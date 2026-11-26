import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createSign } from 'node:crypto';
import { Agent, setGlobalDispatcher } from 'undici';

// Certains réseaux n'acheminent pas l'IPv6 vers les API Google.
setGlobalDispatcher(new Agent({ connect: { family: 4 } }));

const RACINE = join(dirname(fileURLToPath(import.meta.url)), '..');
const SERVICE_ACCOUNT =
  process.env.GOOGLE_APPLICATION_CREDENTIALS ?? join(RACINE, 'serviceAccount.json');

function lireFichierEnv() {
  const chemin = join(RACINE, '.env');
  if (!existsSync(chemin)) return {};

  return Object.fromEntries(
    readFileSync(chemin, 'utf8')
      .split(/\r?\n/)
      .filter((ligne) => /^[A-Z0-9_]+=/.test(ligne))
      .map((ligne) => {
        const i = ligne.indexOf('=');
        return [ligne.slice(0, i), ligne.slice(i + 1)];
      }),
  );
}

const PROJECT_ID =
  process.env.FIREBASE_PROJECT_ID ?? lireFichierEnv().VITE_FIREBASE_PROJECT_ID ?? 'findit-54810';

/** Génère un JWT signé puis l'échange contre un access token Google. */
async function obtenirToken() {
  if (!existsSync(SERVICE_ACCOUNT)) {
    throw new Error(`Fichier de service introuvable : ${SERVICE_ACCOUNT}`);
  }
  const compte = JSON.parse(readFileSync(SERVICE_ACCOUNT, 'utf8'));
  const encoder = (objet) => Buffer.from(JSON.stringify(objet)).toString('base64url');
  const maintenant = Math.floor(Date.now() / 1000);
  const entete = encoder({ alg: 'RS256', typ: 'JWT' });
  const revendications = encoder({
    iss: compte.client_email,
    scope: 'https://www.googleapis.com/auth/firebase',
    aud: 'https://oauth2.googleapis.com/token',
    iat: maintenant,
    exp: maintenant + 3600,
  });
  const aSigner = `${entete}.${revendications}`;
  const signature = createSign('RSA-SHA256')
    .update(aSigner)
    .sign(compte.private_key)
    .toString('base64url');

  const reponse = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: `${aSigner}.${signature}`,
    }),
  });

  if (!reponse.ok) {
    throw new Error(`Token Google refusé (${reponse.status}) : ${await reponse.text()}`);
  }
  const donnees = await reponse.json();
  return donnees.access_token;
}

async function appeler(url, options) {
  const reponse = await fetch(url, options);
  const corps = await reponse.text();
  let donnees = null;
  try {
    donnees = JSON.parse(corps);
  } catch {
    donnees = corps;
  }
  if (!reponse.ok) {
    throw new Error(`${reponse.status} ${donnees?.error?.message ?? corps}`);
  }
  return donnees;
}

const REGLES = [
  { release: 'cloud.firestore', fichier: 'firestore.rules' },
  { release: 'cloud.storage', fichier: 'storage.rules' },
];

try {
  const token = await obtenirToken();
  const entetes = {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  };

  for (const { release: releaseId, fichier } of REGLES) {
    const contenu = readFileSync(join(RACINE, fichier), 'utf8');

    const ruleset = await appeler(
      `https://firebaserules.googleapis.com/v1/projects/${PROJECT_ID}/rulesets`,
      {
        method: 'POST',
        headers: entetes,
        body: JSON.stringify({ source: { files: [{ name: fichier, content: contenu }] } }),
      },
    );

    const releaseName = `projects/${PROJECT_ID}/releases/${releaseId}`;
    const release = { name: releaseName, rulesetName: ruleset.name };

    try {
      await appeler(`https://firebaserules.googleapis.com/v1/${releaseName}`, {
        method: 'PATCH',
        headers: entetes,
        body: JSON.stringify({ release, updateMask: 'rulesetName' }),
      });
    } catch (e) {
      // Une release n'existe pas encore (cas typique de cloud.storage) : on la crée.
      if (!e.message.startsWith('404')) throw e;
      try {
        await appeler(`https://firebaserules.googleapis.com/v1/projects/${PROJECT_ID}/releases`, {
          method: 'POST',
          headers: entetes,
          body: JSON.stringify(release),
        });
      } catch (creationErreur) {
        if (!creationErreur.message.startsWith('403')) throw creationErreur;
        console.warn(
          `${releaseId} : création refusée par le compte de service (déployez avec firebase login).`,
        );
        continue;
      }
    }

    console.log(`${releaseId} -> ${ruleset.name}`);
  }

  console.log('Regles Firebase deployees.');
} catch (e) {
  console.error('Echec du deploiement des regles :', e.message);
  if (e.cause) console.error('Cause :', e.cause.message ?? e.cause);
  if (e.stack) console.error(e.stack.split('\n').slice(0, 6).join('\n'));
  process.exitCode = 1;
}
