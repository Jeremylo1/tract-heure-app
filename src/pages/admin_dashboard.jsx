import React, { useContext } from 'react'
import { ScreenContext } from '../utils/react/context'
/*Style*/
import StyledTitlePage from '../utils/styles/atoms'

//Page d'accueil pour l'administrateur.
function Dashboard() {
  //Pour savoir si c'est un appareil mobile.
  const { isMobile } = useContext(ScreenContext)

  return (
    <div>
      <StyledTitlePage>Dashboard pour admin</StyledTitlePage>
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
