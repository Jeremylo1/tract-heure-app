import { Link } from 'react-router-dom'
import Logo from '../assets/logo-tract-heure.svg'
import styled from 'styled-components'
import 'bulma/css/bulma.min.css'

//Style du logo.
const StyledLogo = styled.img`
  width: 110px;
`

//Style de l'entête.
const NavContainer = styled.nav`
  padding: 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`

//Entête pour naviguer entre les pages.
function Header() {
  return (
    <NavContainer>
      <Link to="/">
        <StyledLogo src={Logo} alt="Logo" />
      </Link>
    </NavContainer>
  )
}

export default Header
