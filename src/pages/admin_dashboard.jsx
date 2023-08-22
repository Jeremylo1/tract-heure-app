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
  const { isMobile } = useContext(ScreenContext)

  //Affichage selon le type d'appareil.
  return (
    <div>
      {/* DESIGN POUR MOBILE : DESIGN POUR TABLETTE ET ORDINATEUR */}
      <div className={isMobile ? 'columns-mobile' : 'columns-tablet-desktop'}>
        <div
          className={
            isMobile ? 'columns-mobile-size' : 'columns-tablet-desktop-size'
          }
        >
          <h1>Tableau de bord</h1>
          <div className="box-container">
            <Link
              to="/admin/category"
              className="box square-box category-box mr-2" //mr-2 pour margin-right: 2rem;
            >
              <div className="box-content">Gestion des catégories</div>
            </Link>

            <Link
              to="/admin/machinery"
              className="box square-box machinery-box mr-2" //mr-2 pour margin-right: 2rem;
            >
              <div className="box-content">Gestion de la machinerie</div>
            </Link>
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
