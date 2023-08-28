import React, { useState, useEffect, useContext, useMemo } from 'react'
import { useFetchHasura } from '../utils/react/hooks'
import { ScreenContext } from '../utils/react/context'
/*Types*/
import PropTypes from 'prop-types'
/*Composants*/
import EventModal from '../components/eventModal'
/*Base de données*/
import {
  LIEN_API,
  GET_ALL_RESERVATION,
  GET_RESERVATION,
  VUE_RESERVATION,
  COLUMN_ID,
  COLUMN_NAME,
  COLUMN_DATE_DEBUT,
  COLUMN_DATE_FIN,
  COLUMN_TYPE,
  COLUMN_DESCRIPTION,
} from '../utils/database/query'
/*Style*/
import '../styles/calendar.css'
/*Importation des icônes*/
import Icon from '@mdi/react'
import { mdiArrowLeftThick } from '@mdi/js'
import { mdiArrowRightThick } from '@mdi/js'

function ShowCalendar({ isAdmin = false }) {
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

  const API_REQUEST = isAdmin ? GET_ALL_RESERVATION : GET_RESERVATION

  const userId = localStorage.getItem('userId')
  //Permet de récupérer la liste des réservations.
  const adminVariables = useMemo(() => ({}), [])
  const userVariables = useMemo(() => ({ userId }), [userId])
  const {
    data: reservation_data,
    isLoading: reservation_loading,
    error: reservation_error,
  } = useFetchHasura(
    LIEN_API,
    API_REQUEST,
    firstLoading,
    isAdmin ? adminVariables : userVariables,
  )

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
  const eventsJSON = formatEvents(reservation_data)

  //Pour stocker la valeur de la barre de recherche.
  const [searchValue, setSearchValue] = useState('')

  //Quand utilisateur tape dans la barre de recherche filtrer les événements par leur titre.
  function handleSearch(e) {
    const value = e.target.value
    setSearchValue(value)
  }

  //Filtrer les événements par leur titre et par la valeur de la barre de recherche.
  const filteredEvents = useMemo(() => {
    //Supprimer les accents.
    function removeAccents(str) {
      return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    }

    return eventsJSON.filter((event) =>
      removeAccents(event.title.toLowerCase()).includes(
        removeAccents(searchValue.toLowerCase()),
      ),
    )
  }, [eventsJSON, searchValue])

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
        events: filteredEvents //Récupère les événements de la journée.
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

              const startMinute =
                date.getDate() === event.start.getDate() &&
                date.getMonth() === event.start.getMonth() &&
                date.getFullYear() === event.start.getFullYear()
                  ? event.start.getMinutes()
                  : 0
              const endMinute =
                date.getDate() === event.end.getDate() &&
                date.getMonth() === event.end.getMonth() &&
                date.getFullYear() === event.end.getFullYear()
                  ? event.end.getMinutes()
                  : 0

              return {
                ...event,
                showTitle,
                style: {
                  top: `${startHour * 30 + startMinute / 2}px`, // 30px par heure + 0.5px par minute (30 minutes = 15px) (1 heure = 30px)
                  bottom: `${(24 - endHour) * 30 - endMinute / 2}px`, // 30px par heure + 0.5px par minute (30 minutes = 15px) (1 heure = 30px)
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

  //Obtenir le nom du mois actuel en français et mettre la première lettre en majuscule.
  const monthName = currentDate
    .toLocaleDateString('fr-FR', { month: 'long' })
    .replace(/^\w/, (char) => char.toUpperCase())

  //Obtenir la position actuelle de l'heure et des minutes pour la ligne rouge de l'heure actuelle.
  const now = new Date()
  const currentHour = now.getHours()
  const currentMinute = now.getMinutes()
  const currentPosition = currentHour * 30 + currentMinute / 2 // 30px par heure + 0.5px par minute (30 minutes = 15px) (1 heure = 30px)

  return (
    <div className="calendar section">
      <div className="container">
        <div>
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
          {/* Barre de recherche */}
          <div className="columns mb-4 custom-search">
            <input
              className="input column is-half is-offset-one-quarter"
              type="text"
              placeholder="Recherche"
              onChange={handleSearch}
            />
          </div>
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
                        <div className="loader is-loading"></div>
                      ) : reservation_error ? (
                        <div>Erreur lors du chargement des réservations !</div>
                      ) : (
                        <>
                          {day.events.map((event, index, eventsArray) => {
                            // Vérifie si l'événement est en chevauchement avec un autre événement
                            const overlappingEvents = eventsArray.filter(
                              (otherEvent) =>
                                (event.start >= otherEvent.start &&
                                  event.start <= otherEvent.end) ||
                                (event.end >= otherEvent.start &&
                                  event.end <= otherEvent.end),
                            )

                            const isOverlapping = overlappingEvents.length > 1

                            const overlappingIndex =
                              overlappingEvents.indexOf(event)
                            const eventWidth = isOverlapping
                              ? 100 - overlappingIndex * 10
                              : 100

                            const eventStyle = {
                              ...event.style,
                              width: `${eventWidth}%`, // Ajuste la largeur en fonction des événements en chevauchement
                              //aligner toute la box a droite
                              left: eventWidth !== 100 ? 'auto' : 0,
                              //ajouter de la transparence aux événements en chevauchement
                              opacity: eventWidth !== 100 ? 0.75 : 1,
                            }

                            return (
                              <React.Fragment key={event.id}>
                                <div
                                  className={`box event ${eventType(
                                    event.type,
                                    'class',
                                  )}`}
                                  key={event.id}
                                  style={eventStyle}
                                  onClick={() => openModal(event)}
                                >
                                  {event.showTitle && (
                                    <p className="title is-6 is-size-7">
                                      {event.title}
                                    </p>
                                  )}
                                  {/* Si c'est mobile afficher le titre pour chaque journée */}
                                  {isMobile && !event.showTitle && (
                                    <p className="title is-6 is-size-7">
                                      {event.title}
                                    </p>
                                  )}
                                </div>

                                {/* Si c'est aujourd'hui */}
                                {day.dateNum === new Date().getDate() && (
                                  //Afficher ligne rouge pour indiquer l'heure actuelle
                                  <div
                                    className="current-time-line"
                                    style={{
                                      position: 'absolute',
                                      top: `${currentPosition}px`,
                                      width: '100%',
                                      height: '2px',
                                      backgroundColor: 'red',
                                    }}
                                  ></div>
                                )}
                              </React.Fragment>
                            )
                          })}
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

//Définition des types des props.
ShowCalendar.propTypes = {
  isAdmin: PropTypes.bool,
}

export default ShowCalendar
