import React, { useState, useEffect } from 'react'
import { useFetchHasura, useBreakdownStatus } from '../utils/react/hooks'
import { formatDate } from '../utils/reusable/functions'
/*Composants*/
import Accordion from './accordion'
/*Types*/
import PropTypes from 'prop-types'
/*Base de données*/
import {
  LIEN_API,
  VUE_BREAKDOWN,
  GET_ALL_BREAKDOWN,
  COLUMN_ID,
  COLUMN_NAME,
  COLUMN_STATUS_ID,
  COLUMN_DATE_BREAKDOWN,
  COLUMN_DESCRIPTION,
  COLUMN_DATE_REPAIR,
  COLUMN_ESTIMATED_REPAIR,
  COLUMN_REMARKS,
  COLUMN_STATUS_BREAKDOWN_NAME,
  COLUMN_MACHINERY_NAME,
} from '../utils/database/query'
/*Style*/
import styled from 'styled-components'
import colors from '../utils/styles/color'
import '../styles/inventory.css'

const StyledAccordionWrapper = styled.div`
  margin-top: 20px;
`

const StyledText = styled.span`
  color: ${colors.panelTitle};
`

//Style pour le selecteur de statut et le champ de recherche.
const StyledSelect = styled.div`
  display: flex;
  justify-content: space-between;

  @media (max-width: 767px) {
    flex-direction: column;
    align-items: center;

    .select {
      margin-bottom: 5px;
    }
  }
`

