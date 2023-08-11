import React, { useContext } from 'react'
import { ScreenContext } from '../utils/react/context'
import { Link } from 'react-router-dom'

//Page d'accueil pour l'administrateur.
function AdminCategory() {
  //Pour savoir si c'est un appareil mobile.
  const { isMobile } = useContext(ScreenContext)

  return (
    <div>
      <h1>Dashboard pour admin</h1>
      <div>Catalogue</div>
      <div>
        Calendrier de réservations des utilisateurs avec sélecteur pour choix de
        l'utilisateur
      </div>
      <div>Calendrier</div>
      <Link to="/test" className="button is-info">
        Tester la connexion à la base de données
      </Link>
    </div>
  )
}

export default AdminCategory
