import React, { useState, useEffect } from 'react'
import { useCategory, useMutationHasura } from '../utils/react/hooks'
/*Composants*/
import CustomButton from '../components/button'
import ModalSuccess from '../components/message_success_modal'
/*Types*/
import PropTypes from 'prop-types'
/*Toast*/
import { toast } from 'react-toastify'
/*Base de données*/
import {
  LIEN_API,
  COLUMN_ID,
  COLUMN_NAME,
  INSERT_CATEGORY,
  UPDATE_CATEGORY,
} from '../utils/database/query'
/*Style*/
import colors from '../utils/styles/color'

/*NOTE : si il y a 'selectedCategory', c'est une modification, sinon c'est un ajout.*/

//Formulaire d'ajout et de modification de catégorie.
function FormCategory({ closeModal, selectedCategory }) {
  //Pour stocker la donnée du formulaire.
  const [nameCategory, setNameCategory] = useState(
    selectedCategory ? selectedCategory[COLUMN_NAME] : '',
  )
  //Erreur dans la donnée du formulaire.
  const [error, setError] = useState('')
  //Pour savoir si le bouton est cliqué.
  const [isClicked, setIsClicked] = useState(false)
  //Pour savoir si la catégorie existe déjà.
  const [sameCategory, setSameCategory] = useState(false)
  //Erreur et succès lors de l'enregistrement.
  const [errorMutation, setErrorMutation] = useState(false)
  const [successMutation, setSuccessMutation] = useState(false)
  //Pour savoir si on affiche le formulaire ou l'icône de succès.
  const [showForm, setShowForm] = useState(true)

  //Pour récupérer les catégories existantes (pour comparaison).
  const { sortedCategories, category_error } = useCategory()
  //Permet d'envoyer une requête de mutation (INSERT, UPDATE) à Hasura.
  const { doMutation } = useMutationHasura(LIEN_API)

  /*FONCTION AGISSANT À L'ENVOI DU FORMULAIRE*/
  async function handleClickCategory(e) {
    e.preventDefault()
    setIsClicked(true) //Si le bouton est cliqué.

    //Si erreur (champ vide), ne pas exécuter la fonction.
    if (error) {
      return
    }

    //Si erreur de base de données, ne pas exécuter la fonction.
    if (category_error) {
      return true
    }

    //Vérification de l'existence de la catégorie.
    const categoryAlreadyExists = checkCategory()

    //Ajout de la catégorie si elle n'existe pas.
    if (!categoryAlreadyExists) {
      await addEditCategory()
    }
  }

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

  //Fonction pour enlever les espaces.
  function removeSpaces(str) {
    return str.replace(/\s+/g, '')
  }

  /*VÉRIFICATION DE L'EXISTENCE DE LA CATÉGORIE*/
  function checkCategory() {
    // Comparaison sans accent, en minuscule et sans espace.
    const processedName = removeSpaces(
      removeAccents(nameCategory.toLowerCase()),
    )

    const categoryExists = sortedCategories.some((category) => {
      const processedCategory = removeSpaces(
        removeAccents(category[COLUMN_NAME].toLowerCase()),
      )
      return processedCategory === processedName
    })

    //Si la catégorie existe déjà, affichage d'une erreur.
    if (categoryExists) {
      setSameCategory(true) //Pour afficher un toast.
      return true
    }

    //Si la catégorie n'existe pas.
    return false
  }

  /*VÉRIFICATION POUR LE TOAST D'ERREUR*/
  useEffect(() => {
    //Affichage d'un toast en cas d'erreur.
    if (category_error) {
      toast.error('Erreur lors de la récupération des catégories.')
    }
    if (sameCategory) {
      if (selectedCategory) {
        toast.error('Nom identique.')
      } else {
        toast.error('Catégorie déjà existante.')
      }
      setSameCategory(false) //Pour pouvoir afficher le toast à nouveau.
    }
    if (errorMutation) {
      toast.error("Erreur lors de l'enregistrement de la catégorie.")
      setErrorMutation(false) //Pour pouvoir afficher le toast à nouveau.
    }
  }, [category_error, sameCategory, errorMutation, selectedCategory])

  /*AJOUT OU MODIFICATION DE LA CATÉGORIE DANS LA BASE DE DONNÉES*/
  const addEditCategory = async () => {
    try {
      /*VERSION POUR MODIFICATION*/
      if (selectedCategory) {
        const resultMutation = await doMutation(UPDATE_CATEGORY, {
          categoryId: selectedCategory?.[COLUMN_ID],
          name: nameCategory,
        })

        //Si la modification a fonctionné.
        if (resultMutation?.update_machinerie_categorie?.affected_rows > 0) {
          setSuccessMutation(true) //Pour toast + réinitialisation des variables.
        }
        /*VERSION POUR AJOUT*/
      } else {
        const resultMutation = await doMutation(INSERT_CATEGORY, {
          name: nameCategory,
        })

        //Si l'ajout a fonctionné.
        if (resultMutation?.insert_machinerie_categorie?.affected_rows > 0) {
          setSuccessMutation(true) //Pour toast + réinitialisation des variables.
        }
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
      //Toast de succès selon l'action.
      if (selectedCategory) {
        toast.success('Catégorie modifiée.')
      } else {
        toast.success('Catégorie ajoutée.')
      }

      //Réinitialisation des variables.
      setNameCategory('')
      setError('')
      setIsClicked(false)
      setSameCategory(false)
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
  }, [successMutation, closeModal, selectedCategory])

  //Vérification des types des variables.
  FormCategory.propTypes = {
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
      {showForm ? (
        /*Formulaire à remplir.*/
        <>
          <p>
            {selectedCategory
              ? 'Veuillez modifier le nom de la catégorie.'
              : 'Veuillez entrer le nom de la catégorie.'}
          </p>
          <form onSubmit={handleClickCategory}>
            {/*Nom de la catégorie*/}
            <div className="field">
              <label className="label">Nom de la catégorie</label>
              <div className="control">
                <input
                  className={
                    /*Si bouton cliqué + erreur -> cadre rouge.*/
                    isClicked && error
                      ? `input ${error && 'is-danger'}`
                      : 'input'
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
            {/*Bouton de confirmation*/}
            <div className="has-text-centered">
              <CustomButton
                type="submit"
                color={colors.greenButton}
                hovercolor={colors.greenButtonHover}
              >
                {selectedCategory ? 'Modifier' : 'Ajouter'}
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

//Vérification des types des props.
FormCategory.propTypes = {
  closeModal: PropTypes.func,
  selectedCategory: PropTypes.object /*Pour la modification.*/,
}

export default FormCategory
