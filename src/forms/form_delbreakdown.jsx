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
  COLUMN_MACHINERY_NOM,
  COLUMN_STATUS_BRIS_NOM,
  COLUMN_DESCRIPTION,
  COLUMN_REMARQUES,
  DELETE_BREAKDOWN,
} from '../utils/database/query'
/*Style*/
import '../styles/admin_category.css'
import colors from '../utils/styles/color'

function FormDelBreakdown({ closeModal, selectedMachineryBreakdown }) {
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

    //Suppression du bris.
    await deleteBreakdown()
  }

  /*VÉRIFICATION POUR LE TOAST D'ERREUR*/
  useEffect(() => {
    //Affichage d'un toast en cas d'erreur.
    if (errorMutation) {
      toast.error('Erreur lors de la suppression du bris.')
      setErrorMutation(false) //Pour pouvoir afficher le toast à nouveau.
    }
  }, [errorMutation])

  /*SUPPRESSION DU BRIS DE LA BASE DE DONNÉES*/
  const deleteBreakdown = async () => {
    try {
      const deleteBreakdown = await doMutation(DELETE_BREAKDOWN, {
        breakdownId: selectedMachineryBreakdown?.[COLUMN_ID],
      })
      //Si la suppression a fonctionné.
      if (deleteBreakdown?.delete_machinerie_bris_by_pk?.id) {
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
      toast.success('Bris supprimé.')

      //Réinitialisation des variables.
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
        /*Formulaire de suppression.*/
        <>
          <p>Êtes-vous sûr(e) de vouloir supprimer ce bris ?</p>
          <form onSubmit={handleClick}>
            <ul>
              <li>
                Bris #{selectedMachineryBreakdown?.[COLUMN_ID]} {'['}
                {selectedMachineryBreakdown?.[COLUMN_STATUS_BRIS_NOM]}
                {'] : '}
                {selectedMachineryBreakdown?.[COLUMN_MACHINERY_NOM]}
              </li>
              {/*  Si la description est vide, ne pas l'afficher. */}
              {selectedMachineryBreakdown?.[COLUMN_DESCRIPTION] ? (
                <li>
                  {'Description : '}
                  {selectedMachineryBreakdown?.[COLUMN_DESCRIPTION]}
                </li>
              ) : null}
              {/* Si les remarques sont vides, ne pas les afficher. */}
              {selectedMachineryBreakdown?.[COLUMN_REMARQUES] ? (
                <li>
                  {'Remarques : '}
                  {selectedMachineryBreakdown?.[COLUMN_REMARQUES]}
                </li>
              ) : null}
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
        /*Icône de succès.*/
        <ModalSuccess />
      )}
    </div>
  )
}

export default FormDelBreakdown
