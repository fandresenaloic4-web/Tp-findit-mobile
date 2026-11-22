# FindIt — Langages, frameworks et structure du projet

## Réponse directe

Pour réaliser **FindIt**, tu as besoin à la fois :

1. **Des langages et frameworks** pour développer l’application.
2. **D’une structure de dossiers** pour organiser le code.
3. **De Firebase** pour gérer les comptes, la base de données, les images et les notifications.

La structure des dossiers seule ne suffit pas : elle sert uniquement à organiser les fichiers. Il faut aussi écrire le code avec **TypeScript**, **Vue 3**, **Ionic Vue**, **Firebase** et **Capacitor**.

## Technologies à utiliser

| Élément | Technologie recommandée | Rôle dans FindIt |
|---|---|---|
| Langage principal | **TypeScript** | Écrire tout le code de l’application avec des types |
| Framework frontend | **Vue 3** | Créer les écrans et gérer l’affichage |
| Framework mobile | **Ionic Vue** | Créer l’interface mobile : pages, onglets, boutons, formulaires |
| Backend | **Firebase** | Authentification, base de données, stockage et notifications |
| Base de données | **Cloud Firestore** | Stocker les utilisateurs, publications, messages et statuts |
| Stockage de fichiers | **Firebase Storage** | Stocker les photos des objets et les photos de profil |
| Notifications | **Firebase Cloud Messaging** | Envoyer des notifications aux utilisateurs |
| Accès aux fonctions du téléphone | **Capacitor** | Caméra, géolocalisation, notifications et génération Android |
| Compilation Android | **Android Studio** | Tester l’application et générer l’APK |
| Gestion de version | **Git + GitHub** | Travailler à deux sans perdre le code |

## Langages à connaître

### TypeScript

TypeScript est le langage principal du projet. C’est une version améliorée de JavaScript qui ajoute des types.

Exemple :

```typescript
interface Publication {
  id: string;
  titre: string;
  description: string;
  categorieId: string;
  villeId: string;
  statut: "perdu" | "retrouve" | "recupere";
  photoUrls: string[];
  auteurId: string;
  datePublication: Date;
}
```

Tu utiliseras TypeScript pour :

- Créer les modèles de données.
- Écrire les services Firebase.
- Gérer les formulaires.
- Créer les composants Vue.
- Gérer la navigation entre les pages.

### HTML et CSS

Tu utiliseras aussi :

- **HTML** pour la structure des écrans.
- **CSS** ou **SCSS** pour le style.
- **Ionic Components** pour les éléments mobiles : boutons, cartes, listes, formulaires, onglets.

Exemple de composant Ionic :

```html
<ion-card>
  <ion-card-header>
    <ion-card-title>Téléphone perdu</ion-card-title>
  </ion-card-header>

  <ion-card-content>
    Téléphone Samsung perdu près de la bibliothèque.
  </ion-card-content>
</ion-card>
```

## Frameworks à utiliser

### Vue 3

Vue 3 sert à créer les pages et à gérer les données affichées à l’utilisateur.

Exemple :

```typescript
import { ref } from "vue";

const publications = ref<Publication[]>([]);
const recherche = ref("");
```

### Ionic Vue

Ionic Vue permet de créer une application qui ressemble à une vraie application mobile.

Tu utiliseras notamment :

- `IonApp`
- `IonPage`
- `IonHeader`
- `IonToolbar`
- `IonContent`
- `IonButton`
- `IonInput`
- `IonSelect`
- `IonCard`
- `IonList`
- `IonItem`
- `IonTabs`

### Capacitor

Capacitor transforme ton application Ionic Vue en application Android.

Il permet aussi d’utiliser :

- La caméra.
- La galerie photos.
- La géolocalisation.
- Les notifications.
- Le stockage local.

## Firebase à utiliser

| Service Firebase | Utilisation dans FindIt |
|---|---|
| Firebase Authentication | Inscription, connexion, déconnexion |
| Cloud Firestore | Publications, utilisateurs, messages, catégories, villes |
| Firebase Storage | Photos des objets et photos de profil |
| Firebase Cloud Messaging | Notifications |
| Firebase Security Rules | Protection des données |
| Firebase Emulator Suite | Tests locaux sans consommer le quota Firebase |

## Structure des dossiers

Voici la structure recommandée pour FindIt :

