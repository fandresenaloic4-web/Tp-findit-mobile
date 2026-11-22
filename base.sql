CREATE DATABASE findit;
use findit;

CREATE TABLE categorie(
    id INT PRIMARY KEY AUTO_INCREMENT,
    libelle VARCHAR(50),
);

CREATE TABLE utlisateurs(
    id INT PRIMARY KEY AUTO_INCREMENT,
    nom VARCHAR(50),
    telephone VARCHAR(10),
);

statut(id,libelle)

ville(id,libelle)


CREATE TABLE publication(
    id INT PRIMARY KEY AUTO_INCREMENT,
    utlisateurs_pub_id INT,
    categorie_id INT,
    objet VARCHAR(100),
    localisation text,
    ville_id INT fk
    descris text,
    date_pub Date,
    date_trouve Date,
    statut_objet_id INT,
    foreign key utlisateurs(id)
    fk categorie(id)
);

image_objet(id,publication_id(fk),nom_image)

mouvement_statut_pub(id,publication_id,id_statut,date)

message(id,expediteur_id,destinataire_id,contenue,date_envoi)

