import React from 'react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import Logo from '../assets/logo-tract-heure.svg'
import styled from 'styled-components'
import 'bulma/css/bulma.min.css'

//Style du logo.
const StyledLogo = styled.img`
  width: 100px;
`

//Entête pour naviguer entre les pages selon le type d'appareil.
function Header() {
  const [activeTab, setActiveTab] = useState('accueil')

  //Fonction pour changer d'onglet.
  const handleTabClick = (tabId) => {
    setActiveTab(tabId)
  }

  //Affichage selon le type d'appareil.
  return (
    <div>
      <div className="is-flex-direction-column is-hidden-desktop">
        <div className="is-flex is-justify-content-center">
          <Link to="/">
            <StyledLogo src={Logo} alt="Logo" />
          </Link>
        </div>
        <div>
          <div className="tabs is-centered">
            <ul>
              <li
                className={activeTab === 'accueil' ? 'is-active' : ''}
                onClick={() => handleTabClick('accueil')}
              >
                <Link to="/">Accueil</Link>
              </li>
              <li
                className={activeTab === 'catalogue' ? 'is-active' : ''}
                onClick={() => handleTabClick('catalogue')}
              >
                <Link to="/inventory">Catalogue</Link>
              </li>
              <li
                className={activeTab === 'calendrier' ? 'is-active' : ''}
                onClick={() => handleTabClick('calendrier')}
              >
                <Link to="/calendar">Calendrier</Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="is-flex-direction-column is-hidden-touch">
        <div className="is-flex is-justify-content-center">
          <Link to="/">
            <StyledLogo src={Logo} alt="Logo" />
          </Link>
        </div>
        <div>
          <div className="tabs is-centered">
            <ul className>
              <li
                className={activeTab === 'accueil' ? 'is-active' : ''}
                onClick={() => handleTabClick('accueil')}
              >
                <Link to="/">Accueil</Link>
              </li>
              <li
                className={activeTab === 'catalogue' ? 'is-active' : ''}
                onClick={() => handleTabClick('catalogue')}
              >
                <Link to="/inventory">Catalogue</Link>
              </li>
              <li
                className={activeTab === 'calendrier' ? 'is-active' : ''}
                onClick={() => handleTabClick('calendrier')}
              >
                <Link to="/calendar">Calendrier</Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Header
