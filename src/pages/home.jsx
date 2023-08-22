import React, { useContext, useState, useEffect } from 'react'
import { ScreenContext } from '../utils/react/context'
import { useFetchHasura } from '../utils/react/hooks'
import ReservationList from '../components/reservationlist'
import { formatShortDate, formatTime } from '../utils/reusable/functions'
/*Base de données*/
import {
  LIEN_API,
  GET_ALL_RESERVATION,
  VUE_RESERVATION,
  COLUMN_ID,
  COLUMN_NAME,
  COLUMN_MODEL,
} from '../utils/database/query'
/*Style*/
import colors from '../utils/styles/color'
import 'bulma/css/bulma.min.css'
import '../styles/home.css'

function Home() {
  //Titre de la page.
  document.title = 'Accueil'
  //Pour savoir si c'est la première fois qu'on charge les données.
  const [firstLoading, setFirstLoading] = useState(true)
  //Pour savoir si on est sur un mobile ou une tablette.
  const { isMobile } = useContext(ScreenContext)
  //Pour savoir quelle carte est affichée.
  const [inProgressIndex, setInProgressIndex] = useState(0)
  const [upcomingIndex, setUpcomingIndex] = useState(0)
  const [finishedIndex, setFinishedIndex] = useState(0)

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

  //Permet de créer les cartes à afficher dans les listes.
  useEffect(() => {
    //Si on a des données.
    if (reservation_data && reservation_data[VUE_RESERVATION]) {
      const today = new Date()

      const inProgress = []
      const upcoming = []
      const finished = []

      //Pour chaque réservation on crée une carte.
      reservation_data[VUE_RESERVATION].forEach((reservation) => {
        const startDate = new Date(reservation.date_debut)
        const endDate = new Date(reservation.date_fin)

        //On détermine la classe de la carte selon le type de réservation.
        const cardClass = reservation.type === 2 ? 'maintenance' : 'reservation'

        //Permet de créer la date de la carte.
        const cardDate = (date) => (
          <span>
            {formatShortDate(date)}
            <span> ({formatTime(date)}) </span>
          </span>
        )

        //Permet de créer la carte.
        const card = (
          <div
            key={reservation[COLUMN_ID]}
            className={`card reservation-card ${cardClass}`}
          >
            {reservation[COLUMN_MODEL] ? (
              /*Si le modèle est défini, on l'affiche.*/
              <strong>
                {reservation[COLUMN_NAME]} - {reservation[COLUMN_MODEL]}
              </strong>
            ) : (
              /*Sinon, on affiche seulement le nom.*/
              <strong>{reservation[COLUMN_NAME]}</strong>
            )}
            <div className="reservation-card-date">
              {cardDate(startDate)}
              <br />
              {cardDate(endDate)}
            </div>
          </div>
        )
        //On détermine dans quelle liste on ajoute la carte selon la date (en cours, à venir, terminé).
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

  //Affichage de la page selon le type d'appareil.
  return (
    <div className={isMobile ? 'columns-mobile' : 'columns-tablet-desktop'}>
      <div
        className={
          isMobile ? 'columns-mobile-size' : 'columns-tablet-desktop-size'
        }
      >
        <h1>Mes réservations</h1>
        <div className="tile is-ancestor">
          {/* Pour chaque liste on affiche les cartes correspondantes. */}
          <ReservationList
            title="En cours"
            cards={inProgressCards}
            backgroundColor={colors.colorPresent}
            onNext={() =>
              setInProgressIndex((prev) =>
                Math.min(prev + 5, inProgressCards.length - 5),
              )
            }
            onPrev={() => setInProgressIndex((prev) => Math.max(prev - 5, 0))}
            currentIndex={inProgressIndex}
          />
          <ReservationList
            title="À venir"
            cards={upcomingCards}
            backgroundColor={colors.colorFuture}
            onNext={() =>
              setUpcomingIndex((prev) =>
                Math.min(prev + 5, upcomingCards.length - 5),
              )
            }
            onPrev={() => setUpcomingIndex((prev) => Math.max(prev - 5, 0))}
            currentIndex={upcomingIndex}
          />
          <ReservationList
            title="Terminé"
            cards={finishedCards}
            backgroundColor={colors.colorePast}
            onNext={() =>
              setFinishedIndex((prev) =>
                Math.min(prev + 5, finishedCards.length - 5),
              )
            }
            onPrev={() => setFinishedIndex((prev) => Math.max(prev - 5, 0))}
            currentIndex={finishedIndex}
          />
        </div>
      </div>
    </div>
  )
}

export default Home
