# Tp-findit-mobile

Application mobile FindIt (Ionic Vue + TypeScript + Firebase).

## Développement

```bash
npm install
cp .env.example .env   # puis renseigner les valeurs Firebase
npm run dev
```

> Vite 8 nécessite Node.js 20 ou plus récent (`npm run build` échoue avec Node 18).

## Vérification

```bash
npm run type-check
npm run build
npm run format:check
```

## Conventions de code

Le code suit les conventions des documentations officielles : `<script setup lang="ts">`, API Ionic 8
(`label` / `label-placement`), navigation avec `useIonRouter()`, SDK Firebase modulaire et imports
avec l’alias `@`.

- `npm run format` applique Prettier (2 espaces, guillemets simples, point-virgule) à `src/` et `scripts/`.
- `src/utils/date.ts` centralise les dates locales (évite les décalages UTC à Madagascar).
- `src/utils/constantes.ts` centralise les noms de collections et les limites de requêtes.
- `src/utils/notifications.ts` centralise les toasts d’erreur Ionic.
- `src/firebase/config/config.ts` valide les variables d’environnement au démarrage.
- La modification d’une publication est disponible sur `/publier/:id`.

## Firebase

Les règles Firestore et les index des requêtes de publications se trouvent à la racine :

- `firestore.rules` : publications, historique des statuts, profils, conversations ;
- `firestore.indexes.json` : index composites pour les filtres combinés ;
- `storage.rules` : photos des publications (5 Mo max, images uniquement, auteur uniquement) ;
- `firebase.json` : configuration de déploiement.

Pour déployer **uniquement les règles** avec le compte de service (`serviceAccount.json`) :

```bash
nvm use 24
npm run deploy:regles
```

Cette commande suffit à rendre les catégories et villes visibles dans l’application. Pour déployer aussi les index composites et les règles Storage, il faut un compte avec plus de droits (CLI Firebase connectée) :

```bash
nvm use 24
firebase login
npm run deploy:firebase
```

⚠️ Si les listes de catégories/villes restent vides alors que les documents existent dans Firestore, c’est que `firestore.rules` n’est pas déployée : la lecture côté client est alors refusée (`403 Missing or insufficient permissions`).

### Photos / Firebase Storage (désactivé)

Pour rester sur l’offre **Spark gratuite**, l’envoi de photos est volontairement désactivé. Les publications sont créées sans image (`photoUrls: []`) et les cartes affichent « Pas de photo ».

Aucun bucket Storage ni compte Blaze n’est nécessaire pour publier un objet.

Si tu décides plus tard de réactiver les photos, il faudra :

1. passer le projet en **Blaze** et créer le bucket `findit-54810.firebasestorage.app` dans la console Firebase ;
2. appliquer le CORS :
   ```bash
   gsutil cors set storage.cors.json gs://findit-54810.firebasestorage.app
   ```
3. redéployer les règles :
   ```bash
   npm run deploy:firebase
   ```
4. réintégrer l’upload dans `PublierObjetPage.vue` (le service `src/services/storageService.ts` est conservé à cet effet).

## Données de test (Madagascar)

Les données sont codées dans `donnees-test/categories.json` et `donnees-test/villes.json` (tableaux d’objets `{ id, libelle }`). Modifier ces fichiers permet d’ajouter, renommer ou supprimer des valeurs avant import.

Un script remplit les collections Firestore `categories` et `villes` avec ces données :

```bash
npm run seed -- --dry-run   # aperçu sans écrire dans Firestore
npm run seed                # écriture dans Firestore
```

Avant l’écriture, récupère une clé de service :

1. Firebase Console → **Paramètres du projet** → **Comptes de service**.
2. **Générer une nouvelle clé privée** et enregistre le fichier sous `serviceAccount.json` à la racine du projet.
3. Ce fichier est ignoré par Git.

Si le fichier est ailleurs :

```bash
FIREBASE_SERVICE_ACCOUNT=/chemin/vers/ma-cle.json npm run seed
```

Le projet ciblé est lu depuis `VITE_FIREBASE_PROJECT_ID` dans `.env` (`findit-54810`). Pour en cibler un autre :

```bash
FIREBASE_PROJECT_ID=mon-autre-projet npm run seed
```

Les IDs des documents sont stables (slug du libellé) : relancer le script met à jour les documents existants sans créer de doublons. Recharge l’application après le remplissage.
