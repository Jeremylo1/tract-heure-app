/*INFOS SUR LA BASE DE DONNÉES (À MODIFIER AU BESOIN)*/

/*Lien de l'API GraphQL.*/
export const LIEN_API = 'https://champion-tiger-15.hasura.app/v1/graphql'

/*Nom des tables.*/
export const TABLE_CATEGORY = 'machinerie_categorie'
export const TABLE_STATUS = 'machinerie_statut'
export const VUE_MACHINERY = 'machinerie_view'
export const VUE_RESERVATION = 'machinerie_reservations_view'
export const VUE_BREAKDOWN = 'machinerie_bris_view'

/*Nom des colonnes (en lien avec la machinerie).*/
export const COLUMN_ID = 'id'
export const COLUMN_NAME = 'nom'
export const COLUMN_CATEGORY_ID = 'categorie_id'
export const COLUMN_STATUS = 'statut_nom'
export const COLUMN_STATUS_ID = 'statut_id'
export const COLUMN_MODEL = 'modele'
export const COLUMN_SERIAL_NUMBER = 'num_serie'
export const COLUMN_BARCODE = 'code_barres'
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

/*Nom des colonnes (en lien avec les bris).*/
export const COLUMN_DATE_BRIS = 'date_bris'
export const COLUMN_DATE_REPARATION = 'date_reparation'
export const COLUMN_REMARQUES = 'remarques'
export const COLUMN_REPARATION_ESTIMEE = 'reparation_estimee'
export const COLUMN_RESPONSABLE_ID = 'responsable_id'
export const COLUMN_MACHINERY_ID = 'machinerie_id'
export const COLUMN_STATUS_BRIS_NOM = 'bris_statut_nom'
export const COLUMN_MACHINERY_NOM = 'machinerie_nom'

/*Requêtes GraphQL.*/
//Permet d'ajouter une machine.
export const INSERT_MACHINERY = `
  mutation InsertMachinery($name: String!, $model: String, $serialNumber: String, $statusId: Int!, $categoryId: Int!, $dateAcquisition: timestamptz, $price: numeric, $totalTime: numeric!, $comment: String, $barcode: String, $location: String) {
        insert_machinerie(objects:[{nom: $name, modele: $model, num_serie: $serialNumber, statut_id: $statusId, categorie_id: $categoryId, date_acquisition: $dateAcquisition, prix_achat: $price, heure_utilisation: $totalTime, commentaire: $comment, code_barres: $barcode, localisation: $location}]) {
            affected_rows
        }
    }
`

//Permet de supprimer une machine.
export const DELETE_MACHINERY = `
    mutation DeleteMachinery($machineryId: Int!) {
        delete_machinerie(where: {id: {_eq: $machineryId}}) {
        affected_rows
        }
    }
`
//Permet de vérifier l'existence de réservation(s) pour une machine.
export const CHECK_MACHINERY_RESERVATION = `
    query CheckMachineryReservation($machineryId: Int!) {
        machinerie_reservation(where: {
            machinerie_id: {_eq: $machineryId}
        }) {
            id
        }
    }
`

//Permet de modifier une machine.
export const UPDATE_MACHINERY = `
    mutation UpdateMachinery($machineryId: Int!, $name: String!, $model: String, $serialNumber: String, $statusId: Int!, $categoryId: Int!, $dateAcquisition: timestamptz, $price: numeric, $totalTime: numeric!, $comment: String, $barcode: String, $location: String) {
        update_machinerie(where: {id: {_eq: $machineryId}}, _set: {nom: $name, modele: $model, num_serie: $serialNumber, statut_id: $statusId, categorie_id: $categoryId, date_acquisition: $dateAcquisition, prix_achat: $price, heure_utilisation: $totalTime, commentaire: $comment, code_barres: $barcode, localisation: $location}) {
        affected_rows
        }
    }
`

//Permet d'ajouter une catégorie.
export const INSERT_CATEGORY = `
    mutation InsertCategory($name: String!) {
        insert_machinerie_categorie(objects: {nom: $name}) {
        affected_rows
        }
    }
`

//Permet de supprimer une catégorie.
export const DELETE_CATEGORY = `
    mutation DeleteCategory($categoryId: Int!) {
        delete_machinerie_categorie(where: {id: {_eq: $categoryId}}) {
        affected_rows
        }
    }
`

