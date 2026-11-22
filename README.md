# FindIt

Application Ionic Vue + TypeScript pour publier et retrouver des objets perdus ou trouvés.

## Fonctionnalités

- Accueil avec recherche et filtres perdu/trouvé
- Publication d’une annonce avec photo prise ou choisie via Capacitor Camera
- Détail d’une annonce et changement de statut par son propriétaire
- Comptes Firebase Authentication
- Annonces et profils Firebase Firestore
- Photos Firebase Storage

La géolocalisation et la carte sont volontairement réservées à une future version 2.

## Installation

```bash
npm install
cp .env.example .env
npm run dev
```

Renseignez les variables Firebase dans `.env` depuis les paramètres de votre projet Firebase.

## Android

```bash
npm run build
npx cap add android
npx cap sync android
npx cap open android
```

Ouvrez ensuite le projet dans Android Studio pour compiler ou générer l’APK.