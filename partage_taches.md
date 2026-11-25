# FindIt — Partage des tâches

**Projet :** Application mobile *FindIt* — objets perdus et retrouvés  
**Équipe :** Miranto et Loïc  
**Technologies :** Firebase, Cloud Firestore, Vue 3, Ionic Vue, TypeScript, Capacitor, Android Studio  

## Objectif du projet

FindIt permet aux utilisateurs de publier des objets perdus ou retrouvés, de les rechercher par catégorie, lieu, ville ou statut, puis de contacter la personne concernée.

Chaque membre doit pouvoir travailler de manière **indépendante** tout en respectant la même structure du projet, les mêmes modèles de données et les mêmes conventions de code.

## Répartition générale

| Domaine | Responsable principal | Tâches complémentaires |
|---|---|---|
| Configuration du projet, authentification, profil utilisateur | **Miranto** | Tests et revue du code |
| Publications, catégories, recherche et filtres | **Loïc** | Tests et revue du code |
| Photos, Firebase Storage, affichage des images | **Miranto** | Intégration dans les écrans de publication |
| Statuts, historique des changements, notifications | **Loïc** | Intégration dans les écrans de publication |
| Messagerie entre utilisateurs | **Miranto** | Interface et navigation |
| Géolocalisation et carte | **Loïc** | Affichage dans les annonces |
| Sécurité Firestore et Storage | **Miranto** | Tests des règles |
| Interface, design, tests Android et déploiement | **Les deux** | Répartition selon les écrans |

## Règles de travail communes

Avant de commencer, Miranto et Loïc doivent créer ensemble :

- Le dépôt Git du projet.
- La structure des dossiers Ionic Vue.
- Le projet Firebase et la connexion à Firestore.
- Les variables d’environnement Firebase.
- Les modèles TypeScript communs.
- Les conventions de nommage des fichiers, composants et collections.

### Structure de dossiers conseillée

```text
src/
  assets/
  components/
  composables/
  models/
  pages/
  router/
  services/
  stores/
  theme/
  utils/
```

### Conventions à respecter

- Utiliser TypeScript dans tous les fichiers.
- Nommer les composants en `PascalCase`, par exemple `PublicationCard.vue`.
- Nommer les services en `camelCase`, par exemple `publicationService.ts`.
- Utiliser Firebase Authentication pour l’identification des utilisateurs.
- Ne jamais stocker de mot de passe en clair.
- Tester chaque fonctionnalité avant de fusionner dans la branche principale.
- Utiliser Git avec des branches séparées, par exemple `miranto/auth` et `loic/publications`.

---

# Tâches de Miranto

## 1. Configuration initiale

- [ ] Créer le projet Ionic Vue avec TypeScript.
- [ ] Initialiser le dépôt Git et créer la branche principale.
- [ ] Créer les branches de travail : `miranto/auth`, `miranto/profil`, `miranto/messages`.
- [ ] Installer Firebase dans le projet.
- [ ] Créer le projet Firebase dans la console Firebase.
- [ ] Ajouter Firebase Authentication.
- [ ] Ajouter Cloud Firestore.
- [ ] Ajouter Firebase Storage.
- [ ] Configurer les variables d’environnement Firebase.
- [ ] Créer le fichier de configuration Firebase.

**Livrable :** un projet Ionic Vue connecté à Firebase, avec l’authentification fonctionnelle.

## 2. Authentification

- [x] Créer la page d’accueil.
- [x] Créer la page de connexion.
- [x] Créer la page d’inscription.
- [x] Créer le formulaire d’inscription avec validation.
- [x] Créer le formulaire de connexion avec validation.
- [x] Gérer les erreurs d’authentification.
- [x] Créer un service `authService.ts`.
- [x] Créer un garde de route pour protéger les pages nécessitant une connexion.
- [x] Rediriger l’utilisateur vers la page d’accueil après connexion.
- [x] Permettre la déconnexion.
- [x] Gérer la session utilisateur au démarrage de l’application.

**Livrable :** inscription, connexion, déconnexion et protection des routes.

## 3. Profil utilisateur

- [ ] Créer la collection Firestore `utilisateurs`.
- [ ] Créer le modèle TypeScript `Utilisateur`.
- [ ] Créer le service `utilisateurService.ts`.
- [ ] Créer la page de profil.
- [ ] Afficher le nom, l’e-mail, le téléphone et la photo de profil.
- [ ] Permettre la modification du nom et du numéro de téléphone.
- [ ] Permettre le changement de photo de profil.
- [ ] Téléverser la photo de profil dans Firebase Storage.
- [ ] Mettre à jour l’URL de la photo dans Firestore.
- [ ] Créer la page de modification du profil.

**Livrable :** profil utilisateur complet avec modification des informations et photo.

## 4. Messagerie entre utilisateurs