```text
findit/
│
├── android/
│   └── ...                    # Projet Android généré par Capacitor
│
├── public/
│   └── ...                    # Fichiers publics
│
├── src/
│   ├── assets/
│   │   └── images/            # Logos et images statiques
│   │
│   ├── components/
│   │   ├── PublicationCard.vue
│   │   ├── FiltrePublication.vue
│   │   ├── BadgeStatut.vue
│   │   ├── ChampRecherche.vue
│   │   └── CarteUtilisateur.vue
│   │
│   ├── composables/
│   │   ├── useAuth.ts
│   │   ├── usePublications.ts
│   │   ├── useMessages.ts
│   │   └── useGeolocation.ts
│   │
│   ├── models/
│   │   ├── utilisateur.model.ts
│   │   ├── publication.model.ts
│   │   ├── categorie.model.ts
│   │   ├── ville.model.ts
│   │   ├── statut.model.ts
│   │   ├── conversation.model.ts
│   │   └── message.model.ts
│   │
│   ├── pages/
│   │   ├── AccueilPage.vue
│   │   ├── ConnexionPage.vue
│   │   ├── InscriptionPage.vue
│   │   ├── ListePublicationsPage.vue
│   │   ├── DetailPublicationPage.vue
│   │   ├── PublierObjetPage.vue
│   │   ├── RecherchePage.vue
│   │   ├── ProfilPage.vue
│   │   ├── ModifierProfilPage.vue
│   │   ├── ConversationsPage.vue
│   │   └── DiscussionPage.vue
│   │
│   ├── router/
│   │   └── index.ts
│   │
│   ├── services/
│   │   ├── firebase.ts
│   │   ├── authService.ts
│   │   ├── utilisateurService.ts
│   │   ├── publicationService.ts
│   │   ├── categorieService.ts
│   │   ├── villeService.ts
│   │   ├── statutService.ts
│   │   ├── storageService.ts
│   │   ├── messageService.ts
│   │   └── notificationService.ts
│   │
│   ├── stores/
│   │   ├── authStore.ts
│   │   └── publicationStore.ts
│   │
│   ├── theme/
│   │   └── variables.css
│   │
│   ├── utils/
│   │   ├── date.ts
│   │   ├── validation.ts
│   │   └── constantes.ts
│   │
│   ├── App.vue
│   └── main.ts
│
├── .env
├── capacitor.config.ts
├── ionic.config.json
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## Rôle de chaque dossier

| Dossier | Rôle |
|---|---|
| `assets` | Images, logos et fichiers statiques |
| `components` | Composants réutilisables : carte de publication, filtre, badge, bouton |
| `composables` | Fonctions Vue réutilisables : authentification, publications, messages |
| `models` | Types TypeScript des données |
| `pages` | Écrans de l’application |
| `router` | Navigation entre les pages |
| `services` | Communication avec Firebase |
| `stores` | État global de l’application |
| `theme` | Couleurs, styles et thème Ionic |
| `utils` | Fonctions utilitaires : dates, validation, constantes |
| `android` | Projet Android généré par Capacitor |

## Exemple de fichier important

### `src/models/publication.model.ts`

```typescript
export type StatutPublication = "perdu" | "retrouve" | "recupere";

export interface Publication {
  id: string;
  titre: string;
  description: string;
  categorieId: string;
  villeId: string;
  statut: StatutPublication;
  localisation: string;
  photoUrls: string[];
  auteurId: string;
  auteurNom: string;
  datePublication: Date;
  dateTrouve?: Date;
}
```

### `src/services/publicationService.ts`

```typescript
import { collection, addDoc, getDocs, query, where } from "firebase/firestore";
import { db } from "./firebase";
import type { Publication } from "../models/publication.model";

const publicationsRef = collection(db, "publications");

export async function ajouterPublication(publication: Omit<Publication, "id">) {
  return await addDoc(publicationsRef, publication);
}

export async function obtenirPublications() {
  const snapshot = await getDocs(publicationsRef);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data()
  })) as Publication[];
}
```

## Ce que vous devez installer

```bash
npm install -g @ionic/cli
ionic start findit tabs --type vue --capacitor
cd findit
npm install firebase
npm install @capacitor/core @capacitor/cli
npm install @capacitor/camera @capacitor/geolocation
npm install @capacitor/push-notifications
```

Pour ajouter Android :

```bash
npm install @capacitor/android
npx cap add android
npx cap sync
npx cap open android
```

## Répartition des technologies

| Membre | Technologies principales |
|---|---|
| **Miranto** | Firebase Authentication, Firestore, Firebase Storage, TypeScript, Vue 3, Ionic Vue |
| **Loïc** | Firestore, TypeScript, Vue 3, Ionic Vue, Capacitor, Firebase Storage, Firebase Cloud Messaging |

## Ce qu’il faut retenir

Tu as besoin de :

- **TypeScript** pour écrire le code.
- **Vue 3** pour créer les interfaces.
- **Ionic Vue** pour le design mobile.
- **Firebase** pour le backend.
- **Firestore** pour la base de données.
- **Firebase Storage** pour les images.
- **Capacitor** pour accéder à la caméra, au GPS et aux notifications.
- **Android Studio** pour compiler et générer l’APK.
- **Git** pour travailler à deux.

La structure des dossiers est importante, mais elle ne remplace pas le code. Elle sert à organiser les fichiers, tandis que les langages et frameworks permettent de créer réellement l’application.
