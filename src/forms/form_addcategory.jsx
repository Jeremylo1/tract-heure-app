import React, { useState, useEffect } from 'react'
import CustomButton from '../components/button'
import { useCategory, useMutationHasura } from '../utils/react/hooks'
import PropTypes from 'prop-types'
/*Toast*/
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
/*Base de données*/
import { LIEN_API, COLUMN_NAME, INSERT_CATEGORY } from '../utils/database/query'
/*Style*/
import colors from '../utils/styles/color'

//Formulaire d'ajout d'une catégorie.
function FormAddCategory({ closeModal }) {
  //Pour stocker la donnée du formulaire.
  const [nameCategory, setNameCategory] = useState('')
  //Erreur dans la donnée du formulaire.
  const [error, setError] = useState('')
  //Pour savoir si le bouton est cliqué.
  const [isClicked, setIsClicked] = useState(false)
  //Pour savoir si la catégorie existe déjà.
  const [sameCategory, setSameCategory] = useState(false)
  //Erreur lors de l'enregistrement.
  const [errorMutation, setErrorMutation] = useState(false)
  //Succès lors de l'enregistrement.
  const [successMutation, setSuccessMutation] = useState(false)

  //Pour récupérer les catégories existantes (pour comparaison).
  const { sortedCategories, category_error } = useCategory()
  //Permet d'envoyer une requête de mutation (INSERT, UPDATE) à Hasura.
  const { doMutation } = useMutationHasura(LIEN_API)

  /*FONCTION AGISSANT À L'ENVOI DU FORMULAIRE*/
  async function handleClickCategory(e) {
    e.preventDefault()
    setIsClicked(true) //Si le bouton est cliqué.

    //Si erreur, ne pas exécuter la fonction.
    if (error) {
      return
    }

    //Vérification de l'existence de la catégorie.
    const categoryAlreadyExists = checkCategory()

    //Ajout de la catégorie si elle n'existe pas.
    if (!categoryAlreadyExists) {
      await addCategory()
    }
  }

  /*VÉRIFICATION POUR LE TOAST D'ERREUR*/
  useEffect(() => {
    //Affichage d'un toast en cas d'erreur.
    if (category_error) {
      toast.error('Erreur lors de la récupération des catégories.')
    }
    if (sameCategory) {
      toast.error('La catégorie existe déjà.')
      setSameCategory(false) //Pour pouvoir afficher le toast à nouveau.
    }
    if (errorMutation) {
      toast.error("Erreur lors de l'enregistrement de la catégorie.")
      setErrorMutation(false) //Pour pouvoir afficher le toast à nouveau.
    }
  }, [category_error, sameCategory, errorMutation])

  /*VÉRIFICATION DU CHAMP DU FORMULAIRE*/
  useEffect(() => {
    //Vérification de la présence d'un nom.
    if (!nameCategory) {
      setError('Ce champ est obligatoire.')
    } else {
      setError('')
    }
  }, [nameCategory])

  //Fonction pour enlever les accents.
  function removeAccents(str) {
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  }

  /*VÉRIFICATION DE L'EXISTENCE DE LA CATÉGORIE*/
  function checkCategory() {
    //Si erreur, ne pas exécuter la fonction.
    if (category_error) {
      return true
    }

    //Vérification de l'existence de la catégorie (comparaison sans accent et en minuscule).
    const lowerName = removeAccents(nameCategory.toLowerCase())

    const categoryExists = sortedCategories.some((category) => {
      const lowerCategory = removeAccents(category[COLUMN_NAME].toLowerCase())
      return lowerCategory === lowerName
    })

    //Si la catégorie existe déjà, affichage d'une erreur.
    if (categoryExists) {
      setSameCategory(true) //Pour afficher un toast.
      return true
    }

    //Si la catégorie n'existe pas.
    return false
  }

  /*AJOUT DE LA CATÉGORIE DANS LA BASE DE DONNÉES*/
  const addCategory = async () => {
    try {
      const resultMutation = await doMutation(INSERT_CATEGORY, {
        name: nameCategory,
      })

      //Si l'ajout a fonctionné.
      if (resultMutation) {
        setSuccessMutation(true) //Pour toast + réinitialisation des variables.
      }

      //Si l'ajout n'a pas fonctionné.
    } catch (err) {
      console.error(err)
      setErrorMutation(true) //Pour afficher un toast.
    }
  }

  /*TOAST DE SUCCÈS ET RÉINITIALISATION DES VARIABLES*/
  useEffect(() => {
    if (successMutation) {
      //Toast de succès.
      toast.success('Catégorie ajoutée avec succès.')

      //Réinitialisation des variables.
      setNameCategory('')
      setError('')
      setIsClicked(false)
      setSameCategory(false)
      setErrorMutation(false)
      setSuccessMutation(false)

      //Fermeture de la modale (pour rafraîchissement de la page).
      closeModal()
    }
  }, [successMutation, closeModal])

  //Vérification des types.
  FormAddCategory.propTypes = {
    nameCategory: PropTypes.string,
    error: PropTypes.string,
    isClicked: PropTypes.bool,
    sameCategory: PropTypes.bool,
    errorMutation: PropTypes.bool,
    successMutation: PropTypes.bool,
  }

  /*AFFICHAGE DU FORMULAIRE*/
  return (
    <div>
      <p>Veuillez entrer le nom de la catégorie.</p>
      <form onSubmit={handleClickCategory}>
        {/*Nom de la catégorie*/}
        <div className="field">
          <label className="label">Nom de la catégorie</label>
          <div className="control">
            <input
              className={
                /*Si bouton cliqué + erreur -> cadre rouge.*/
                isClicked && error ? `input ${error && 'is-danger'}` : 'input'
              }
              type="text"
              placeholder="Entrez le nom de la catégorie"
              value={nameCategory}
              onChange={(e) => setNameCategory(e.target.value)}
            />
          </div>
          {isClicked && error ? (
            /*Si bouton cliqué + erreur -> message d'erreur.*/
            <p className="help is-danger">{error}</p>
          ) : null}
        </div>
        {/*Bouton d'ajout*/}
        <div className="has-text-centered">
          <CustomButton
            type="submit"
            color={colors.greenButton}
            hovercolor={colors.greenButtonHover}
          >
            Ajouter
          </CustomButton>
        </div>
      </form>
      <ToastContainer /> {/*Pour les toasts.*/}
    </div>
  )
}

export default FormAddCategory

/*À FAIRE :
- Vérification si catégories exactement identiques (même si espaces différents).
- Modification d'une catégorie (template à réutiliser).*/