- [ ] Créer la collection Firestore `conversations`.
- [ ] Créer la sous-collection `messages`.
- [ ] Créer le modèle TypeScript `Conversation`.
- [ ] Créer le modèle TypeScript `Message`.
- [ ] Créer le service `messageService.ts`.
- [ ] Créer la page de liste des conversations.
- [ ] Créer la page de discussion.
- [ ] Créer le formulaire d’envoi de message.
- [ ] Afficher les messages en temps réel avec Firestore.
- [ ] Marquer un message comme lu.
- [ ] Empêcher l’envoi d’un message vide.
- [ ] Afficher la date et l’heure des messages.
- [ ] Créer une conversation à partir d’une publication.

**Livrable :** messagerie simple entre deux utilisateurs, liée à une annonce.

## 5. Sécurité Firebase

- [ ] Écrire les règles Firestore pour les utilisateurs.
- [ ] Écrire les règles Firestore pour les conversations.
- [ ] Écrire les règles Firestore pour les messages.
- [ ] Empêcher la modification du profil d’un autre utilisateur.
- [ ] Empêcher la lecture des conversations par des utilisateurs non participants.
- [ ] Écrire les règles Firebase Storage pour les photos de profil.
- [ ] Limiter la taille et le type des images téléversées.
- [ ] Tester les règles avec plusieurs comptes utilisateurs.

**Livrable :** règles de sécurité Firestore et Storage fonctionnelles.

## 6. Interface de Miranto

- [ ] Créer la page d’accueil.
- [ ] Créer la page de connexion.
- [ ] Créer la page d’inscription.
- [ ] Créer la page de profil.
- [ ] Créer la page de modification du profil.
- [ ] Créer la page de liste des conversations.
- [ ] Créer la page de discussion.
- [ ] Créer les composants réutilisables : bouton, champ de saisie, carte utilisateur, avatar.
- [ ] Améliorer le design avec Ionic.

**Livrable :** écrans d’authentification, profil et messagerie.

---

# Tâches de Loïc

## 1. Modèle de données des publications

- [ ] Créer la collection Firestore `publications`.
- [ ] Créer le modèle TypeScript `Publication`.
- [ ] Créer le modèle TypeScript `Categorie`.
- [ ] Créer le modèle TypeScript `Ville`.
- [ ] Créer le modèle TypeScript `Statut`.
- [ ] Créer le service `publicationService.ts`.
- [ ] Créer le service `categorieService.ts`.
- [ ] Créer le service `villeService.ts`.
- [ ] Créer le service `statutService.ts`.
- [ ] Définir les types de statut : `perdu`, `retrouve`, `recupere`.

**Livrable :** modèles et services Firestore pour les publications.

## 2. Publication d’un objet

- [ ] Créer la page de publication d’un objet.
- [ ] Créer le formulaire de publication.
- [ ] Ajouter le champ titre de l’objet.
- [ ] Ajouter le champ description.
- [ ] Ajouter la sélection de catégorie.
- [ ] Ajouter la sélection de ville.
- [ ] Ajouter le champ de localisation.
- [ ] Ajouter la date de publication.
- [ ] Ajouter la date de découverte ou de perte.
- [ ] Ajouter le choix du statut : perdu, retrouvé ou récupéré.
- [ ] Valider les champs obligatoires.
- [ ] Enregistrer la publication dans Firestore.
- [ ] Rediriger vers la page de détail après publication.

**Livrable :** formulaire complet de publication d’un objet.

## 3. Liste et détail des publications

- [ ] Créer la page d’accueil des publications.
- [ ] Afficher la liste des publications récentes.
- [ ] Créer une carte visuelle pour chaque publication.
- [ ] Afficher la photo, le titre, la catégorie, la ville, la date et le statut.
- [ ] Créer la page de détail d’une publication.
- [ ] Afficher toutes les informations de l’objet.
- [ ] Afficher les photos de l’objet.
- [ ] Afficher les informations de l’auteur.
- [ ] Ajouter un bouton pour contacter l’auteur.
- [ ] Ajouter un bouton pour modifier la publication si l’utilisateur en est l’auteur.
- [ ] Ajouter un bouton pour supprimer la publication si l’utilisateur en est l’auteur.

**Livrable :** liste et détail des objets perdus ou retrouvés.

## 4. Recherche et filtres

- [ ] Créer une barre de recherche.
- [ ] Rechercher par titre ou description.
- [ ] Filtrer par catégorie.
- [ ] Filtrer par ville.
- [ ] Filtrer par statut : perdu, retrouvé, récupéré.
- [ ] Filtrer par date de publication.
- [ ] Combiner plusieurs filtres.
- [ ] Afficher un message lorsqu’aucun résultat n’est trouvé.
- [ ] Créer des index Firestore si nécessaire pour les requêtes.

**Livrable :** recherche et filtres fonctionnels.

## 5. Statuts et historique

- [ ] Créer la sous-collection `mouvementsStatut` dans une publication.
- [ ] Enregistrer chaque changement de statut.
- [ ] Afficher l’historique des statuts dans la page de détail.
- [ ] Permettre à l’auteur de changer le statut.
- [ ] Empêcher un autre utilisateur de modifier le statut.
- [ ] Afficher la date de chaque changement.
- [ ] Mettre à jour automatiquement le statut principal de la publication.

**Livrable :** gestion du cycle de vie d’un objet : perdu, retrouvé, récupéré.

## 6. Géolocalisation et carte