function ShowBreakdown({ functionButtons }) {
  //Pour stocker l'ID du statut sélectionnée.
  const [selectedStatusId, setSelectedStatusId] = useState(0)
  //Pour savoir si c'est la première fois qu'on charge les données.
  const [firstLoading, setFirstLoading] = useState(true)
  //Pour stocker les données filtrées.
  const [filteredBreakdownData, setFilteredBreakdownData] = useState([])
  //Pour récupérer les statuts de bris.
  const {
    sortedBreakdownStatus,
    breakdownStatus_loading,
    breakdownStatus_error,
  } = useBreakdownStatus()

  //Permet de sélectionner "Tous les bris" par défaut.
  useEffect(() => {
    if (sortedBreakdownStatus && sortedBreakdownStatus.length > 0) {
      setSelectedStatusId(0)
    }
  }, [sortedBreakdownStatus])

  const {
    data: allBreakdownData,
    isLoading,
    error,
  } = useFetchHasura(LIEN_API, GET_ALL_BREAKDOWN, firstLoading)

  //Permet de définir si c'est la première fois qu'on charge la page.
  useEffect(() => {
    setFirstLoading(false)
  }, [])

  useEffect(() => {
    if (allBreakdownData && allBreakdownData[VUE_BREAKDOWN]) {
      setFilteredBreakdownData(allBreakdownData[VUE_BREAKDOWN])
    }
  }, [allBreakdownData])

  /*AFFICHAGE*/
  //Affichage du contenu du panneau d'accordéon (infos sur le bris).
  function panelContent(breakdown) {
    return (
      <ul className="infoMachine">
        {breakdown[COLUMN_DATE_BREAKDOWN] ? (
          <li className="StyledListButton">
            <StyledText>Date du bris :</StyledText>{' '}
            {`${formatDate(breakdown[COLUMN_DATE_BREAKDOWN])}`}
          </li>
        ) : null}
        {breakdown[COLUMN_DESCRIPTION] ? (
          <li className="StyledListButton">
            <StyledText>Description :</StyledText>{' '}
            {breakdown[COLUMN_DESCRIPTION]}
          </li>
        ) : null}
        {breakdown[COLUMN_DATE_REPAIR] ? (
          <li className="StyledListButton">
            <StyledText>Date de réparation :</StyledText>{' '}
            {`${formatDate(breakdown[COLUMN_DATE_REPAIR])}`}
          </li>
        ) : null}
        {breakdown[COLUMN_ESTIMATED_REPAIR] ? (
          <li className="StyledListButton">
            <StyledText>Prix de réparation estimée :</StyledText>{' '}
            {breakdown[COLUMN_ESTIMATED_REPAIR]} $
          </li>
        ) : null}
        {breakdown[COLUMN_REMARKS] ? (
          <li className="StyledListButton">
            <StyledText>Remarques :</StyledText> {breakdown[COLUMN_REMARKS]}
          </li>
        ) : null}
      </ul>
    )
  }

  /*FILTRE DU MENU DÉROULANT*/
  useEffect(() => {
    if (allBreakdownData && allBreakdownData[VUE_BREAKDOWN]) {
      let filteredData = allBreakdownData[VUE_BREAKDOWN]
      //Statut "TOUS LES BRIS".
      if (selectedStatusId === 0) {
        setFilteredBreakdownData(filteredData)
        //Autres statuts (ordre alphabétique).
      } else {
        filteredData = filteredData.filter(
          (bris) => bris[COLUMN_STATUS_ID] === selectedStatusId,
        )
        setFilteredBreakdownData(filteredData)
      }
    }
  }, [allBreakdownData, selectedStatusId])

  /*BARRE DE RECHERCHE*/
  function handleSearch(e) {
    //On récupère la valeur du champ de recherche.
    const searchValue = e.target.value
    //Si la valeur n'est pas vide, on filtre les bris en fonction de la valeur.
    if (searchValue) {
      const filteredData = allBreakdownData[VUE_BREAKDOWN].filter((bris) =>
        //On compare en minuscule pour ne pas avoir de problème de casse.
        bris[COLUMN_MACHINERY_NAME].toLowerCase().includes(
          searchValue.toLowerCase(),
        ),
      )
      //On met à jour les données filtrées.
      setFilteredBreakdownData(filteredData)
    } else {
      //Sinon, on remet les données de base.
      setFilteredBreakdownData(allBreakdownData[VUE_BREAKDOWN])
    }
  }

  //Affichage du contenu de la page.
  return (
    <div>
      {breakdownStatus_loading ? (
        <div className="loader is-loading"></div>
      ) : breakdownStatus_error ? (
        <div>Erreur lors du chargement des statuts !</div>
      ) : (
        <>
          <StyledSelect>
            <div className="select">
              <select
                value={selectedStatusId}
                onChange={(e) => setSelectedStatusId(parseInt(e.target.value))}
              >
                {/*Statut "TOUS LES BRIS"*/}
                <option key="all" value={0}>
                  -- Tous les bris --
                </option>
                {/*Autres statuts*/}
                {sortedBreakdownStatus &&
                  sortedBreakdownStatus.map((status) => (
                    <option
                      key={`${status[COLUMN_NAME]}-${status[COLUMN_ID]}`}
                      value={parseInt(status[COLUMN_ID])}
                    >
                      {status[COLUMN_NAME]}
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
        </>
      )}
      {isLoading ? (
        <div className="loader is-loading"></div>
      ) : error ? (
        <div>Erreur lors du chargement des bris !</div>
      ) : (
        <StyledAccordionWrapper>
          {filteredBreakdownData.length > 0 ? (
            filteredBreakdownData.map((breakdown) => (
              <Accordion
                key={breakdown[COLUMN_ID]}
                title={`Bris #${breakdown[COLUMN_ID]} [${breakdown[COLUMN_STATUS_BREAKDOWN_NAME]}] : ${breakdown[COLUMN_MACHINERY_NAME]}`}
                content={panelContent(breakdown)}
                others={functionButtons(breakdown)}
              />
            ))
          ) : (
            <div>
              <i>Aucun bris trouvé.</i>
            </div>
          )}
        </StyledAccordionWrapper>
      )}
    </div>
  )
}

//Vérification des types des props.
ShowBreakdown.propTypes = {
  functionButtons: PropTypes.func.isRequired,
}

export default ShowBreakdown