//Permet de vérifier l'existence de machine(s) pour une catégorie.
export const CHECK_CATEGORY_MACHINERY = `
    query CheckCategoryMachinery($categoryId: Int!) {
        machinerie(where: {
            categorie_id: {_eq: $categoryId}
        }) {
            id
        }
    }
`

//Permet de modifier une catégorie.
export const UPDATE_CATEGORY = `
    mutation UpdateCategory($categoryId: Int!, $name: String!) {
        update_machinerie_categorie(where: {id: {_eq: $categoryId}}, _set: {nom: $name}) {
        affected_rows
        }
    }
`

//Permet d'obtenir les statuts de bris.
export const GET_BREAKDOWN_STATUS = `
    query GetBreakdownStatus {
        bris_statut {
            ${COLUMN_ID}
            ${COLUMN_NAME}
            ${COLUMN_DESCRIPTION}
        }
    }
`

//Permet d'obtenir tous les bris (récent à ancien).
export const GET_ALL_BREAKDOWN = `
    query GetAllBreakdown {
        ${VUE_BREAKDOWN}(order_by: {date_bris: asc}) {
            ${COLUMN_ID}
            ${COLUMN_MACHINERY_ID}
            ${COLUMN_RESPONSABLE_ID}
            ${COLUMN_STATUS_ID}
            ${COLUMN_DATE_BRIS}
            ${COLUMN_DESCRIPTION}
            ${COLUMN_DATE_REPARATION}
            ${COLUMN_REPARATION_ESTIMEE}
            ${COLUMN_REMARQUES}
            ${COLUMN_STATUS_BRIS_NOM}
            ${COLUMN_MACHINERY_NOM}
        }
    }
`

//Permet d'obtenir les bris d'une machine (récent à ancien).
export const GET_MACHINE_BREAKDOWN = `
    query GetMachineBreakdown($machineryId: Int!) {
        ${VUE_BREAKDOWN}(where: {machinerie_id: {_eq: $machineryId}}, order_by: {date_bris: asc}) {
            ${COLUMN_ID}
            ${COLUMN_MACHINERY_ID}
            ${COLUMN_RESPONSABLE_ID}
            ${COLUMN_STATUS_ID}
            ${COLUMN_DATE_BRIS}
            ${COLUMN_DESCRIPTION}
            ${COLUMN_DATE_REPARATION}
            ${COLUMN_REPARATION_ESTIMEE}
            ${COLUMN_REMARQUES}
            ${COLUMN_STATUS_BRIS_NOM}
            ${COLUMN_MACHINERY_NOM}
        }
    }
`

//Permet de supprimer une réservation.
export const DELETE_RESERVATION = `
    mutation DeleteReservation($id: Int!) {
        delete_machinerie_reservation_by_pk(id: $id) {
        id
        }
    }
`

//Permet de supprimer un bris.
export const DELETE_BREAKDOWN = `
    mutation DeleteBreakdown($id: Int!) {
        delete_machinerie_bris_by_pk(id: $id) {
        id
        }
    }
`

//Permet de supprimer tout les bris d'une machine.
export const DELETE_ALL_MACHINE_BREAKDOWN = `
    mutation DeleteAllMachineBreakdown($machineryId: Int!) {
        delete_machinerie_bris(where: {machinerie_id: {_eq: $machineryId}}) {
        affected_rows
        }
    }
`

//Permet d'obtenir toutes les réservations (récent à ancien).
export const GET_ALL_RESERVATION = `
    {
        ${VUE_RESERVATION}(order_by: {${COLUMN_DATE_DEBUT}: asc}) {
            ${COLUMN_ID}
            ${COLUMN_NAME}
            ${COLUMN_DATE_DEBUT}
            ${COLUMN_DATE_FIN}
            ${COLUMN_TYPE}
            ${COLUMN_DESCRIPTION}
            ${COLUMN_MODEL}
        }
    }
`

//Permet d'obtenir les réservations d'un utilisateur (récent à ancien).
export const GET_RESERVATION = `
    query GetReservation($userId: String!) {
        ${VUE_RESERVATION}(where: {utilisateur_id: {_eq: $userId}}, order_by: {${COLUMN_DATE_DEBUT}: asc}) {
            ${COLUMN_ID}
            ${COLUMN_NAME}
            ${COLUMN_DATE_DEBUT}
            ${COLUMN_DATE_FIN}
            ${COLUMN_TYPE}
            ${COLUMN_DESCRIPTION}
            ${COLUMN_MODEL}
        }
    }
`

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
