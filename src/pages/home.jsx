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
      <div className="hero is-primary">
        <div className="hero-body">
          <h1 className="title">Bienvenue sur Tract'Heure !</h1>
          <Link to="/test" className="button is-info">
            Tester la connexion à la base de données
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Home
