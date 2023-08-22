import React, { useState } from 'react'
import { useCategory, useStatus } from '../utils/react/hooks'
import PropTypes from 'prop-types'
import CustomButton from './button'
/*Base de données*/
import { COLUMN_ID, COLUMN_NAME } from '../utils/database/query'
/*Style*/
import colors from '../utils/styles/color'
import 'bulma/css/bulma.min.css'
import styled from 'styled-components'

//Style des sections du formulaire.
const StyledPart = styled.div`
  margin-bottom: 15px;
`

//Formulaire d'ajout d'une machine.
function FormAddMachinery() {
  const [error, setError] = useState('')
  //Pour stocker le nom de la machine.
  const [nameMachine, setNameMachine] = useState('')
  //Pour stocker l'ID de la catégorie sélectionnée.
  const [selectedCategoryId, setSelectedCategoryId] = useState(0)
  //Pour stocker l'ID du statut sélectionné.
  const [selectedStatusId, setSelectedStatusId] = useState(0)

  //Pour récupérer les catégories.
  const { sortedCategories, category_loading, category_error } = useCategory()
  //Pour récupérer les statuts.
  const { status, status_loading, status_error } = useStatus()

  return (
    <div>
      {/*Nom*/}
      <div className="field">
        <label className="label">Nom</label>
        <div className="control">
          <input
            className={`input ${error && 'is-danger'}`} /*??????????*/
            type="text"
            placeholder="Entrez le nom de la machine"
            value={nameMachine}
            onChange={(e) => setNameMachine(e.target.value)}
          />
        </div>
        {error && <p className="help is-danger">{error}</p>} {/*??????????*/}
      </div>
      {/*Catégorie*/}
      <StyledPart>
        <label className="label">Catégorie</label>
        <div className="select">
          <select
            value={selectedCategoryId}
            onChange={(e) => setSelectedCategoryId(parseInt(e.target.value))}
          >
            {sortedCategories.map((category) => (
              <option
                key={`${category[COLUMN_NAME]}-${category[COLUMN_ID]}`}
                value={parseInt(category[COLUMN_ID])}
              >
                {category[COLUMN_NAME]}
              </option>
            ))}
          </select>
        </div>
      </StyledPart>
      {/*Statut*/}
      <StyledPart>
        <label className="label">Statut</label>
        <div className="select">
          <select
            value={selectedStatusId}
            onChange={(e) => setSelectedStatusId(parseInt(e.target.value))}
          >
            {status.map((status) => (
              <option
                key={`${status[COLUMN_NAME]}-${status[COLUMN_ID]}`}
                value={parseInt(status[COLUMN_ID])}
              >
                {status[COLUMN_NAME]}
              </option>
            ))}
          </select>
        </div>
      </StyledPart>
      {/*Modèle*/}
      <div className="field">
        <label className="label">Modèle</label>
        <div className="control">
          <input
            className="input"
            type="text"
            placeholder="Entrez le numéro de modèle"
            value={nameMachine}
            onChange={(e) => setNameMachine(e.target.value)}
          />
        </div>
      </div>
      {/*Bouton d'ajout*/}
      <div className="control">
        <CustomButton
          color={colors.greenButton}
          hovercolor={colors.greenButtonHover}
        >
          Ajouter
        </CustomButton>
        <CustomButton
          color={colors.redButton}
          hovercolor={colors.redButtonHover}
        >
          Annuler
        </CustomButton>
      </div>
    </div>
  )
}

export default FormAddMachinery
