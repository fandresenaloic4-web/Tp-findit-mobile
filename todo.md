# tp findit application mobile de recherche de objet et pub


* []authentification:
    * []page:
        * []page de login (sans mot de passe mais input nom et numero seulement,sans inscription)
    * []traitement:
        * []verification si deja dans la base.si deja existant entrer dans la page acceuil pas de insertion
        * []verifier si exisant le numero si nom different retourne une erreur "numero deja utiliser verifier votre confidentialite"
        * []si non inserer le nom et le numero et inserer
    
    * bdd:
        * utiliser le table utilisateurs

* []publier objet
    * []page
        * []page de creeation de pub objet:
            * nom_utilisateur qui a publier(utlisateur connecter)
            * nom de l'objet
            * description objet
            * image de l'objet(on peut selectionnner plusieurs image)
            * ville/localisation
            * statut(part defaut perdu sans entrer dans la page)
            * date
            * deroulante categorie
        * []liste des tous les pub dans cette application
            * [] filtre par categorie
            * [] filtre par ville localisation
            * [] filtre par date
            * [] filtre par statut
        * [] liste de pub de l'utilisateurs connecter
    
    * [] traitement:prend tous les valeurs dans le formulaire
        * fonction:   
            * verifierDonnes():verifier chaque champ de formulaire
            * inserer_pub():inserer les donnes de publication avec statut par defaut perdu
            * listesPub(): liste de tous les publication avec les filtre si possible
            * listePub:  liste de publication de l'utilisateurs connecter

    * bdd:
        * publication
        * categorie
        * utilisateurs
        * image_objet
        * mouvement_statut
        * staut
        * ville
        
