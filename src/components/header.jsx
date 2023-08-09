import React from 'react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import LogoTxt from '../assets/logo-texte.png'
import styled from 'styled-components'
import 'bulma/css/bulma.min.css'
import { useConnexion } from '../utils/react/hooks'
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

//Entête pour naviguer entre les pages selon le type d'appareil.
function Header() {
  const { isConnected, userType, handleLogout } = useConnexion()

  //Fonction pour changer d'onglet.
  const [activeTab, setActiveTab] = useState('accueil')
  const handleTabClick = (tabId) => {
    setActiveTab(tabId)
  }

  //Affichage selon le type d'appareil.
  return (
    <div>
      {/* DESIGN POUR MOBILE */}
      <div className="is-hidden-desktop">
        <div>
          <StyledLogoTouch src={LogoTxt} alt="Logo" />
        </div>
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
              /*Si admin, on affiche l'onglet "dashboard".*/
              <li
                className={activeTab === 'dashboard' ? 'is-active' : ''}
                onClick={() => handleTabClick('dashboard')}
              >
                <Link to="/admin" className="navbar-item">
                  <Icon path={mdiFileEditOutline} size={1.5} color="black" />
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
      </div>
      {/* DESIGN POUR ORDINATEUR */}
      <div className="is-hidden-touch">
        <nav
          className="navbar is-light"
          role="navigation"
          aria-label="main navigation"
        >
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
              Catalogue
            </Link>
            <Link to="/calendar" className="navbar-item">
              Calendrier
            </Link>
            {userType === 'admin' ? (
              /*Si admin, on affiche l'onglet "dashboard".*/
              <Link to="/admin" className="navbar-item">
                Administrateur
              </Link>
            ) : null}
          </div>
          <div className="navbar-end">
            <div className="navbar-item has-dropdown is-hoverable">
              <div className="narbar-link is-align-self-center">
                <Icon path={mdiMenu} size={1} color="black" />
              </div>
              <div className="navbar-dropdown is-right">
                <Link to="/" className="navbar-item">
                  Profil
                </Link>
                <Link to="/" className="navbar-item">
                  Historique
                </Link>
                <hr className="navbar-divider" />
                <Link to="/" className="navbar-item">
                  Crédits
                </Link>
              </div>
            </div>
            <div className="navbar-item">
              {isConnected ? (
                /*Si l'utilisateur est connecté, alors déconnexion.*/
                <div>
                  <button onClick={handleLogout} className="button is-info">
                    <strong>Déconnexion</strong>
                  </button>
                </div>
              ) : null}
            </div>
          </div>
        </nav>
      </div>
    </div>
  )
}

export default Header

/*POURRAIT SERVIR PLUS TARD :

  //Fonction pour ouvrir le menu burger.
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  //Navbar avec menu burger pour téléphone.
<div className="is-hidden-desktop">
        <div>
          <img src={LogoTxt} alt="Logo" width="150px" />
        </div>
        <nav
          id="navbar"
          className="bd-navbar navbar"
          role="navigation"
          aria-label="main navigation"
        >
          <div className="navbar-brand">
            <Link to="/" className="navbar-item">
              <Icon path={mdiHome} size={2} color="black" />
            </Link>
            <Link to="/inventory" className="navbar-item">
              <Icon path={mdiTractorVariant} size={2} color="black" />
            </Link>
            <Link to="/calendar" className="navbar-item">
              <Icon path={mdiCalendarMonth} size={2} color="black" />
            </Link>
            <button
              className={`navbar-burger ${isMenuOpen ? 'is-active' : ''}`}
              aria-label="menu"
              aria-expanded={isMenuOpen}
              onClick={handleMenuToggle}
              data-target="navMenuBurger"
            >
              <span></span>
              <span></span>
              <span></span>
            </button>
          </div>

          <div
            id="navMenuBurger"
            className={`navbar-menu ${isMenuOpen ? 'is-active' : ''}`}
          >
            <div className="navbar-start">
              <Link to="/" className="navbar-item">
                Profil
              </Link>
              <Link to="/" className="navbar-item">
                Historique
              </Link>
              <Link to="/" className="navbar-item">
                Crédits
              </Link>
            </div>
            <div className="navbar-end">
              <div className="navbar-item">
                <div className="button is-primary">
                  <strong>Se déconnecter</strong>
                </div>
              </div>
            </div>
          </div>
        </nav>
      </div>*/