- [ ] Installer Capacitor Geolocation.
- [ ] Demander la permission d’accès à la localisation.
- [ ] Récupérer la position actuelle de l’utilisateur.
- [ ] Enregistrer la latitude et la longitude dans Firestore.
- [ ] Afficher la localisation sur une carte.
- [ ] Permettre à l’utilisateur de choisir un lieu sur la carte.
- [ ] Afficher la distance entre l’utilisateur et l’objet, si possible.
- [ ] Gérer le cas où la localisation est refusée.

**Livrable :** localisation des objets sur une carte.

## 7. Notifications

- [ ] Configurer Firebase Cloud Messaging.
- [ ] Demander la permission de notification.
- [ ] Enregistrer le token de notification de l’utilisateur.
- [ ] Envoyer une notification lorsqu’une nouvelle publication correspond à une recherche.
- [ ] Envoyer une notification lorsqu’une publication est mise à jour.
- [ ] Envoyer une notification lorsqu’un message est reçu.
- [ ] Gérer l’affichage des notifications dans l’application.

**Livrable :** notifications Firebase fonctionnelles.

## 8. Interface de Loïc

- [ ] Créer la page de publication.
- [ ] Créer la page de liste des publications.
- [ ] Créer la page de détail d’une publication.
- [ ] Créer la page de recherche et de filtres.
- [ ] Créer la page de carte.
- [ ] Créer les composants : carte de publication, filtre, badge de statut, liste de catégories.
- [ ] Améliorer le design avec Ionic.

**Livrable :** écrans de publication, recherche, détail et carte.

---

# Tâches communes

Ces tâches doivent être réalisées ensemble ou réparties également.

## Tests et qualité

- [ ] Tester l’inscription et la connexion.
- [ ] Tester la publication d’un objet perdu.
- [ ] Tester la publication d’un objet retrouvé.
- [ ] Tester la modification d’une publication.
- [ ] Tester la suppression d’une publication.
- [ ] Tester la recherche et les filtres.
- [ ] Tester l’upload et l’affichage des photos.
- [ ] Tester la messagerie entre deux comptes.
- [ ] Tester les notifications.
- [ ] Tester les règles de sécurité Firestore.
- [ ] Tester l’application sur un téléphone Android réel.
- [ ] Corriger les bugs identifiés.

## Android Studio et déploiement

- [ ] Ajouter Capacitor au projet.
- [ ] Générer le projet Android avec Capacitor.
- [ ] Ouvrir le projet dans Android Studio.
- [ ] Configurer le nom de l’application.
- [ ] Configurer l’icône de l’application.
- [ ] Tester l’application sur un émulateur Android.
- [ ] Tester l’application sur un téléphone physique.
- [ ] Générer un APK de test.
- [ ] Corriger les erreurs de compilation Android.
- [ ] Préparer la version finale de l’APK.

## Documentation du projet

- [ ] Rédiger le cahier des charges.
- [ ] Rédiger le diagramme de cas d’utilisation.
- [ ] Rédiger le diagramme de classes.
- [ ] Rédiger le diagramme de séquence.
- [ ] Documenter la structure Firestore.
- [ ] Documenter les règles de sécurité.
- [ ] Rédiger le manuel utilisateur.
- [ ] Préparer la présentation du projet.

---

# Répartition équilibrée

## Miranto

- Configuration Firebase.
- Authentification.
- Profil utilisateur.
- Messagerie.
- Photos de profil.
- Règles de sécurité Firestore et Storage.
- Pages : accueil, connexion, inscription, profil, conversations.

## Loïc

- Publications.
- Catégories, villes et statuts.
- Recherche et filtres.
- Photos des objets.
- Historique des statuts.
- Géolocalisation et carte.
- Notifications.
- Pages : publication, liste, détail, recherche, carte.

## Travail en commun

- Création du projet Ionic Vue.
- Structure Firestore.
- Tests sur Android.
- Corrections finales.
- Documentation.
- Déploiement de l’APK.

## Planning conseillé

| Semaine | Miranto | Loïc |
|---|---|---|
| Semaine 1 | Création du projet, Firebase, authentification | Modèles Firestore, services, structure des publications |
| Semaine 2 | Profil utilisateur et photo de profil | Formulaire de publication et enregistrement Firestore |
| Semaine 3 | Messagerie et conversations | Liste, détail, recherche et filtres |
| Semaine 4 | Règles de sécurité et tests | Statuts, historique, photos des objets |
| Semaine 5 | Finalisation de la messagerie | Géolocalisation, carte et notifications |
| Semaine 6 | Tests Android et corrections | Tests Android et corrections |
| Semaine 7 | Documentation et présentation | Documentation et présentation |

## Livrables finaux

- Application Android FindIt fonctionnelle.
- Inscription et connexion des utilisateurs.
- Publication d’objets perdus ou retrouvés.
- Upload et affichage des photos.
- Recherche et filtres.
- Gestion des statuts.
- Messagerie entre utilisateurs.
- Notifications.
- Règles de sécurité Firestore et Storage.
- APK Android généré avec Android Studio.
- Documentation technique et manuel utilisateur.
