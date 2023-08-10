import React, { useContext } from 'react'
import { ScreenContext } from '../utils/react/context'

function Footer() {
  //Pour savoir si c'est un appareil mobile ou une tablette.
  const { isMobileTablet } = useContext(ScreenContext)

  //Affichage du footer si ce n'est pas un appareil mobile.
  return !isMobileTablet ? (
    <footer className="footer">
      <div className="content has-text-centered">
        <p>
          <strong>Tract'Heure</strong> par Jérémy Le Toullec et Isa Hérode ☺
        </p>
      </div>
    </footer>
  ) : null
}

export default Footer
