import React from 'react'
/*import PropTypes from 'prop-types'*/
import { useState, useEffect } from 'react'
import { useFetchHasura } from '../utils/react/hooks'
import styled from 'styled-components'

//Style du titre.
const StyledTitle = styled.h1`
  margin-top: 20px;
`

function Inventory() {
  //Nom de la table à utiliser (À MODIFIER AU BESOIN).
  const table_name = 'machinerie_categorie'
  //Pour stocker l'ID de la catégorie sélectionnée.
  const [selectedCategoryId, setSelectedCategoryId] = useState('')

  //Permet de récupérer les catégories depuis Hasura.
  const {
    data: category_data,
    isLoading: category_loading,
    error: category_error,
  } = useFetchHasura(
    'https://champion-tiger-15.hasura.app/v1/graphql',
    `{${table_name}{nom}}`,
  )

  //Permet de sélectionner la première catégorie par défaut et de réinitialiser l'ID sélectionné si la liste des catégories change.
  useEffect(() => {
    if (
      category_data &&
      category_data[table_name] &&
      category_data[table_name].length > 0
    ) {
      setSelectedCategoryId(category_data[table_name][0].id)
    }
  }, [category_data])

  return (
    <div className="columns">
      <div className="column is-8 is-offset-2">
        <StyledTitle className="title">
          Machinerie et équipements agricoles
        </StyledTitle>
        {category_loading ? (
          <div>Chargement des catégories ...</div>
        ) : category_error ? (
          <div>Erreur lors du chargement des catégories !</div>
        ) : (
          <div className="select">
            <select
              value={selectedCategoryId}
              onChange={(e) => setSelectedCategoryId(e.target.value)}
            >
              {category_data[table_name].map((category) => (
                <option key={category.id} value={category.id}>
                  {category.nom}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>
    </div>
  )
}

export default Inventory
