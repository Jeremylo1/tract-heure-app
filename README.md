# tract-heure 🗃️🗓️

*Single-page application (SPA)* en React permettant de gérer un inventaire de machines ainsi que leurs réservations.

## Create React App

Ce projet a été initié avec Create React App.

`yarn start` pour exécuter l'application en mode développement ([http://localhost:3000](http://localhost:3000)).\
`yarn build` pour construire l'application pour la production. Ainsi, l'application sera prête à être déployée.

Pour en savoir plus, voir la [documentation](https://facebook.github.io/create-react-app/docs/getting-started).

## Base de données

Hasura a été utilisée pour créer une API GraphQL facilitant la communication entre notre application et notre base de données PostgreSQL.

## Gestion du CSS

- Fichiers CSS.
- [Styled Components](https://styled-components.com/) (bibliothèque JavaScript).
- [Bulma](https://bulma.io/) (framework CSS).

## Types d’usager

Il existe deux types d’usager : l’utilisateur et l’administrateur.

### `Fonctionnalités d’un utilisateur`

- Système de connexion / déconnexion (rudimentaire).
- Interface utilisateur (simple et efficace).
- Design responsive.
- Accueil : 
  - Visualisation des réservations en cours, futures et passées.
  - Annulation d’une réservation.
- Inventaire : 
  - Visualisation de la machinerie disponible, par catégorie.
  - Description brève de chacune des machines (nom, modèle, etc.).
  - Réservation d’une machine.
  - Consultation des horaires d’une machine (i.e. voir les disponibilités).
  - Signalement de bris.
  - Recherche par mots-clés.
- Calendrier : 
  - Visualisation des réservations sous forme de calendrier.
  - Visualisation des détails d’une réservation sous forme de fenêtre modale.
  - Recherche par mots-clés.

### `Fonctionnalités d’un administrateur`

En plus d’avoir toutes les fonctionnalités précédentes, il a aussi :
- Ajout, suppression et modification d’une catégorie de machinerie.
- Ajout, suppression et modification d’une machine.
- Visualisation et gestion de toutes les réservations existantes.
- Visualisation, ajout et suppression des bris.
