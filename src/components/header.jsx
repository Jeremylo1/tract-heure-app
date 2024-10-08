import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { useConnexion, useTab } from '../utils/react/hooks'
import { ScreenContext } from '../utils/react/context'
/*Types*/
import PropTypes from 'prop-types'
/*Style*/
import LogoTxt from '../assets/logo-texte.png'
import styled from 'styled-components'
import 'bulma/css/bulma.min.css'
/*Importation des icônes*/
import Icon from '@mdi/react'
import { mdiHome } from '@mdi/js'
import { mdiTractorVariant } from '@mdi/js'
import { mdiCalendarMonth } from '@mdi/js'
import { mdiFileEditOutline } from '@mdi/js'
import { mdiMenu } from '@mdi/js'

//Style du logo sur mobile.
const StyledLogoTouch = styled.img`
  width: 150px;
  margin-left: auto;
  margin-right: auto;
  padding: 10px;
  display: block;
`

//Style du logo sur ordinateur.
const StyledLogoDesktop = styled.img`
  width: 150px;
`

//Style du logo sur ordinateur (centré).
const StyledCenteredLogoDesktop = styled.img`
  height: 30px;
  display: block;
  margin: auto;
`

//Entête pour naviguer entre les pages selon le type d'appareil.
function Header() {
  //Pour savoir si l'utilisateur est connecté et son type.
  const { isConnected, userType, handleLogout } = useConnexion()
  //Pour savoir si c'est un appareil mobile ou une tablette.
  const { isMobileTablet } = useContext(ScreenContext)
  //Pour gérer les onglets.
  const { activeTab, handleTabClick } = useTab()

  //Affichage selon le type d'appareil.
  return (
    <div>
      {isMobileTablet ? (
        /* DESIGN POUR MOBILE ET TABLETTE */
        <div>
          <div>
            <StyledLogoTouch src={LogoTxt} alt="Logo" />
          </div>
          {isConnected ? (
            /*Si l'utilisateur est connecté, alors on affiche les onglets.*/
            <div className="tabs is-centered">
              <ul>
                <li
                  className={activeTab === 'accueil' ? 'is-active' : ''}
                  onClick={() => handleTabClick('accueil')}
                >
                  <Link to="/" className="navbar-item">
                    <Icon path={mdiHome} size={1.5} color="black" />
                  </Link>
                </li>
                <li
                  className={activeTab === 'catalogue' ? 'is-active' : ''}
                  onClick={() => handleTabClick('catalogue')}
                >
                  <Link to="/inventory" className="navbar-item">
                    <Icon path={mdiTractorVariant} size={1.5} color="black" />
                  </Link>
                </li>
                <li
                  className={activeTab === 'calendrier' ? 'is-active' : ''}
                  onClick={() => handleTabClick('calendrier')}
                >
                  <Link to="/calendar" className="navbar-item">
                    <Icon path={mdiCalendarMonth} size={1.5} color="black" />
                  </Link>
                </li>
                {userType === 'admin' ? (
                  /*Si admin, on affiche l'onglet "Tableau de bord".*/
                  <li
                    className={activeTab === 'dashboard' ? 'is-active' : ''}
                    onClick={() => handleTabClick('dashboard')}
                  >
                    <Link to="/admin" className="navbar-item">
                      <Icon
                        path={mdiFileEditOutline}
                        size={1.5}
                        color="black"
                      />
                    </Link>
                  </li>
                ) : null}
                <li
                  className={activeTab === 'burger' ? 'is-active' : ''}
                  onClick={() => handleTabClick('burger')}
                >
                  <Link to="/others" className="navbar-item">
                    <Icon path={mdiMenu} size={1.5} color="black" />
                  </Link>
                </li>
              </ul>
            </div>
          ) : null}
        </div>
      ) : (
        /* DESIGN POUR ORDINATEUR */
        <nav
          className="navbar is-light"
          role="navigation"
          aria-label="main navigation"
        >
          {isConnected ? (
            /*Si l'utilisateur est connecté, alors on affiche le logo et les onglets.*/
            <>
              <div className="navbar-brand">
                <Link to="/" className="navbar-item">
                  <StyledLogoDesktop src={LogoTxt} alt="Logo" />
                </Link>
              </div>
              <div className="navbar-start is-flex-grow-1 is-justify-content-center">
                <Link to="/" className="navbar-item">
                  Accueil
                </Link>
                <Link to="/inventory" className="navbar-item">
                  Inventaire
                </Link>
                <Link to="/calendar" className="navbar-item">
                  Calendrier
                </Link>
                {userType === 'admin' ? (
                  /*Si admin, on affiche l'onglet "Tableau de bord".*/
                  <Link to="/admin" className="navbar-item">
                    Administrateur
                  </Link>
                ) : null}
              </div>
              <div className="navbar-end">
                <div className="navbar-item">
                  <div>
                    <button onClick={handleLogout} className="button is-info">
                      <strong>Déconnexion</strong>
                    </button>
                  </div>
                </div>
              </div>
            </>
          ) : (
            /*Si l'utilisateur est déconnecté, alors on affiche uniquement le logo centré.*/
            <>
              <div className="navbar-start is-flex-grow-1 is-justify-content-center">
                <StyledCenteredLogoDesktop src={LogoTxt} alt="Logo" />
              </div>
            </>
          )}
        </nav>
      )}
    </div>
  )
}

//Définition des props du header.
Header.propTypes = {
  isConnected: PropTypes.bool,
  userType: PropTypes.string,
  handleLogout: PropTypes.func,
  isMobileTablet: PropTypes.bool,
  activeTab: PropTypes.string,
  handleTabClick: PropTypes.func,
}

export default Header
