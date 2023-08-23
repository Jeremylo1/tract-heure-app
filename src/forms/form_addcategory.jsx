import React, { useState, useEffect } from 'react'
import CustomButton from '../components/button'
import { useCategory, useMutationHasura } from '../utils/react/hooks'
import PropTypes from 'prop-types'
/*Base de données*/
import { LIEN_API, COLUMN_NAME, INSERT_CATEGORY } from '../utils/database/query'
/*Style*/
import colors from '../utils/styles/color'

//Formulaire d'ajout d'une catégorie.
function FormAddCategory() {
  //Erreur possible.
  const [error, setError] = useState('')
  //Pour stocker la donnée du formulaire.
  const [nameCategory, setNameCategory] = useState('')
  //Pour savoir si le bouton est cliqué.
  const [isClicked, setIsClicked] = useState(false)

  //Pour récupérer les catégories existantes (pour comparaison).
  const { sortedCategories, category_error } = useCategory()
  //Permet d'envoyer une requête de mutation (INSERT, UPDATE) à Hasura.
  const { doMutation } = useMutationHasura(LIEN_API)

  //Fonction pour enlever les accents.
  function removeAccents(str) {
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  }

  /*VÉRIFICATION DU FORMULAIRE*/
  useEffect(() => {
    //Vérification du champ.
    if (!nameCategory) {
      setError('Veuillez entrer le nom de la catégorie.')
    } else {
      setError('')
    }
  }, [nameCategory])

  /*VÉRIFICATION DE L'EXISTENCE DE LA CATÉGORIE*/
  function checkCategory() {
    //Si erreur, ne pas exécuter la fonction.
    if (category_error) {
      alert('Erreur lors de la récupération des catégories.')
      return true
    }

    //Vérification de l'existence de la catégorie (comparaison sans accent et en minuscule).
    const lowerName = removeAccents(nameCategory.toLowerCase())

    const categoryExists = sortedCategories.some((category) => {
      const lowerCategory = removeAccents(category[COLUMN_NAME].toLowerCase())
      return lowerCategory === lowerName
    })

    //Si la catégorie existe, affichage d'une erreur.
    if (categoryExists) {
      alert('La catégorie existe déjà.')
      return true
    }

    //Si la catégorie n'existe pas.
    return false
  }

  /*AJOUT DE LA CATÉGORIE DANS LA BASE DE DONNÉES*/
  const addCategory = async () => {
    //Essai d'ajout.
    try {
      const resultMutation = await doMutation(INSERT_CATEGORY, {
        name: nameCategory,
      })

      //Si l'ajout a fonctionné.
      if (resultMutation) {
        alert('Catégorie ajoutée avec succès.')

        //Réinitialisation du champ.
        setNameCategory('')

        //Réinitialisation de l'erreur.
        setError('')
      }

      //Si l'ajout n'a pas fonctionné.
    } catch (err) {
      console.error(err)
      alert(
        "Une erreur s'est produite lors de l'enregistrement de la catégorie.",
      )
    }
  }

  /*FONCTION AGISSANT À L'ENVOI DU FORMULAIRE*/
  async function handleClickCategory(e) {
    e.preventDefault()

    //Si le bouton est cliqué.
    setIsClicked(true)

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

  //Vérification des types.
  FormAddCategory.propTypes = {
    nameCategory: PropTypes.string,
    error: PropTypes.string,
  }

  /*AFFICHAGE*/
  return (
    <div>
      <p>Veuillez entrer le nom de la catégorie à ajouter.</p>
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
    </div>
  )
}

export default FormAddCategory
