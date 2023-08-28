import React, { useState, useEffect } from 'react'
import { useMutationHasura } from '../utils/react/hooks'
/*Composants*/
import CustomButton from '../components/button'
import ModalSuccess from '../components/message_success_modal'
/*Toast*/
import { toast } from 'react-toastify'
/*Base de données*/
import {
  LIEN_API,
  COLUMN_ID,
  COLUMN_NAME,
  COLUMN_MODEL,
  COLUMN_SERIAL_NUMBER,
  CHECK_MACHINERY_RESERVATION,
  DELETE_MACHINERY,
} from '../utils/database/query'
/*Style*/
import '../styles/admin_machinery.css'
import colors from '../utils/styles/color'

function FormDelMachinery({ closeModal, selectedMachinery }) {
  //Erreur car réservations existantes.
  const [errorReservation, setErrorReservation] = useState(false)
  //Erreur lors de la vérification de l'existence de réservation(s).
  const [errorCheck, setErrorCheck] = useState(false)
  //Erreur et succès lors de l'enregistrement.
  const [errorMutation, setErrorMutation] = useState(false)
  const [successMutation, setSuccessMutation] = useState(false)
  //Pour savoir si on affiche le formulaire ou l'icône de succès.
  const [showForm, setShowForm] = useState(true)

  //Permet d'envoyer une requête de mutation (DELETE) à Hasura.
  const { doMutation } = useMutationHasura(LIEN_API)

  /*FONCTION AGISSANT À L'ENVOI DU FORMULAIRE*/
  async function handleClick(e) {
    e.preventDefault()

    //Vérification de l'existence de réservation(s) en cours et/ou futures pour la machine.
    const machineryExists = await checkReservation()

    //Suppression de la machine si elle n'a pas de réservation.
    if (!machineryExists) {
      await deleteMachinery()
    }
  }

  /*VÉRIFICATION DE L'EXISTENCE DE RÉSERVATION(S) POUR LA MACHINE*/
  const checkReservation = async () => {
    try {
      /*const reservationExists = await doMutation(CHECK_CATEGORY_MACHINERY, {
        machineryId: selectedMachinery?.[COLUMN_ID],
      }) //À MODIFIER !!!!!

      //Si la machine a (au moins) une réservation.
      if (reservationExists?.machinerie_reservation?.length > 0) {
        setErrorReservation(true) //Pour afficher un toast.
        return true //Pour ne pas supprimer la machine.
      } else {
        //Si aucune réservation.
        return false
      }*/
      /*ERREUR*/
    } catch (err) {
      console.error(err)
      setErrorCheck(true) //Pour afficher un toast.
    }
  }

  /*VÉRIFICATION POUR LE TOAST D'ERREUR*/
  useEffect(() => {
    //Affichage d'un toast en cas d'erreur.
    if (errorReservation) {
      toast.error(
        'Impossible de supprimer cette machine car elle a des réservations.',
      )
      setErrorReservation(false) //Pour pouvoir afficher le toast à nouveau.
    }
    if (errorCheck) {
      toast.error(
        "Erreur lors de la vérification de l'existence de réservation(s).",
      )
      setErrorCheck(false) //Pour pouvoir afficher le toast à nouveau.
    }
    if (errorMutation) {
      toast.error('Erreur lors de la suppression de la machine.')
      setErrorMutation(false) //Pour pouvoir afficher le toast à nouveau.
    }
  }, [errorReservation, errorCheck, errorMutation])

  /*SUPPRESSION DE LA MACHINE DE LA BASE DE DONNÉES*/
  async function deleteMachinery() {
    try {
      const deleteMachinery = await doMutation(DELETE_MACHINERY, {
        machineryId: selectedMachinery?.[COLUMN_ID],
      })
      //Si la suppression a fonctionné.
      if (deleteMachinery?.delete_machinerie?.affected_rows > 0) {
        setSuccessMutation(true) //Pour afficher un toast + réinitialisation des variables.
      }
      /*ERREUR*/
    } catch (err) {
      console.error(err)
      setErrorMutation(true) //Pour afficher un toast.
    }
  }

  /*TOAST DE SUCCÈS ET RÉINITIALISATION DES VARIABLES*/
  useEffect(() => {
    if (successMutation) {
      toast.success('Machine supprimée.')

      //Réinitialisation des variables.
      setErrorReservation(false)
      setErrorCheck(false)
      setErrorMutation(false)
      setSuccessMutation(false)

      //Affichage de l'icône de succès.
      setShowForm(false)

      //Fermeture de la modale + rafraîchissement après 3s.
      setTimeout(() => {
        closeModal()
        window.location.reload()
      }, 3000)
    }
  }, [successMutation, closeModal])

  return (
    <div>
      {showForm ? (
        /*Formulaire de suppression*/
        <>
          <p>Êtes-vous sûr(e) de vouloir supprimer cette machine ?</p>
          <form onSubmit={handleClick}>
            <ul>
              <li>{selectedMachinery?.[COLUMN_NAME]}</li>
              <ul>
                {/*Si le modèle est vide, ne pas l'afficher.*/}
                {selectedMachinery?.[COLUMN_MODEL] ? (
                  <li>Modèle : {selectedMachinery?.[COLUMN_MODEL]}</li>
                ) : null}
                {/*Si le numéro de série est vide, ne pas l'afficher.*/}
                {selectedMachinery?.[COLUMN_SERIAL_NUMBER] ? (
                  <li>
                    Numéro de série :{' '}
                    {selectedMachinery?.[COLUMN_SERIAL_NUMBER]}
                  </li>
                ) : null}
              </ul>
            </ul>
            <div className="delete-buttons">
              <CustomButton
                type="submit"
                color={colors.redButton}
                hovercolor={colors.redButtonHover}
              >
                Oui
              </CustomButton>
              <CustomButton
                functionclick={() => {
                  closeModal()
                }}
                color={colors.greyButton}
                hovercolor={colors.greyButtonHover}
              >
                Annuler
              </CustomButton>
            </div>
          </form>
        </>
      ) : (
        /*Icône de succès*/
        <ModalSuccess />
      )}
    </div>
  )
}

export default FormDelMachinery

/*À FAIRE :
- Toasts de succès et d'erreur.
- Vérifier si la machine a des réservations en cours et/ou futures.
- Vérifier si la machine a des réservations passées et les supprimer avant de supprimer la machine.
- Vérifier si la machine a des bris et les supprimer avant de supprimer la machine.*/
