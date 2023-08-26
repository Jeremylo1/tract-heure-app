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
  CHECK_CATEGORY_MACHINERY,
  DELETE_CATEGORY,
} from '../utils/database/query'
/*Style*/
import '../styles/admin_category.css'
import colors from '../utils/styles/color'

function FormDelCategory({ closeModal, selectedCategory }) {
  //Erreur car machines existantes.
  const [errorMachinery, setErrorMachinery] = useState(false)
  //Erreur lors de la vérification de l'existence de machine(s).
  const [errorCheck, setErrorCheck] = useState(false)
  //Erreur et succès lors de l'enregistrement.
  const [errorMutation, setErrorMutation] = useState(false)
  const [successMutation, setSuccessMutation] = useState(false)
  //Pour savoir si on affiche le formulaire ou l'icône de succès.
  const [showForm, setShowForm] = useState(true)

  //Permet d'envoyer une requête de mutation (INSERT, UPDATE, DELETE) à Hasura.
  const { doMutation } = useMutationHasura(LIEN_API)

  /*FONCTION AGISSANT À L'ENVOI DU FORMULAIRE*/
  async function handleClick(e) {
    e.preventDefault()

    //Vérification de l'existence de machine(s) pour la catégorie.
    const machineryExists = await checkMachinery()

    //Suppression de la catégorie si elle est vide.
    if (!machineryExists) {
      await deleteCategory()
    }
  }

  /*VÉRIFICATION DE L'EXISTENCE DE MACHINE(S) POUR LA CATÉGORIE*/
  const checkMachinery = async () => {
    try {
      const machineryExists = await doMutation(CHECK_CATEGORY_MACHINERY, {
        categoryId: selectedCategory?.[COLUMN_ID],
      })

      //Si la catégorie contient (au moins) une machine.
      if (machineryExists?.machinerie?.length > 0) {
        setErrorMachinery(true) //Pour afficher un toast.
        return true //Pour ne pas supprimer la catégorie.
      } else {
        //Si la catégorie est vide.
        return false
      }
      /*ERREUR*/
    } catch (err) {
      console.error(err)
      setErrorCheck(true) //Pour afficher un toast.
    }
  }

  /*VÉRIFICATION POUR LE TOAST D'ERREUR*/
  useEffect(() => {
    //Affichage d'un toast en cas d'erreur.
    if (errorMachinery) {
      toast.error(
        "Impossible de supprimer cette catégorie car elle n'est pas vide.",
      )
      setErrorMachinery(false) //Pour pouvoir afficher le toast à nouveau.
    }
    if (errorCheck) {
      toast.error(
        "Erreur lors de la vérification de l'existence de machine(s).",
      )
      setErrorCheck(false) //Pour pouvoir afficher le toast à nouveau.
    }
    if (errorMutation) {
      toast.error('Erreur lors de la suppression de la catégorie.')
      setErrorMutation(false) //Pour pouvoir afficher le toast à nouveau.
    }
  }, [errorMachinery, errorCheck, errorMutation])

  /*SUPPRESSION DE LA CATÉGORIE DE LA BASE DE DONNÉES*/
  const deleteCategory = async () => {
    try {
      const deleteCategory = await doMutation(DELETE_CATEGORY, {
        categoryId: selectedCategory?.[COLUMN_ID],
      })
      //Si la suppression a fonctionné.
      if (deleteCategory?.delete_machinerie_categorie?.affected_rows > 0) {
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
      toast.success('Catégorie supprimée.')

      //Réinitialisation des variables.
      setErrorMachinery(false)
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
        /*Formulaire de suppression.*/
        <>
          <p>Êtes-vous sûr(e) de vouloir supprimer cette catégorie ?</p>
          <form onSubmit={handleClick}>
            <ul>
              <li>{selectedCategory?.[COLUMN_NAME]}</li>
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

export default FormDelCategory
