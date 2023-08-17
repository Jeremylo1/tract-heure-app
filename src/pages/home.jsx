import React, { useContext, useState, useEffect } from 'react'
import { ScreenContext } from '../utils/react/context'
import { useFetchHasura } from '../utils/react/hooks'
import {
  LIEN_API,
  GET_ALL_RESERVATION,
  VUE_RESERVATION,
} from '../utils/database/query'
import ReservationList from '../components/reservationlist'
/*Style*/
import 'bulma/css/bulma.min.css'
import '../styles/home.css'

function Home() {
  const { isMobileTablet } = useContext(ScreenContext)
  //Pour savoir si c'est la première fois qu'on charge les données.
  const [firstLoading, setFirstLoading] = useState(true)

  const {
    data: reservation_data,
    isLoading: reservation_loading,
    error: reservation_error,
  } = useFetchHasura(LIEN_API, GET_ALL_RESERVATION, firstLoading)

  //Les cartes à afficher dans les listes.
  const [inProgressCards, setInProgressCards] = useState([])
  const [upcomingCards, setUpcomingCards] = useState([])
  const [finishedCards, setFinishedCards] = useState([])

  //Permet de définir si c'est la première fois qu'on charge la page.
  useEffect(() => {
    setFirstLoading(false)
  }, [])

  useEffect(() => {
    if (reservation_data && reservation_data[VUE_RESERVATION]) {
      const today = new Date()

      const inProgress = []
      const upcoming = []
      const finished = []

      reservation_data[VUE_RESERVATION].forEach((reservation) => {
        const startDate = new Date(reservation.date_debut)
        const endDate = new Date(reservation.date_fin)

        const cardClass = reservation.type === 2 ? 'maintenance' : 'reservation'

        const card = (
          <div
            key={reservation.id}
            className={`card reservation-card ${cardClass}`}
          >
            {reservation.nom}
          </div>
        )
        if (today >= startDate && today <= endDate) {
          inProgress.push(card)
        } else if (today < startDate) {
          upcoming.push(card)
        } else {
          finished.push(card)
        }
      })

      setInProgressCards(inProgress)
      setUpcomingCards(upcoming)
      setFinishedCards(finished)
    }
  }, [reservation_data])

  if (reservation_loading) return <div>Chargement...</div>
  if (reservation_error)
    return <div>Erreur lors du chargement des réservations!</div>

  // Exemple de cartes fictives pour les sections
  // const inProgressCards = [
  //   <div key="1" className="card reservation-card ">
  //     Carte 1 en cours
  //   </div>,
  //   <div key="2" className="card reservation-card ">
  //     Carte 2 en cours
  //   </div>,
  // ]
  // const upcomingCards = [
  //   <div key="1" className="card reservation-card ">
  //     Carte 1 à venir
  //   </div>,
  // ]
  // const finishedCards = [
  //   <div key="1" className="card reservation-card ">
  //     Carte 1 terminé
  //   </div>,
  //   <div key="2" className="card reservation-card ">
  //     Carte 2 terminé
  //   </div>,
  // ]

  //Affichage de la page selon la taille de l'écran.
  return (
    <div
      className={isMobileTablet ? 'columns-mobile' : 'columns-tablet-desktop'}
    >
      <div className="columns-size">
        <h1>Mes réservations</h1>
        <div className="tile is-ancestor">
          <ReservationList
            title="En cours"
            cards={inProgressCards}
            notificationClass="is-success"
          />
          <ReservationList
            title="À venir"
            cards={upcomingCards}
            notificationClass="is-primary"
          />
          <ReservationList
            title="Terminé"
            cards={finishedCards}
            notificationClass="is-warning"
          />
        </div>
      </div>
    </div>
  )
}

export default Home
