import React, { useState, useEffect, useContext } from 'react'
import { useFetchHasura } from '../utils/react/hooks'
import { useMutationHasura } from '../utils/react/hooks'
import { ScreenContext } from '../utils/react/context'
import CustomButton from '../components/button'
import Modal from '../components/modal'
import {
  LIEN_API,
  GET_ALL_RESERVATION,
  VUE_RESERVATION,
  COLUMN_ID,
  COLUMN_NAME,
  COLUMN_DATE_DEBUT,
  COLUMN_DATE_FIN,
  COLUMN_TYPE,
  COLUMN_DESCRIPTION,
  DELETE_RESERVATION,
} from '../utils/database/query'
/*Style*/
import '../styles/calendar.css'
import colors from '../utils/styles/color'
/*Importation des icônes*/
import Icon from '@mdi/react'
import { mdiArrowLeftThick } from '@mdi/js'
import { mdiArrowRightThick } from '@mdi/js'

function Calendar() {
  //Titre de la page.
  document.title = 'Calendrier'

  //Pour savoir si c'est la première fois qu'on charge les données.
  const [firstLoading, setFirstLoading] = useState(true)
  //Obtenir la date du LocalStorage ou utilisez la date actuelle si elle n'existe pas
  const storedDate = localStorage.getItem('currentDate')
  const initialDate = storedDate ? new Date(storedDate) : new Date()
  const [currentDate, setCurrentDate] = useState(initialDate)
  //useState pour ouvrir/fermer la modale.
  const [isModalOpen, setModalOpen] = useState(false)
  //useState pour stocker l'événement sélectionné dans la modale.
  const [modalEvent, setModalEvent] = useState(null)
  //Pour savoir si c'est un appareil mobile.
  const { isMobile } = useContext(ScreenContext)

  //Permet de récupérer la liste des réservations.
  const {
    data: reservation_data,
    isLoading: reservation_loading,
    error: reservation_error,
  } = useFetchHasura(LIEN_API, GET_ALL_RESERVATION, firstLoading)

  //Permet de définir si c'est la première fois qu'on charge la page.
  useEffect(() => {
    setFirstLoading(false)
    localStorage.removeItem('currentDate') //Supprime la date du localStorage.
  }, [])

  //Convertir le type de l'événement en string ou en class ( 1 = réservation, 2 = maintenance).
  const eventType = (type, mode) => {
    if (mode === 'class') {
      switch (type) {
        case 1:
          return 'reservation'
        case 2:
          return 'maintenance'
        default:
          return 'reservation'
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

  //Permet de formater les données pour l'affichage des événements dans le calendrier.
  const formatEvents = (data) => {
    if (!data || !data[VUE_RESERVATION]) return []

    return data[VUE_RESERVATION].map((event) => {
      return {
        id: event[COLUMN_ID],
        title: `${eventType(event[COLUMN_TYPE], 'string')} - ${
          event[COLUMN_NAME]
        }`,
        //description can be null
        description: event[COLUMN_DESCRIPTION] || '',
        type: event[COLUMN_TYPE],
        start: new Date(event[COLUMN_DATE_DEBUT]),
        end: new Date(event[COLUMN_DATE_FIN]),
      }
    })
  }

  const eventsJSON = formatEvents(reservation_data)

  //Permet d'envoyer une requête de mutation (INSERT, UPDATE, DELETE) à Hasura.
  const { doMutation } = useMutationHasura(LIEN_API)

  const deleteReservation = async (id) => {
    try {
      const responseDataMutation = await doMutation(DELETE_RESERVATION, { id })
      if (responseDataMutation) {
        alert('Réservation annulée avec succès!')
        setModalOpen(false) // Fermer la modale
        //Stocke la date actuelle dans le localStorage pour recharger la page avec la date actuelle.
        localStorage.setItem('currentDate', currentDate.toISOString())
        //Recharger la page
        window.location.reload()
      }
    } catch (err) {
      console.error(err)
      alert("Une erreur s'est produite lors de l'annulation de la réservation.")
    }
  }

  const confirmDeletion = (id) => {
    const userConfirmed = window.confirm(
      'Êtes-vous sûr de vouloir annuler cette réservation?',
    )
    if (userConfirmed) {
      deleteReservation(id)
    }
  }

  //Fonction pour passer à la semaine/jour suivant(e).
  const nextPeriod = () => {
    const newDate = new Date(currentDate)
    newDate.setDate(newDate.getDate() + (isMobile ? 1 : 7))
    setCurrentDate(newDate)
  }

  //Fonction pour passer à la semaine/jour précédent(e).
  const prevPeriod = () => {
    const newDate = new Date(currentDate)
    newDate.setDate(newDate.getDate() - (isMobile ? 1 : 7))
    setCurrentDate(newDate)
  }

  //Créer un tableau pour stocker les jours de la semaine.
  const daysOfWeek = ['lun', 'mar', 'mer', 'jeu', 'ven', 'sam', 'dim'].map(
    (day, index) => {
      const date = new Date(currentDate)
      const dayOffset = (index - (currentDate.getDay() || 7) + 1) % 7
      date.setDate(currentDate.getDate() + dayOffset)

      return {
        day,
        dateNum: date.getDate(),
        dateDay: day.charAt(0).toUpperCase() + day.slice(1),
        events: eventsJSON //Récupère les événements de la journée.
          //Filtre les événements pour n'afficher que ceux de la journée.
          .filter((event) => {
            const startDay = new Date(event.start)
            startDay.setHours(0, 0, 0, 0) //Définit le début de la journée pour l'événement.
            const endDay = new Date(event.end)
            endDay.setHours(23, 59, 59, 999) //Inclut la fin de la journée dans l'événement.

            return date >= startDay && date <= endDay
          })
          .map((event) => {
            const showTitle =
              date.getDate() === event.start.getDate() &&
              date.getMonth() === event.start.getMonth() &&
              date.getFullYear() === event.start.getFullYear()

            //Vérifie si l'événement dure toute la journée.
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

  //Ouvrir la modale et stocker l'événement sélectionné.
  const openModal = (event) => {
    setModalEvent(event)
    setModalOpen(true)
  }

  //Fermer la modale.
  const closeModal = () => {
    setModalOpen(false)
  }

  //Obtenir le nom du mois.
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
                              )}`}
                              key={event.id}
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
      {/* Modale pour afficher les détails de l'événement */}
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
            <CustomButton
              color={colors.redButton}
              hovercolor={colors.redButtonHover}
              functionclick={() => confirmDeletion(modalEvent?.id)}
            >
              Annuler la réservation
            </CustomButton>
          </>
        }
      />
    </div>
  )
}

export default Calendar
