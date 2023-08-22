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

  //Pour savoir si c'est un appareil mobile ou tablette.
  const { isMobileTablet } = useContext(ScreenContext)

  //Affichage selon le type d'appareil.
  return (
    <div>
      {/* DESIGN POUR MOBILE : DESIGN POUR TABLETTE ET ORDINATEUR */}
      <div
        className={isMobileTablet ? 'columns-mobile-tablet' : 'columns-desktop'}
      >
        <div className="columns-size">
          <h1>Tableau de bord</h1>
          <div className="box">
            <Link to="/admin/category">Gestion des catégories</Link>
          </div>
          <div className="box">
            <Link to="/admin/machinery">Gestion de la machinerie</Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard

/*À FAIRE :
- Gestion du calendrier.
- Gestion du calendrier de réservations des utilisateurs avec sélecteur pour choix de l'utilisateur.*/
