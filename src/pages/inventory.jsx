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

//Style du wrapper des accordéons.
const StyledAccordionWrapper = styled.div`
  margin-top: 20px;
`

function Inventory() {
  /*INFOS SUR LA BASE DE DONNÉES (À MODIFIER AU BESOIN)*/
  //Lien de l'API GraphQL à utiliser.
  const api_url = 'https://champion-tiger-15.hasura.app/v1/graphql'
  //Nom des tables à utiliser.
  const table_category = 'machinerie_categorie'
  const table_machinery = 'machinerie'
  //Nom des colonnes à utiliser.
  const column_id = 'id'
  const column_name = 'nom'
  const column_model = 'modele'
  const column_serial_number = 'num_serie'
  const column_status = 'statut_id'
  const column_category = 'categorie_id'
  const column_date = 'date_acquisition'
  const column_price = 'prix_achat'
  const column_hours = 'heure_utilisation'
  const column_comment = 'commentaire'
  const column_location = 'localisation'
  /* FIN DES INFOS*/

  //Pour stocker l'ID de la catégorie sélectionnée.
  const [selectedCategoryId, setSelectedCategoryId] = useState(0)
  //Pour savoir si c'est la première fois qu'on charge les données.
  const [firstLoading, setFirstLoading] = useState(true)
  //Pour stocker les données filtrées.
  const [filteredMachineryData, setFilteredMachineryData] = useState([])

  //Permet de récupérer toutes les catégories depuis Hasura.
  const {
    data: category_data,
    isLoading: category_loading,
    error: category_error,
  } = useFetchHasura(
    api_url,
    `{${table_category}{${column_id} ${column_name}}}`,
    firstLoading,
  )

  //Trie les catégories par ordre alphabétique.
  useEffect(() => {
    if (category_data && category_data[table_category]) {
      category_data[table_category].sort((a, b) =>
        a[column_name].localeCompare(b[column_name]),
      )
    }
  }, [category_data])

  //Permet de sélectionner la première catégorie par défaut.
  useEffect(() => {
    if (
      category_data &&
      category_data[table_category] &&
      category_data[table_category].length > 0
    ) {
      setSelectedCategoryId(category_data[table_category][0].id)
    }
  }, [category_data])

  //Permet de récupérer les données de toutes les machines depuis Hasura.
  const {
    data: machinery_data,
    isLoading: machinery_loading,
    error: machinery_error,
  } = useFetchHasura(
    api_url,
    `{
      ${table_machinery} {
        ${column_name}
        ${column_category}
        ${column_status}
        ${column_model}
        ${column_serial_number}
        ${column_date}
        ${column_price}
        ${column_hours}
        ${column_comment}
        ${column_location}
      }
    }`,
    firstLoading,
  )

  //(!!!!!!!!!!!!)
  useEffect(() => {
    setFirstLoading(false)
  }, [])

  //Permet de filtrer les machines (dans "machinery_data") en fonction de la catégorie sélectionnée.
  useEffect(() => {
    if (machinery_data && machinery_data.machinerie) {
      const filteredData = machinery_data.machinerie.filter(
        (machine) => machine[column_category] === selectedCategoryId,
      )
      setFilteredMachineryData(filteredData)
    }
  }, [machinery_data, selectedCategoryId])

  //Affichage.
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
                  onChange={(e) =>
                    setSelectedCategoryId(parseInt(e.target.value))
                  }
                >
                  {category_data[table_category].map((category) => (
                    <option
                      key={`${category.nom}-${category.id}`}
                      value={parseInt(category.id)}
                    >
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
              <StyledAccordionWrapper>
                {/* On fait un accordéon avec chaque machine trouvée */}
                {filteredMachineryData.map((machinery) => (
                  <Accordion
                    key={machinery[column_id]}
                    title={`${machinery[column_name]} ${machinery[column_model]}`}
                    content={`Numéro de série : ${machinery[column_serial_number]} - Statut : ${machinery[column_status]}`}
                  />
                ))}
              </StyledAccordionWrapper>
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
                  onChange={(e) =>
                    setSelectedCategoryId(parseInt(e.target.value))
                  }
                >
                  {category_data[table_category].map((category) => (
                    <option
                      key={`${category.nom}-${category.id}`}
                      value={parseInt(category.id)}
                    >
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
              <StyledAccordionWrapper>
                {/* On fait un accordéon avec chaque machine trouvée */}
                {filteredMachineryData.map((machinery) => (
                  <Accordion
                    key={machinery[column_id]}
                    title={`${machinery[column_name]} ${machinery[column_model]}`}
                    content={`Numéro de série : ${machinery[column_serial_number]} - Statut : ${machinery[column_status]}`}
                  />
                ))}
              </StyledAccordionWrapper>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Inventory
