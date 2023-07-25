import { Link } from 'react-router-dom'
/*CSS*/
import styled from 'styled-components'
import 'bulma/css/bulma.min.css'

const StyledLink = styled(Link)`
  &.button {
    background-color: #000000;
    border-color: #00d1b2;
  }
  &.button:hover {
    background-color: red;
  }
`

function Home() {
  return (
    <div>
      <h1>Page d'accueil</h1>
      <StyledLink to="/inventory" className="button is-primary">
        Voir inventaire
      </StyledLink>
    </div>
  )
}

export default Home
