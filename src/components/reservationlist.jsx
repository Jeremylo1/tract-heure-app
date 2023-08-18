import React from 'react'
import PropTypes from 'prop-types'
/*Style*/
import styled from 'styled-components'
import 'bulma/css/bulma.min.css'

//Style de la tuile.
const StyledTile = styled.div`
  background-color: ${(props) => props.color};
  color: white;
  border-radius: 10px;
  padding: 20px;
`

//Style du titre de la tuile.
const StyledTitle = styled.p`
  font-size: 1.75em;
`

//Permet d'afficher une liste de réservations.
function ReservationList({ title, cards, backgroundColor }) {
  return (
    <div className="tile is-parent">
      <StyledTile color={backgroundColor} className={`tile is-child`}>
        <div className="content">
          <StyledTitle>{title}</StyledTitle>
          {/* Si aucune carte, on affiche un message. */}
          {cards.length === 0 && (
            <p className="no-card">Aucune réservation à afficher</p>
          )}
          {/* Sinon, on affiche les cartes. */}
          <div className="content">{cards}</div>
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
