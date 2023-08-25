import React from 'react'
/*Composants*/
import ShowCalendar from '../components/showcalendar'
/*Style*/
import '../styles/calendar.css'

function Calendar() {
  //Titre de la page.
  document.title = 'Calendrier'

  return (
    <div>
      <ShowCalendar isAdmin={false} />
    </div>
  )
}

export default Calendar
