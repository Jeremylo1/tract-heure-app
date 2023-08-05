import React, { useState, useEffect } from 'react'
import '../styles/calendar.css'

function Calendar() {
  // Exemple de données JSON pour les événements
  const eventsJSON = [
    {
      id: 0,
      title: 'Securities Regulation',
      allDay: true,
      start: new Date(2023, 7, 7), // 7 août 2023
      end: new Date(2023, 7, 7),
    },
    {
      id: 1,
      title: 'Corporate Finance',
      start: new Date(2023, 7, 8, 15), // 8 août 2023, 15h00
      end: new Date(2023, 7, 10, 18), // 10 août 2023, 18h00
    },
    {
      id: 2,
      title: 'Corporate Finance',
      start: new Date(2023, 7, 7, 10), //7 août 2023, 10h00
      end: new Date(2023, 7, 7, 14), // 7 août 2023, 14h00
    },
    {
      id: 3,
      title: 'France 2',
      start: new Date(2023, 7, 4, 0),
      end: new Date(2023, 7, 4, 19),
    },
    // Ajouter plus d'événements ici pour les tests
  ]

  // Obtenir la date actuelle et la stocker dans l'état
  const [currentDate, setCurrentDate] = useState(new Date())

  // Fonction pour passer à la semaine suivante
  const nextWeek = () => {
    const newDate = new Date(currentDate)
    newDate.setDate(newDate.getDate() + 7)
    setCurrentDate(newDate)
  }

  // Fonction pour passer à la semaine précédente
  const prevWeek = () => {
    const newDate = new Date(currentDate)
    newDate.setDate(newDate.getDate() - 7)
    setCurrentDate(newDate)
  }

  // Créer un tableau pour stocker les jours de la semaine
  const daysOfWeek = ['lun', 'mar', 'mer', 'jeu', 'ven', 'sam', 'dim'].map(
    (day, index) => {
      const date = new Date(currentDate)
      date.setDate(currentDate.getDate() - currentDate.getDay() + (index + 1))

      return {
        day,
        dateNum: date.getDate(),
        dateDay: day.charAt(0).toUpperCase() + day.slice(1),
        events: eventsJSON
          .filter((event) => {
            if (event.allDay) {
              // Si l'événement dure toute la journée, vérifiez si la date du jour est égale à celle de l'événement
              return (
                date.getFullYear() === event.start.getFullYear() &&
                date.getMonth() === event.start.getMonth() &&
                date.getDate() === event.start.getDate()
              )
            } else {
              const eventDate = new Date(date)
              eventDate.setHours(event.start.getHours())
              eventDate.setMinutes(event.start.getMinutes())
              return (
                (date >= event.start && date <= event.end) ||
                (eventDate >= event.start && eventDate <= event.end)
              )
            }
          })
          .map((event) => {
            if (event.allDay) {
              // Pour les événements sur toute la journée, utilisez 0 pour l'heure de début et 23 pour l'heure de fin
              return {
                ...event,
                style: {
                  top: '0px',
                  bottom: '0px',
                },
              }
            } else {
              const startHour =
                date.getDate() !== event.start.getDate()
                  ? 0
                  : event.start.getHours()
              const endHour =
                date.getDate() !== event.end.getDate()
                  ? 24
                  : event.end.getHours()
              return {
                ...event,
                style: {
                  top: `${startHour * 25}px`,
                  bottom: `${(24 - endHour) * 25}px`,
                },
              }
            }
          }),
      }
    },
  )

  // Obtenir le nom du mois
  const monthName = currentDate.toLocaleDateString('fr-FR', { month: 'long' })

  return (
    <div className="calendar section">
      <div className="container">
        <div className="header level">
          <button onClick={prevWeek} className="button is-info">
            Previous Week
          </button>
          <h2 className="title is-4 level-item">
            {monthName} {currentDate.getFullYear()}
          </h2>
          <button onClick={nextWeek} className="button is-info">
            Next Week
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
            {daysOfWeek.map((day) => (
              <div className={`day column ${day.day}`} key={day.day}>
                <div className="date has-text-centered">
                  <p className="date-num title is-5">{day.dateNum}</p>
                  <p className="date-day subtitle is-6">{day.dateDay}</p>
                </div>
                <div className="events">
                  {day.events.map((event) => (
                    <div
                      className={`event notification ${event.type} ${
                        event.allDay ? 'allday' : ''
                      }`}
                      key={event.title}
                      style={event.style}
                    >
                      <p className="title is-6">{event.title}</p>
                      <p className="time subtitle is-7">
                        {event.start.getHours()}h - {event.end.getHours()}h
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Calendar
