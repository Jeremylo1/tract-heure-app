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
    <div className="home">
      <div>
        <h1 className="home__title">Bienvenue sur Tract Heure !</h1>
        <StyledLink to="/test" className="button is-primary">
          Tester la connexion à la base de données
        </StyledLink>
      </div>
    </div>
  )
}

export default Home
