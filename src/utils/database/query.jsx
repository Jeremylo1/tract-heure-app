/*INFOS SUR LA BASE DE DONNÉES (À MODIFIER AU BESOIN)*/

/*Lien de l'API GraphQL.*/
export const LIEN_API = 'https://champion-tiger-15.hasura.app/v1/graphql'

/*Nom des tables.*/
export const TABLE_CATEGORY = 'machinerie_categorie'
export const VUE_MACHINERY = 'machinerie_view'
export const VUE_RESERVATION = 'machinerie_reservations_view'

/*Nom des colonnes (en lien avec la machinerie).*/
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

/*Nom des colonnes (en lien avec les réservations).*/
export const COLUMN_DATE_DEBUT = 'date_debut'
export const COLUMN_DATE_FIN = 'date_fin'
export const COLUMN_TYPE = 'type'
export const COLUMN_DESCRIPTION = 'description'

/*Requêtes GraphQL.*/

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

export const DELETE_RESERVATION = `
    mutation DeleteReservation($id: Int!) {
        delete_machinerie_reservation_by_pk(id: $id) {
        id
        }
    }
`

export const GET_ALL_RESERVATION = `{${VUE_RESERVATION}{${COLUMN_ID} ${COLUMN_NAME} ${COLUMN_DATE_DEBUT} ${COLUMN_DATE_FIN} ${COLUMN_TYPE} ${COLUMN_DESCRIPTION}}}`

//Permet de créer une réservation.
export const INSERT_RESERVATION = `
    mutation InsertMachinerieReservation($machineryId: Int!, $userId: String!, $startDate: timestamptz!, $endDate: timestamptz!, $typeId: Int!, $userReservationComment: String) {
        insert_machinerie_reservation(objects:[{machinerie_id:$machineryId, utilisateur_id:$userId, date_debut: $startDate, date_fin: $endDate, type: $typeId, description: $userReservationComment}]) {
        affected_rows
        }
    }
`

//Permet de vérifier si la réservation est en conflit avec une autre réservation existante.
export const CHECK_RESERVATION_TIME_CONFLICT = `
    query GetReservations($machineryId: Int!, $startDateTime: timestamptz!, $endDateTime: timestamptz!) {
        machinerie_reservation(where: {
            machinerie_id: {_eq: $machineryId}, 
            date_debut: {_lte: $endDateTime},
            date_fin: {_gte: $startDateTime}
        }) {
            id
        }
    }
`

//Permet de récupérer les réservations à venir d'une machinerie.
export const GET_UPCOMING_RESERVATIONS = `
    query GetUpcomingReservations($machineryId: Int!, $currentDateTime: timestamptz!) {
        machinerie_reservation(
        where: {
            machinerie_id: {_eq: $machineryId}, 
            date_fin: {_gte: $currentDateTime}
        },
        order_by: {date_debut: asc}
        ) {
            date_debut
            date_fin
        }
    }  
`
