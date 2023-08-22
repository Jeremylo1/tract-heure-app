import React, { useContext } from 'react'
import { ScreenContext } from '../utils/react/context'
import { Link } from 'react-router-dom'
/*Style*/
import colors from '../utils/styles/color'
import '../styles/admin_dashboard.css'

//Page d'accueil pour l'administrateur.
function Dashboard() {
  //Titre de la page.
  document.title = 'Tableau de bord'

  //Pour savoir si c'est un appareil mobile.
  const { isMobileTablet } = useContext(ScreenContext)

  return (
    <div>
      {/* DESIGN POUR MOBILE : DESIGN POUR TABLETTE ET ORDINATEUR */}
      <div
        className={isMobileTablet ? 'columns-mobile' : 'columns-tablet-desktop'}
      >
        <div className="columns-size">
          <h1>Tableau de bord</h1>
        </div>
      </div>

      {/*
      <div>
        Calendrier de réservations des utilisateurs avec sélecteur pour choix de
        l'utilisateur
      </div>
      <div>Calendrier</div>
      <div>
        <Link to="/test" className="button is-info">
          Direction TO DO
        </Link>
      </div>
      <div>
        <Link to="/admin/category" className="button is-link is-rounded">
          Gestion des catégories
        </Link>
      </div>
      <div>
        <Link to="/admin/machinery" className="button is-link is-rounded">
          Gestion de la machinerie
        </Link>
        </div>*/}
    </div>
  )
}

export default Dashboard
