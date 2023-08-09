import React, { useState, useEffect } from 'react'
import '../styles/calendar.css'
import { useFetchHasura } from '../utils/react/hooks'
import { formatDate } from '../utils/reusable/functions'
import StyledTitlePage from '../utils/styles/atoms'
/*Importation des icônes*/
import Icon from '@mdi/react'
import { mdiArrowLeftThick } from '@mdi/js'
import { mdiArrowRightThick } from '@mdi/js'

function Calendar() {
  /*INFOS SUR LA BASE DE DONNÉES (À MODIFIER AU BESOIN)*/
  //Lien de l'API GraphQL à utiliser.
  const api_url = 'https://champion-tiger-15.hasura.app/v1/graphql'
  //Nom des tables à utiliser.
  const table_machinerie = 'machinerie'
  const table_reservation = 'machinerie_reservation'
  //Nom des colonnes à utiliser.
  const column_id = 'id'
  const column_id_machinerie = 'machinerie_id'
  const column_date_debut = 'date_debut'
  const column_date_fin = 'date_fin'
  const column_type = 'type'
  const column_description = 'description'
  /*FIN DES INFOS*/

  //Pour savoir si c'est la première fois qu'on charge les données.
  const [firstLoading, setFirstLoading] = useState(true)

  //Permet de récupérer la liste des réservations.
  const {
    data: reservation_data,
    isLoading: reservation_loading,
    error: reservation_error,
  } = useFetchHasura(
    api_url,
    `{${table_reservation}{${column_id} ${column_id_machinerie} ${column_date_debut} ${column_date_fin} ${column_type} ${column_description}}}`,
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

  const formatEvents = (data) => {
    if (!data || !data[table_reservation]) return []

    return data[table_reservation].map((event) => {
      return {
        id: event[column_id],
        // title = eventType + nom de la machinerie : "event-reservation - Tracteur 1"
        title: `${eventType(event[column_type], 'string')} - ${
          event[column_id_machinerie]
        }`,
        description: event[column_description].join(', '),
        type: event[column_type],
        start: new Date(event[column_date_debut]),
        end: new Date(event[column_date_fin]),
      }
    })
  }

  const eventsJSON = formatEvents(reservation_data)

  // Exemple de données JSON pour les événements (POUR LES TESTS)
  // const eventsJSON = [
  //   {
  //     id: 0,
  //     title: 'Securities Regulation',
  //     description:
  //       'Lorem ipsum dolor sit amet, consectetur adipiscing elit. #0',
  //     type: 1,
  //     allDay: true,
  //     start: new Date(2023, 7, 7), // 7 août 2023
  //     end: new Date(2023, 7, 7),
  //   },
  //   {
  //     id: 1,
  //     title: 'Corporate Finance',
  //     description:
  //       'Lorem ipsum dolor sit amet, consectetur adipiscing elit. #1',
  //     type: 2,
  //     start: new Date(2023, 7, 8, 20), // 8 août 2023, 15h00
  //     end: new Date(2023, 7, 10, 18), // 10 août 2023, 18h00
  //   },
  //   {
  //     id: 2,
  //     title: 'Corporate Finance',
  //     description:
  //       'Lorem ipsum dolor sit amet, consectetur adipiscing elit. #2',
  //     type: 1,
  //     start: new Date(2023, 7, 7, 10), //7 août 2023, 10h00
  //     end: new Date(2023, 7, 7, 14), // 7 août 2023, 14h00
  //   },
  //   {
  //     id: 3,
  //     title: 'France 2',
  //     description:
  //       'Lorem ipsum dolor sit amet, consectetur adipiscing elit. #3',
  //     type: 1,
  //     start: new Date(2023, 7, 4, 0),
  //     end: new Date(2023, 7, 4, 19),
  //   },
  //   // Ajouter plus d'événements ici pour les tests
  // ]

  // Obtenir la date actuelle et la stocker dans l'état
  const [currentDate, setCurrentDate] = useState(new Date())

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
        events: eventsJSON
          .filter((event) => {
            const startDay = event.start
            const endDay = new Date(event.end)
            endDay.setHours(23, 59, 59, 999) // Inclut la fin de la journée dans l'événement

            return date >= startDay && date <= endDay
          })
          .map((event) => {
            const showTitle =
              date.getDate() === event.start.getDate() &&
              date.getMonth() === event.start.getMonth() &&
              date.getFullYear() === event.start.getFullYear()
            if (event.allDay) {
              // Pour les événements sur toute la journée, utilisez 0 pour l'heure de début et 23 pour l'heure de fin
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

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768)

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

  const [isModalOpen, setModalOpen] = useState(false) // useState pour ouvrir/fermer la modale
  const [modalEvent, setModalEvent] = useState(null) // useState pour stocker l'événement sélectionné dans la modale

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
      {isModalOpen && (
        <div className="modal is-active">
          <div className="modal-background" onClick={closeModal}></div>
          <div className="modal-card">
            <header className="modal-card-head">
              <p className="modal-card-title">{modalEvent?.title}</p>
              <button
                className="delete"
                aria-label="close"
                onClick={closeModal}
              ></button>
            </header>
            <section className="modal-card-body">
              <h2>Description:</h2>
              <p>{modalEvent?.description}</p>
              <h3>Type:</h3>
              <p>{eventType(modalEvent?.type, 'string')}</p>
              <h3>Date de début:</h3>
              <p>{modalEvent?.start.toLocaleString()}</p>
              <h3>Date de fin:</h3>
              <p>{modalEvent?.end.toLocaleString()}</p>
            </section>
          </div>
        </div>
      )}
    </div>
  )
}

export default Calendar
