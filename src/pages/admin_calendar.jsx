import React from 'react'
/*Composants*/
import ShowCalendar from '../components/showcalendar'

/*Style*/
import '../styles/admin_machinery.css'

function AdminCalendar() {
  //Titre de la page.
  document.title = 'Tableau de bord - Calendrier'

  return (
    <div>
      <ShowCalendar isAdmin={true} />
    </div>
  )
}

export default AdminCalendar
