import React from 'react'
import PropTypes from 'prop-types'
/*Style*/
import styled from 'styled-components'
import '../styles/reservationlist.css'
import 'bulma/css/bulma.min.css'
/*Importation des icônes*/
import Icon from '@mdi/react'
import { mdiArrowLeftThick } from '@mdi/js'
import { mdiArrowRightThick } from '@mdi/js'

//Style de la tuile.
const StyledTile = styled.article`
  background-color: ${(props) => props.color};
  color: white;
`

//Style du titre de la tuile.
const StyledTitle = styled.span`
  font-size: 1.75em;
`

//Permet d'afficher une liste de réservations.
function ReservationList({
  title,
  cards,
  backgroundColor,
  onNext,
  onPrev,
  currentIndex,
}) {
  return (
    <div className="tile is-parent">
      <StyledTile color={backgroundColor} className={`tile is-child box`}>
        <div className="content">
          <div className="flexContainer">
            <StyledTitle>{title}</StyledTitle>
            <div className="buttons">
              <button
                onClick={onPrev}
                className="button transparentButton"
                disabled={currentIndex === 0}
              >
                <Icon path={mdiArrowLeftThick} size={1} />
              </button>
              <button
                onClick={onNext}
                className="button transparentButton"
                disabled={currentIndex + 5 >= cards.length}
              >
                <Icon path={mdiArrowRightThick} size={1} />
              </button>
            </div>
          </div>
          {/* Si aucune carte, on affiche un message. */}
          {cards.length === 0 && (
            <p className="no-card">Aucune réservation à afficher.</p>
          )}
          {/* Sinon, on affiche les cartes. */}
          <div className="content">
            {cards.slice(currentIndex, currentIndex + 5)}
          </div>
        </div>
      </StyledTile>
    </div>
  )
}

//Définition des props de la liste de réservations.
ReservationList.propTypes = {
  title: PropTypes.string,
  cards: PropTypes.array,
  notificationClass: PropTypes.string,
}

export default ReservationList
