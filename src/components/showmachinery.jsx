import React, { useState, useEffect } from 'react'
import { useFetchHasura, useCategory } from '../utils/react/hooks'
import { formatDate } from '../utils/reusable/functions'
/*Composants*/
import Accordion from './accordion'
/*Types*/
import PropTypes from 'prop-types'
/*Base de données*/
import {
  LIEN_API,
  VUE_MACHINERY,
  COLUMN_ID,
  COLUMN_NAME,
  COLUMN_MODEL,
  COLUMN_SERIAL_NUMBER,
  COLUMN_STATUS,
  COLUMN_CATEGORY,
  COLUMN_DATE,
  COLUMN_PRICE,
  COLUMN_HOURS,
  COLUMN_COMMENT,
  COLUMN_LOCATION,
} from '../utils/database/query'
/*Style*/
import styled from 'styled-components'
import colors from '../utils/styles/color'
import '../styles/inventory.css'

//Style du wrapper des accordéons.
const StyledAccordionWrapper = styled.div`
  margin-top: 20px;
`

//Style des titres de la liste.
const StyledText = styled.span`
  color: ${colors.panelTitle};
`

//Style pour le selecteur de catégorie et le champ de recherche.
const StyledSelect = styled.div`
  display: flex;
  justify-content: space-between;
`

