import React from 'react'
/*import PropTypes from 'prop-types'*/
import { useState, useEffect } from 'react'
import { useFetchHasura } from '../utils/react/hooks'
import Accordion from '../components/accordion'
import styled from 'styled-components'

//Style du titre.
const StyledTitle = styled.h1`
  margin-top: 20px;
`

function Inventory() {
  //Nom des tables à utiliser (À MODIFIER AU BESOIN).
  const table_name_category = 'machinerie_categorie'
  const table_name_machinery = 'machinerie'
  //Nom des colonnes à utiliser (À MODIFIER AU BESOIN).
  const column_id = 'id'
  const column_name = 'nom'
  const column_model = 'modele'
  const column_serial_number = 'num_serie'
  const column_status = 'statut_id'
  const column_category_id = 'categorie_id'
  //Pour stocker l'ID de la catégorie sélectionnée.
  const [selectedCategoryId, setSelectedCategoryId] = useState(0)

  //Permet de récupérer les catégories depuis Hasura.
  const {
    data: category_data,
    isLoading: category_loading,
    error: category_error,
  } = useFetchHasura(
    'https://champion-tiger-15.hasura.app/v1/graphql',
    `{${table_name_category}{id nom}}`,
  )

  //Permet de sélectionner la première catégorie par défaut et de réinitialiser l'ID sélectionné si la liste des catégories change.
  useEffect(() => {
    if (
      category_data &&
      category_data[table_name_category] &&
      category_data[table_name_category].length > 0
    ) {
      setSelectedCategoryId(category_data[table_name_category][0].id)
    }
  }, [category_data])

  //Permet de récupérer les machines liées à la catégorie sélectionnée depuis Hasura.
  const {
    data: machinery_data,
    isLoading: machinery_loading,
    error: machinery_error,
  } = useFetchHasura(
    'https://champion-tiger-15.hasura.app/v1/graphql',
    `{
      ${table_name_machinery}(where: {${column_category_id}: {_eq: ${selectedCategoryId}}}) {
        ${column_name}
        ${column_model}
        ${column_serial_number}
        ${column_status}
      }
    }`,
  )

  return (
    <div>
      {/* Design pour ordinateur */}
      <div className="is-hidden-touch">
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
                  {category_data[table_name_category].map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.nom}
                    </option>
                  ))}
                </select>
              </div>
            )}
            {machinery_loading ? (
              <div>Chargement de la machinerie ...</div>
            ) : machinery_error ? (
              <div>Erreur lors du chargement de la machinerie !</div>
            ) : (
              <div>
                {/* On fait un accordéon avec chaque machine trouvée */}
                {machinery_data[table_name_machinery].map((machinery) => (
                  <Accordion
                    key={machinery[column_id]}
                    title={`${machinery[column_name]} ${machinery[column_model]}`}
                    content={`Numéro de série : ${machinery[column_serial_number]} - Statut : ${machinery[column_status]}`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Design pour mobile */}
      <div className="is-hidden-desktop">
        <div className="columns is-mobile">
          <div className="column is-10 is-offset-1">
            <StyledTitle className="title is-5 has-text-centered">
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
                  {category_data[table_name_category].map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.nom}
                    </option>
                  ))}
                </select>
              </div>
            )}
            {machinery_loading ? (
              <div>Chargement de la machinerie ...</div>
            ) : machinery_error ? (
              <div>Erreur lors du chargement de la machinerie !</div>
            ) : (
              <div>
                {/* On fait un accordéon avec chaque machine trouvée */}
                {machinery_data[table_name_machinery].map((machinery) => (
                  <Accordion
                    key={machinery[column_id]}
                    title={`${machinery[column_name]} ${machinery[column_model]}`}
                    content={`Numéro de série : ${machinery[column_serial_number]} - Statut : ${machinery[column_status]}`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Inventory
