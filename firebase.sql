utilisateurs/{userId}
  nom
  email
  telephone
  photoUrl

categories/{categorieId}
  libelle

villes/{villeId}
  libelle

publications/{publicationId}
  auteurId
  categorieId
  villeId
  statut
  objet
  description
  localisation
  datePublication
  dateTrouve
  photoUrls: []

publications/{publicationId}/mouvementsStatut/{mouvementId}
  statut
  dateChangement

conversations/{conversationId}
  publicationId
  participants: [userId1, userId2]

conversations/{conversationId}/messages/{messageId}
  expediteurId
  contenu
  dateEnvoi
  lu