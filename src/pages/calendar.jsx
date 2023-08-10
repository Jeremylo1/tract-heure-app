import React, { useState, useEffect } from 'react'
import '../styles/calendar.css'
import { useFetchHasura } from '../utils/react/hooks'
import { formatDate } from '../utils/reusable/functions'
import StyledTitlePage from '../utils/styles/atoms'
import Modal from '../components/modal'
/*Importation des icônes*/
import Icon from '@mdi/react'
import { mdiArrowLeftThick } from '@mdi/js'
import { mdiArrowRightThick } from '@mdi/js'

function Calendar() {
  /*INFOS SUR LA BASE DE DONNÉES (À MODIFIER AU BESOIN)*/
  //Lien de l'API GraphQL à utiliser.
  const api_url = 'https://champion-tiger-15.hasura.app/v1/graphql'
  //Nom des tables à utiliser.
  const vue_reservation = 'machinerie_reservations_view'
  //Nom des colonnes à utiliser.
  const column_id = 'id'
  const column_nom_machinerie = 'nom'
  const column_date_debut = 'date_debut'
  const column_date_fin = 'date_fin'
  const column_type = 'type'
  const column_description = 'description'
  /*FIN DES INFOS*/

  //Pour savoir si c'est la première fois qu'on charge les données.
  const [firstLoading, setFirstLoading] = useState(true)
  // Obtenir la date actuelle et la stocker dans l'état
  const [currentDate, setCurrentDate] = useState(new Date())
  // useState pour définir si l'écran est mobile ou non
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768)
  // useState pour ouvrir/fermer la modale
  const [isModalOpen, setModalOpen] = useState(false)
  // useState pour stocker l'événement sélectionné dans la modale
  const [modalEvent, setModalEvent] = useState(null)

  //Permet de récupérer la liste des réservations.
  const {
    data: reservation_data,
    isLoading: reservation_loading,
    error: reservation_error,
  } = useFetchHasura(
    api_url,
    `{${vue_reservation}{${column_id} ${column_nom_machinerie} ${column_date_debut} ${column_date_fin} ${column_type} ${column_description}}}`,
    firstLoading,
  )

  //Permet de définir si c'est la première fois qu'on charge la page.
  useEffect(() => {
    setFirstLoading(false)
  }, [])

  // Convert events type to string ( 1 = réservation, 2 = maintenance)
  const eventType = (type, mode) => {
    if (mode === 'class') {
      switch (type) {
        case 1:
          return 'event-reservation'
        case 2:
          return 'event-maintenance'
        default:
          return 'event-reservation'
      }
    } else {
      switch (type) {
        case 1:
          return 'Réservation'
        case 2:
          return 'Maintenance'
        default:
          return 'Réservation'
      }
    }
  }

  // Permet de formater les données pour l'affichage des événements dans le calendrier
  const formatEvents = (data) => {
    if (!data || !data[vue_reservation]) return []

    return data[vue_reservation].map((event) => {
      return {
        id: event[column_id],
        title: `${eventType(event[column_type], 'string')} - ${
          event[column_nom_machinerie]
        }`,
        //description can be null
        description: event[column_description] || '',
        type: event[column_type],
        start: new Date(event[column_date_debut]),
        end: new Date(event[column_date_fin]),
      }
    })
  }

  const eventsJSON = formatEvents(reservation_data)

  // Fonction pour passer à la semaine/jour suivant
  const nextPeriod = () => {
    const newDate = new Date(currentDate)
    newDate.setDate(newDate.getDate() + (isMobile ? 1 : 7))
    setCurrentDate(newDate)
  }

  // Fonction pour passer à la semaine/jour précédente
  const prevPeriod = () => {
    const newDate = new Date(currentDate)
    newDate.setDate(newDate.getDate() - (isMobile ? 1 : 7))
    setCurrentDate(newDate)
  }

  // Créer un tableau pour stocker les jours de la semaine
  const daysOfWeek = ['lun', 'mar', 'mer', 'jeu', 'ven', 'sam', 'dim'].map(
    (day, index) => {
      const date = new Date(currentDate)
      const dayOffset = (index - (currentDate.getDay() || 7) + 1) % 7
      date.setDate(currentDate.getDate() + dayOffset)

      return {
        day,
        dateNum: date.getDate(),
        dateDay: day.charAt(0).toUpperCase() + day.slice(1),
        events: eventsJSON // Récupère les événements de la journée
          // Filtre les événements pour n'afficher que ceux de la journée
          .filter((event) => {
            const startDay = new Date(event.start)
            console.log('startDay', startDay)
            startDay.setHours(0, 0, 0, 0) // Définit le début de la journée pour l'événement
            const endDay = new Date(event.end)
            console.log('endDay', endDay)
            endDay.setHours(23, 59, 59, 999) // Inclut la fin de la journée dans l'événement

            return date >= startDay && date <= endDay
          })
          .map((event) => {
            const showTitle =
              date.getDate() === event.start.getDate() &&
              date.getMonth() === event.start.getMonth() &&
              date.getFullYear() === event.start.getFullYear()

            // Vérifie si l'événement est sur toute la journée
            const allDay =
              event.start.getDay() === event.end.getDay() &&
              event.start.getMonth() === event.end.getMonth() &&
              event.start.getFullYear() === event.end.getFullYear() &&
              event.start.getHours() === 0 &&
              event.start.getMinutes() === 0 &&
              event.start.getSeconds() === 0 &&
              event.end.getHours() === 23 &&
              event.end.getMinutes() === 59 &&
              event.end.getSeconds() === 59
            if (allDay) {
              return {
                ...event,
                showTitle,
                style: {
                  top: '0px',
                  bottom: '0px',
                },
              }
            } else {
              const startHour =
                date.getDate() === event.start.getDate() &&
                date.getMonth() === event.start.getMonth() &&
                date.getFullYear() === event.start.getFullYear()
                  ? event.start.getHours()
                  : 0
              const endHour =
                date.getDate() === event.end.getDate() &&
                date.getMonth() === event.end.getMonth() &&
                date.getFullYear() === event.end.getFullYear()
                  ? event.end.getHours()
                  : 24
              console.log('info', event)

              return {
                ...event,
                showTitle,
                style: {
                  top: `${startHour * 30}px`,
                  bottom: `${(24 - endHour) * 30}px`,
                },
              }
            }
          }),
      }
    },
  )

  // Ecouteur pour le redimensionnement de la fenêtre
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768)
    }
    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  // Ouvrir la modale et stocker l'événement sélectionné
  const openModal = (event) => {
    setModalEvent(event)
    setModalOpen(true)
  }

  // Fermer la modale
  const closeModal = () => {
    setModalOpen(false)
  }

  // Obtenir le nom du mois
  const monthName = currentDate.toLocaleDateString('fr-FR', { month: 'long' })

  return (
    <div className="calendar section">
      <div className="container">
        <div className="header level calendar-header">
          <button onClick={prevPeriod} className="button is-link">
            <Icon path={mdiArrowLeftThick} size={1} />
          </button>
          <h2 className="title is-4 level-item">
            {monthName} {currentDate.getFullYear()}
          </h2>
          <button onClick={nextPeriod} className="button is-link">
            <Icon path={mdiArrowRightThick} size={1} />
          </button>
        </div>
        <div className="calendar-grid">
          <div className="timeline">
            <div className="time-space"></div>
            {[
              '00:00',
              '01:00',
              '02:00',
              '03:00',
              '04:00',
              '05:00',
              '06:00',
              '07:00',
              '08:00',
              '09:00',
              '10:00',
              '11:00',
              '12:00',
              '13:00',
              '14:00',
              '15:00',
              '16:00',
              '17:00',
              '18:00',
              '19:00',
              '20:00',
              '21:00',
              '22:00',
              '23:00',
            ].map((time) => (
              <div className="time-marker" key={time}>
                {time}
              </div>
            ))}
          </div>
          <div className="days">
            {daysOfWeek.map(
              (day, index) =>
                (!isMobile || index === (currentDate.getDay() - 1 + 7) % 7) && (
                  <div className={`day column ${day.day}`} key={day.day}>
                    <div className="date has-text-centered">
                      <p className="date-num title is-5">{day.dateNum}</p>
                      <p className="date-day subtitle is-6">{day.dateDay}</p>
                    </div>
                    <div className="events">
                      {reservation_loading ? (
                        <div>Chargement des réservations...</div>
                      ) : reservation_error ? (
                        <div>Erreur lors du chargement des réservations !</div>
                      ) : (
                        <>
                          {day.events.map((event) => (
                            <div
                              className={`box event ${eventType(
                                event.type,
                                'class',
                              )} ${event.allDay ? 'allday' : ''}`}
                              key={event.title}
                              style={event.style}
                              onClick={() => openModal(event)}
                            >
                              {event.showTitle && (
                                <p className="title is-6">{event.title}</p>
                              )}
                              {/* Si c'est mobile afficher le titre pour chaque journée */}
                              {isMobile && !event.showTitle && (
                                <p className="title is-6">{event.title}</p>
                              )}
                            </div>
                          ))}
                        </>
                      )}
                    </div>
                  </div>
                ),
            )}
          </div>
        </div>
      </div>

      <Modal
        title={modalEvent?.title || "Détails de l'événement"}
        isOpen={isModalOpen}
        onClose={closeModal}
        content={
          <>
            <h2>Description:</h2>
            <p>{modalEvent?.description}</p>
            <h3>Type:</h3>
            <p>{eventType(modalEvent?.type, 'string')}</p>
            <h3>Date de début:</h3>
            <p>{modalEvent?.start.toLocaleString()}</p>
            <h3>Date de fin:</h3>
            <p>{modalEvent?.end.toLocaleString()}</p>
          </>
        }
      />
    </div>
  )
}

export default Calendar
