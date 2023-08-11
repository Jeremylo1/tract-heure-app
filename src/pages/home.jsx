import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { ScreenContext } from '../utils/react/context'
/*CSS*/
import 'bulma/css/bulma.min.css'
import '../styles/home.css'

function Home() {
  //Pour savoir si c'est un appareil mobile.
  const { isMobile } = useContext(ScreenContext)
  return (
    <div>
      {isMobile ? (
        /* DESIGN POUR MOBILE */
        <div>
          <div className="columns-mobile">
            <div className="columns-mobile-size">
              <h1>Bienvenue sur Tract'Heure !</h1>
            </div>
          </div>
        </div>
      ) : (
        /* DESIGN POUR TABLETTE ET ORDINATEUR */
        <div>
          <div className="columns-tablet-desktop">
            <div className="columns-tablet-desktop-size">
              <h1>Bienvenue sur Tract'Heure !</h1>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Home