function ShowMachinery({ functionButtons }) {
  //Pour stocker l'ID de la catégorie sélectionnée.
  const [selectedCategoryId, setSelectedCategoryId] = useState(0)
  //Pour savoir si c'est la première fois qu'on charge les données.
  const [firstLoading, setFirstLoading] = useState(true)
  //Pour stocker les données filtrées.
  const [filteredMachineryData, setFilteredMachineryData] = useState([])

  //Pour récupérer les catégories.
  const { sortedCategories, category_loading, category_error } = useCategory()

  //Permet de sélectionner "Toutes les machines" par défaut.
  useEffect(() => {
    if (sortedCategories && sortedCategories.length > 0) {
      setSelectedCategoryId(0)
    }
  }, [sortedCategories])

  //Permet de récupérer les données de toutes les machines depuis Hasura.
  const {
    data: machinery_data,
    isLoading: machinery_loading,
    error: machinery_error,
  } = useFetchHasura(
    LIEN_API,
    `{
      ${VUE_MACHINERY} {
        ${COLUMN_ID}
        ${COLUMN_NAME}
        ${COLUMN_CATEGORY}
        ${COLUMN_STATUS}
        ${COLUMN_MODEL}
        ${COLUMN_SERIAL_NUMBER}
        ${COLUMN_DATE}
        ${COLUMN_PRICE}
        ${COLUMN_HOURS}
        ${COLUMN_COMMENT}
        ${COLUMN_LOCATION}
      }
    }`,
    firstLoading,
  )

  //Permet de définir si c'est la première fois qu'on charge la page.
  useEffect(() => {
    setFirstLoading(false)
  }, [])

  //Permet de trier les machines par ordre alphabétique.
  function sortByMachineName(a, b) {
    return a[COLUMN_NAME].localeCompare(b[COLUMN_NAME])
  }

  //Permet de filtrer les machines (dans "machinery_data") en fonction de la catégorie sélectionnée.
  useEffect(() => {
    if (machinery_data && machinery_data[VUE_MACHINERY]) {
      let filteredData = machinery_data[VUE_MACHINERY]
      //Catégorie "TOUT" (ordre alphabétique).
      if (selectedCategoryId === 0) {
        setFilteredMachineryData(filteredData.sort(sortByMachineName))
        //Autres catégories (ordre alphabétique).
      } else {
        filteredData = filteredData.filter(
          (machine) => machine[COLUMN_CATEGORY] === selectedCategoryId,
        )
        setFilteredMachineryData(filteredData.sort(sortByMachineName))
      }
    }
  }, [machinery_data, selectedCategoryId])

  /*AFFICHAGE*/
  //Affichage du contenu d'un panneau d'accordéon (infos de la machine).
  function panelContent(machinery) {
    return (
      <ul className="infoMachine">
        {machinery[COLUMN_MODEL] ? (
          <li className="StyledListButton">
            <StyledText>Numéro de modèle :</StyledText>{' '}
            {`${machinery[COLUMN_MODEL]}`}
          </li>
        ) : null}
        {machinery[COLUMN_SERIAL_NUMBER] ? (
          <li className="StyledListButton">
            <StyledText>Numéro de série :</StyledText>{' '}
            {`${machinery[COLUMN_SERIAL_NUMBER]}`}
          </li>
        ) : null}
        <li className="StyledListButton">
          <StyledText>Statut :</StyledText> {`${machinery[COLUMN_STATUS]}`}
        </li>
        {machinery[COLUMN_HOURS] ? (
          <li className="StyledListButton">
            <StyledText>Utilisation accumulée :</StyledText>{' '}
            {`${machinery[COLUMN_HOURS]} heures`}
          </li>
        ) : null}
        {machinery[COLUMN_DATE] ? (
          <li className="StyledListButton">
            <StyledText>Date d'acquisition :</StyledText>{' '}
            {`${formatDate(machinery[COLUMN_DATE])}`}
          </li>
        ) : null}
        {machinery[COLUMN_PRICE] ? (
          <li className="StyledListButton">
            <StyledText>Prix d'achat :</StyledText>{' '}
            {`${machinery[COLUMN_PRICE]}$`}
          </li>
        ) : null}
        {machinery[COLUMN_COMMENT] ? (
          <li className="StyledListButton">
            <StyledText>Commentaire :</StyledText>{' '}
            {`${machinery[COLUMN_COMMENT]}`}
          </li>
        ) : null}
        {machinery[COLUMN_LOCATION] ? (
          <li className="StyledListButton">
            <StyledText>Localisation :</StyledText>{' '}
            {`${machinery[COLUMN_LOCATION]}`}
          </li>
        ) : null}
      </ul>
    )
  }

  /*BARRE DE RECHERCHE*/
  function handleSearch(e) {
    //On récupère la valeur du champ de recherche.
    const searchValue = e.target.value
    //Si la valeur n'est pas vide, on filtre les machines en fonction de la valeur.
    if (searchValue) {
      const filteredData = machinery_data[VUE_MACHINERY].filter((machine) =>
        //On compare en minuscule pour ne pas avoir de problème de casse.
        machine[COLUMN_NAME].toLowerCase().includes(searchValue.toLowerCase()),
      )
      //On met à jour les données filtrées.
      setFilteredMachineryData(filteredData.sort(sortByMachineName))
    } else {
      //Sinon, on remet les données de base.
      setFilteredMachineryData(
        machinery_data[VUE_MACHINERY].sort(sortByMachineName),
      )
    }
  }

  //Affichage du contenu de la page.
  return (
    <div>
      {category_loading ? (
        <div className="loader is-loading"></div>
      ) : category_error ? (
        <div>Erreur lors du chargement des catégories !</div>
      ) : (
        <StyledSelect>
          <div className="select">
            <select
              value={selectedCategoryId}
              onChange={(e) => setSelectedCategoryId(parseInt(e.target.value))}
            >
              {/*Catégorie "TOUTES LES MACHINES"*/}
              <option key="all" value={0}>
                -- Toutes les machines --
              </option>
              {/*Autres catégories*/}
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
          {/* Barre de recherche */}
          <div>
            <input
              className="input"
              type="text"
              placeholder="Recherche"
              onChange={handleSearch}
            />
          </div>
        </StyledSelect>
      )}
      {machinery_loading ? (
        <div className="loader is-loading"></div>
      ) : machinery_error ? (
        <div>Erreur lors du chargement de la machinerie !</div>
      ) : (
        <StyledAccordionWrapper>
          {filteredMachineryData.length > 0 ? (
            /*S'il y a des machines à afficher, on fait un accordéon avec chaque machine trouvée.*/
            filteredMachineryData.map((machinery) => (
              <Accordion
                key={machinery[COLUMN_ID]}
                title={`${machinery[COLUMN_NAME]}`}
                content={panelContent(machinery)}
                others={functionButtons(machinery)}
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
  )
}

//Définition des types des props.
ShowMachinery.propTypes = {
  functionButtons: PropTypes.func.isRequired,
}

export default ShowMachinery
