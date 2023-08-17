import React from 'react'
/*Style*/
import 'bulma/css/bulma.min.css'

function ReservationList({ title, cards, notificationClass }) {
  return (
    <div className="tile is-parent">
      <article className={`tile is-child notification ${notificationClass}`}>
        <div className="content">
          <p className="title">{title}</p>
          {/* Si aucune carte, on affiche un message. */}
          {cards.length === 0 && (
            <p className="no-card">Aucune réservation à afficher</p>
          )}
          {/* Sinon, on affiche les cartes. */}
          <div className="content">{cards}</div>
        </div>
      </article>
    </div>
  )
}

export default ReservationList
