import React, { useState } from 'react'
import CustomButton from '../components/button'
import PropTypes from 'prop-types'
/*Base de données*/
import { INSERT_CATEGORY } from '../utils/database/query'
/*Style*/
import colors from '../utils/styles/color'

//Formulaire d'ajout d'une catégorie.
function FormAddCategory() {
  //Erreur possible.
  const [error, setError] = useState('')
  //Pour stocker la donnée du formulaire.
  const [nameCategory, setNameCategory] = useState('')

  //Pour ajouter une catégorie.
  async function handleAdditionCategory(e) {
    e.preventDefault()

    //Vérification des champs.
    if (!nameCategory) {
      setError('Veuillez entrer le nom de la catégorie.')
    } else {
      setError('')
    }
  }

  //Affichage du formulaire.
  return (
    <div>
      <p>Veuillez entrer le nom de la catégorie à ajouter.</p>
      <form onSubmit={handleAdditionCategory}>
        {/*Nom de la catégorie*/}
        <div className="field">
          <label className="label">Nom de la catégorie</label>
          <div className="control">
            <input
              className={error ? `input ${error && 'is-danger'}` : 'input'} //Si erreur, ajout de la classe 'is-danger'.
              type="text"
              placeholder="Entrez le nom de la catégorie"
              value={nameCategory}
              onChange={(e) => setNameCategory(e.target.value)}
            />
          </div>
          {/*Si erreur, affichage du message d'erreur.*/}
          {error ? <p className="help is-danger">{error}</p> : null}
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
