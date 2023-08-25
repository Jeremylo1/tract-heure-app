import React, { useContext, useState, useEffect, useMemo } from 'react'
import { ScreenContext } from '../utils/react/context'
import { useFetchHasura } from '../utils/react/hooks'
import { formatShortDate, formatTime } from '../utils/reusable/functions'
/*Composants*/
import ReservationList from '../components/reservationlist'
import EventModal from '../components/eventModal'
/*Base de données*/
import {
  LIEN_API,
  GET_RESERVATION,
  VUE_RESERVATION,
  COLUMN_ID,
  COLUMN_NAME,
  COLUMN_DESCRIPTION,
  COLUMN_TYPE,
  COLUMN_DATE_DEBUT,
  COLUMN_DATE_FIN,
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

  //useState pour ouvrir/fermer la modale.
  const [isModalOpen, setModalOpen] = useState(false)
  //useState pour stocker l'événement sélectionné dans la modale.
  const [modalEvent, setModalEvent] = useState(null)

  //Recupérer l'id de l'utilisateur.
  const userId = localStorage.getItem('userId')
  const userVariables = useMemo(() => ({ userId }), [userId])

  //Pour obtenir les réservations de l'utilisateur.
  const {
    data: reservation_data,
    isLoading: reservation_loading,
    error: reservation_error,
  } = useFetchHasura(LIEN_API, GET_RESERVATION, firstLoading, userVariables)

  //Les cartes à afficher dans les listes.
  const [inProgressCards, setInProgressCards] = useState([])
  const [upcomingCards, setUpcomingCards] = useState([])
  const [finishedCards, setFinishedCards] = useState([])

  //Permet de définir si c'est la première fois qu'on charge la page.
  useEffect(() => {
    setFirstLoading(false)
  }, [])

  const formatEvents = (data) => {
    if (!data || !data[VUE_RESERVATION]) return []

    return data[VUE_RESERVATION].map((event) => {
      return {
        id: event[COLUMN_ID],
        title: `${event[COLUMN_NAME]}`,
        //La description est vide si elle n'existe pas.
        description: event[COLUMN_DESCRIPTION] || '',
        type: event[COLUMN_TYPE],
        start: new Date(event[COLUMN_DATE_DEBUT]),
        end: new Date(event[COLUMN_DATE_FIN]),
      }
    })
  }
  // Pour stocker les données formatées.
  const formatedEvents = useMemo(
    () => formatEvents(reservation_data),
    [reservation_data],
  )

  //Permet de créer les cartes à afficher dans les listes.
  useEffect(() => {
    //Si on a des données.
    if (formatedEvents && formatedEvents.length > 0) {
      const today = new Date()

      const inProgress = []
      const upcoming = []
      const finished = []

      //Pour chaque événement on crée une carte.
      formatedEvents.forEach((event) => {
        const startDate = event.start
        const endDate = event.end

        //On détermine la classe de la carte selon le type de réservation.
        const cardClass = event.type === 2 ? 'maintenance' : 'reservation'

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
            key={event.id}
            className={`card reservation-card ${cardClass}`}
            onClick={() => openModal(event)}
          >
            <strong>{event.title}</strong>
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
      setFinishedCards(finished.reverse())
    }
  }, [formatedEvents])

  if (reservation_loading) return <div className="loader is-loading"></div>
  if (reservation_error)
    return <div>Erreur lors du chargement des réservations!</div>

  //Ouvrir la modale et stocker l'événement sélectionné.
  const openModal = (data) => {
    setModalEvent(data)
    setModalOpen(true)
  }

  //Fermer la modale.
  const closeModal = () => {
    setModalOpen(false)
  }

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
            onNext={() => setInProgressIndex(inProgressIndex + 5)}
            onPrev={() => setInProgressIndex((prev) => Math.max(prev - 5, 0))}
            currentIndex={inProgressIndex}
          />
          <ReservationList
            title="À venir"
            cards={upcomingCards}
            backgroundColor={colors.colorFuture}
            onNext={() => setUpcomingIndex(upcomingIndex + 5)}
            onPrev={() => setUpcomingIndex((prev) => Math.max(prev - 5, 0))}
            currentIndex={upcomingIndex}
          />
          <ReservationList
            title="Terminé"
            cards={finishedCards}
            backgroundColor={colors.colorePast}
            onNext={() => setFinishedIndex(finishedIndex + 5)}
            onPrev={() => setFinishedIndex((prev) => Math.max(prev - 5, 0))}
            currentIndex={finishedIndex}
          />
        </div>
      </div>
      {/* Modale pour afficher les détails de l'événement */}
      {modalEvent && (
        <EventModal
          isOpen={isModalOpen}
          onClose={closeModal}
          event={modalEvent}
        />
      )}
    </div>
  )
}

export default Home
