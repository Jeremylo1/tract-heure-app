import React, { useContext } from 'react'
import { ScreenContext } from '../utils/react/context'

//Page d'accueil pour l'administrateur.
function Dashboard() {
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
    </div>
  )
}

export default Dashboard
