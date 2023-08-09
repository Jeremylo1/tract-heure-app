import React from 'react'
/*import PropTypes from 'prop-types'*/
import { useState, useEffect } from 'react'
import { useFetchHasura } from '../utils/react/hooks'
import { formatDate } from '../utils/reusable/functions'
import Accordion from '../components/accordion'
import CustomButton from '../components/button'
import styled from 'styled-components'
import StyledTitlePage from '../utils/styles/atoms'
import '../styles/inventory.css'

//Style du wrapper des accordéons.
const StyledAccordionWrapper = styled.div`
  margin-top: 20px;
`

//Style des titres de la liste.
const StyledText = styled.span`
  color: #2daf38;
`

//Style d'un élément de la liste.
const StyledListButton = styled.li`
  &::before {
    content: '•';
    padding-right: 8px;
    color: grey;
  }
`

function Inventory() {
  /*INFOS SUR LA BASE DE DONNÉES (À MODIFIER AU BESOIN)*/
  //Lien de l'API GraphQL à utiliser.
  const api_url = 'https://champion-tiger-15.hasura.app/v1/graphql'
  //Nom des tables à utiliser.
  const table_category = 'machinerie_categorie'
  const table_machinery = 'machinerie'
  const table_status = 'machinerie_statut'
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

  //Permet de récupérer la liste des catégories depuis Hasura.
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

  //Permet de récupérer la liste des statuts depuis Hasura.
  const {
    data: status_data,
    isLoading: status_loading,
    error: status_error,
  } = useFetchHasura(
    api_url,
    `{${table_status}{${column_id} ${column_name}}}`,
    firstLoading,
  )

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

  //(À EXPLIQUER !!!!!!!!!!!!)
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

  //Permet d'afficher le contenu d'un panneau d'accordéon (infos de la machine).
  function panelContent(machinery) {
    return (
      <ul>
        {machinery[column_model] ? (
          <StyledListButton>
            <StyledText>Numéro de modèle :</StyledText>{' '}
            {`${machinery[column_model]}`}
          </StyledListButton>
        ) : null}
        {machinery[column_serial_number] ? (
          <StyledListButton>
            <StyledText>Numéro de série :</StyledText>{' '}
            {`${machinery[column_serial_number]}`}
          </StyledListButton>
        ) : null}
        <StyledListButton>
          {status_loading ? (
            <i>Chargement du statut ...</i>
          ) : status_error ? (
            <i>Statut indisponible.</i>
          ) : (
            <span>
              <StyledText>Statut :</StyledText>{' '}
              {`${
                status_data[table_status].find(
                  (status) => status[column_id] === machinery[column_status],
                )[column_name]
              }`}
            </span>
          )}
        </StyledListButton>
        {machinery[column_hours] ? (
          <StyledListButton>
            <StyledText>Utilisation accumulée :</StyledText>{' '}
            {`${machinery[column_hours]} heures`}
          </StyledListButton>
        ) : null}
        {machinery[column_date] ? (
          <StyledListButton>
            <StyledText>Date d'acquisition :</StyledText>{' '}
            {`${formatDate(machinery[column_date])}`}
          </StyledListButton>
        ) : null}
        {machinery[column_price] ? (
          <StyledListButton>
            <StyledText>Prix d'achat :</StyledText>{' '}
            {`${machinery[column_price]}$`}
          </StyledListButton>
        ) : null}
        {machinery[column_comment] ? (
          <StyledListButton>
            <StyledText>Commentaire :</StyledText>{' '}
            {`${machinery[column_comment]}`}
          </StyledListButton>
        ) : null}
        {machinery[column_location] ? (
          <StyledListButton>
            <StyledText>Localisation :</StyledText>{' '}
            {`${machinery[column_location]}`}
          </StyledListButton>
        ) : null}
      </ul>
    )
  }

  //Affichage.
  return (
    <div>
      {/* DESIGN POUR ORDINATEUR */}
      <div className="is-hidden-touch">
        <div className="columns">
          <div className="column is-8 is-offset-2">
            <StyledTitlePage className="title">
              Machinerie agricole
            </StyledTitlePage>
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
                {filteredMachineryData.length > 0 ? (
                  /*S'il y a des machines à afficher, on fait un accordéon avec chaque machine trouvée.*/
                  filteredMachineryData.map((machinery) => (
                    <Accordion
                      key={machinery[column_id]}
                      title={`${machinery[column_name]}`}
                      content={panelContent(machinery)}
                      others={
                        <div class="buttons">
                          <CustomButton>Disponibilités</CustomButton>
                          <CustomButton>Rapport</CustomButton>
                          <CustomButton>Réserver</CustomButton>
                        </div>
                      }
                    />
                  ))
                ) : (
                  /*Si rien a afficher.*/
                  <div>
                    <i>Aucune machine trouvée.</i>
                  </div>
                )}
              </StyledAccordionWrapper>
            )}
          </div>
        </div>
      </div>

      {/* DESIGN POUR MOBILE */}
      <div className="is-hidden-desktop">
        <div className="columns is-mobile">
          <div className="column is-10 is-offset-1">
            <StyledTitlePage className="title is-5 has-text-centered">
              Machinerie agricole
            </StyledTitlePage>
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
                {filteredMachineryData.length > 0 ? (
                  /*S'il y a des machines à afficher, on fait un accordéon avec chaque machine trouvée.*/
                  filteredMachineryData.map((machinery) => (
                    <Accordion
                      key={machinery[column_id]}
                      title={`${machinery[column_name]}`}
                      content={panelContent(machinery)}
                      others={
                        <div class="buttons">
                          <CustomButton>Disponibilités</CustomButton>
                          <CustomButton>Rapport</CustomButton>
                          <CustomButton>Réserver</CustomButton>
                        </div>
                      }
                    />
                  ))
                ) : (
                  /*Si rien a afficher.*/
                  <div>
                    <i>Aucune machine trouvée.</i>
                  </div>
                )}
              </StyledAccordionWrapper>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Inventory
