/*INFOS SUR LA BASE DE DONNÉES (À MODIFIER AU BESOIN)*/

//Lien de l'API GraphQL.
export const LIEN_API = 'https://champion-tiger-15.hasura.app/v1/graphql'

//Nom des tables.
export const TABLE_CATEGORY = 'machinerie_categorie'
export const VUE_MACHINERY = 'machinerie_view'

//Nom des colonnes (en lien avec la machinerie).
export const COLUMN_ID = 'id'
export const COLUMN_NAME = 'nom'
export const COLUMN_MODEL = 'modele'
export const COLUMN_SERIAL_NUMBER = 'num_serie'
export const COLUMN_STATUS = 'statut_nom'
export const COLUMN_CATEGORY = 'categorie_id'
export const COLUMN_DATE = 'date_acquisition'
export const COLUMN_PRICE = 'prix_achat'
export const COLUMN_HOURS = 'heure_utilisation'
export const COLUMN_COMMENT = 'commentaire'
export const COLUMN_LOCATION = 'localisation'

//Requêtes GraphQL.
export const INSERT_MACHINERY = `
  
`

export const DELETE_MACHINERY = `
  
`

export const UPDATE_MACHINERY = `
  
`

export const INSERT_CATEGORY = `
  
`

export const DELETE_CATEGORY = `
  
`
