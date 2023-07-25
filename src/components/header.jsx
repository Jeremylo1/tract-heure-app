import { Link } from 'react-router-dom'
import Logo from '../assets/logo-tract-heure.svg'
import styled from 'styled-components'
import 'bulma/css/bulma.min.css'

//Style du logo.
const StyledLogo = styled.img`
  width: 110px;
`

//Entête pour naviguer entre les pages.
function Header() {
  return (
    <nav className="navbar" role="navigation" aria-label="main navigation">
      <div className="navbar-brand">
        <Link to="/" className="navbar-item">
          <StyledLogo src={Logo} alt="Logo" />
        </Link>
      </div>

      <div className="navbar-start">
        <Link to="/" className="navbar-item">
          Accueil
        </Link>
        <Link to="/inventory" className="navbar-item">
          Catalogue
        </Link>
        <Link to="/calendar" className="navbar-item">
          Calendrier
        </Link>
      </div>

      <div className="navbar-end">
        <div className="navbar-item">
          <div className="buttons">
            <a className="button is-primary">
              <strong>Se déconnecter</strong>
            </a>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Header
