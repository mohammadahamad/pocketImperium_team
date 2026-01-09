# README - ALDACO_PROJECT_GLO2 - Sujet B

## Description

Le SRYEM (Sealand Republic Youth Education Ministry) a lancé un projet de transformation numérique visant à moderniser les méthodes d'évaluation dans ses établissements. Pour cela, un utilitaire en ligne de commande a été mis à disposition, permettant aux enseignants de composer, gérer, simuler et visualiser des examens au format GIFT, tout en s'identifiant via un fichier VCard.

## Liste des commandes disponibles

A partir du cahier des charges contenant 10 spécifications fonctionnelles (notées F1 à F10), nous avons créé les fonctions suivantes :

searchQuestion : Rechercher une question dans la banque de questions à partir d'un mot-clé, d'un ID ou d'un type de questions (F1).

createExam : Composer un examen à partir d'une liste d'ID représentant l'identifiant des questions souhaitées (F3).
Cette fonction répond également à des spécifications sous-jacentes : F2 (affichage détaillée d'une question), F4 (génération d'un fichier examen .gift), F5 (vérification des contraintes d'unicité et de taille) et sauvegarde du fichier (F10).
Puisque cela sera nécessaire pour la fonction compareExam, une sous-fonction (detectQuestionType) permet, à la création d'un examen, de générer son profil au format CSV, stockant le nombre de questions pour chaque type.

createVcard : Créer un fichier Vcard .vcf à partir de données utilisateurs : nom, adresse mail, école, et optionnellement son numéro de téléphone (F6, F10).

testExam : Simuler un examen qui permet de comparer un fichier regroupant les réponses d'un étudiant aux réponses de l'examen et d'obtenir une note ainsi que la liste des bonnes ou mauvaises réponses de l'utilisateur (F7).

compareExam : Cette fonction répond à 2 exigences : le cahier des charges demande d'obtenir des statistiques (selon les types de question) sur un seul fichier (F8) et de comparer deux fichiers ou plus selon les types de questions également (F9). Nous avons regroupé ces deux spécifications dans cette fonction qui prend en paramètre d'entrée un fichier (F8) ou plusieurs fichiers (F9). Ces fichiers correspondent aux profils d'examen en CSV. Cette fonction permet donc d'afficher un histogramme de statistiques de la répartition de types de questions dans un ou plusieurs fichiers.
Une fois l'histogramme créé et enregistré (F10), l'utilisateur peut demander une différence relative entre 2 fichiers (parmi la liste fournie en paramètre d'entrée) pour un type de questions en particulier (F9). Cette différence correspond à ((percent2 - percent1)/percent1)\*100.

## Format de données

### Format GIFT (simplifié – ABNF)

gift-question = [ "::" title "::" ] text "{" answer-list "}"
title = 1*(CHAR)
text = 1*(CHAR)
answer-list = 1*(answer)
answer = ("=" / "~") text [ "#" feedback ]
feedback = *(CHAR)

### Format VCard (RFC 6350 - simplifié)

vcard = "BEGIN:VCARD" CRLF
"VERSION:4.0" CRLF
"FN:" full-name CRLF
"EMAIL:" email CRLF
"END:VCARD" CRLF

### Format Profil

type, nombre (CSV simplifié)

## Modifications par rapport au cahier des charges

- Suppression de question : cette fonctionnalité fait partie de la sémantique de données mais n'est pas indiquée dans les exigences. Nous n'avons donc pas implémenté cette fonctionnalité.
- F1 : les entrées demandées étaient mot-clé, type, identifiant ou texte partiel. Nous avons réuni mot-clé et texte partiel en laissant la possibilité d'indiquer un ou plusieurs mots-clés.
- F3 : la fonction permettant la constitution d'un ensemble de questions pour un examen ne prend pas que les identifiants sélectionnés en paramètres, mais également le nom de l'examen et l'auteur.
- F8 et F9 invitaient à créer deux fonctions séparées, mais F8 n'étant qu'un cas particulier de F9 avec un nombre de fichier en entrée égal à un, nous avons répondu à ces deux exigences en une seule fonction compareExam afin d'optimiser la lisiblité et cohérence du code. L'entrée souhaitée (fichier GIFT) correspond à celle lors de la création d'examen où l'on transforme les données en CSV dans la fonction pour afficher l'histogramme plus lisiblement.
- La différence relative demandée (F9) a été traitée de manière plus lisible de façon à comparer deux fichiers pour un type à la fois dans compareExam et non pas pour tous les types de chaque fichier ce qui aurait généré une suite de données affichées immense.

## Installation

npm install

Pour installer Vega, Vega-Lite et Canvas :
npm install vega vega-lite canvas

Pour les tests :
npm test

## Utilisation

Se placer dans le dossier ALDACO_PROJECT_GLO2 pour exécuter les commandes suivantes.
Les fonctions sont déclarées dans caporalCli.js et implémentées dans exam.js, search.js et vcard.js. Les tests unitaires associés ont été rédigés dans le dossier spec.

### Chercher une question dans la banque de données :

node caporalCli.js searchQuestion ["kw"] ["id"] ["type"]
exemple :
node caporalCli.js searchQuestion "non"
node caporalCli.js searchQuestion "non" "non"
node caporalCli.js searchQuestion "non" "non" "non"

### Créer un examen :

node caporalCli.js createExam ["Nom examen"] ["Liste des IDs séparés par une virgule"] ["Nom auteur"]
exemple :
node caporalCli.js createExam "TestExam" "EM U5 p34 Gra1.1,EM U5 p34 Gra1.2,EM U5 p34 Gra1.3,EM U5 p34 Gra1.4,EM U5 p34 Gra1.5,EM U5 p34 Gra1.6,EM U5 p34 Gra1.7,EM U5 p34 Gra1.8,EM U5 p34 Gra2.1,EM U5 p34 Gra2.2,EM U5 p34 Gra2.3,EM U5 p34 Gra2.4,EM U5 p34 Gra2.5,EM U5 p34 Gra2.6,EM U5 p34 Gra2.7" "TestAuteur"

Info test unitaire :
Le test de cette commande est irréalisable en test unitaire car la commande génère une succession d'interactions avec l'utilisateur dans le terminal, bloquant le terminal. Par conséquent, le test serait forcément résulté d'un échec car le test a mis trop de temps à se terminer.

### Simuler un examen :

node CaporalCli.js testExam ["examPath"] ["fileUserAnswers"]
exemple :
node CaporalCli.js testExam "./res/SujetB_data/EM-U4-p32_33-Review.gift" "answer[EM-U4-p32_33-Review].txt"

### Créer une fiche enseignant :

node caporalCli.js createVcard ["nom complet"] ["e-mail"] ["école"] ["numéro de téléphone - optionnel"]
exemple :
node caporalCli.js createVcard "Aldaco Co" "aldaco.co@example.com" "UTT" "0612345678"

### Afficher des statistiques sur un ou plusieurs fichiers :

node caporalCli.js compareExam [noms des fichiers à la suite séparés par un espace]
exemple :
node caporalCli.js compareExam test1.csv test2.csv

Info test unitaire :
Le test de cette commande est irréalisable en test unitaire car la commande génère une interaction (pour la différence relative) avec l'utilisateur dans le terminal, bloquant le terminal. Par conséquent, le test serait forcément résulté d'un échec car le test a mis trop de temps à se terminer.

## Versions

Version 1.0 :
Création des commandes createExam, searchQuestion, createVcard, testExam, statExam dans caporalCli.js.

Version 1.1 :
Découpage et gestion de la base de données pour la rendre utilisable.

Version 1.2 :
Implémentation des fonctions createExam et searchQuestion.

Version 1.3 :
Implémentation Vcard.

Version 1.4 :
Implémentation visualisation avec Vega-Lite.

Version 1.5 :
Création commande compareExam et implémentation.

Version 1.6 :
Unification de statExam et compareExam dans statExam et création et implémentation de detectQuestionType pour la création de profils CSV lors de la création d'un examen dans createExam. Suppression de statExam.

Version 1.7 :
Ajout du rapport comparatif dans compareExam.

Version 1.8 :
Implémentation de testExam.

Version 1.9 :
Création d'un dossier spec pour réaliser les tests unitaires.

## Liste des contributeurs

Equipe pour le cahier des charges : JS_Force
Equipe de développement : ALDACO (Damaris Barbot, Marco Orfao, Albane Verschelde)
