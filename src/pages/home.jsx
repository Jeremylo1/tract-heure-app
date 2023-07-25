import { Link } from 'react-router-dom'
import styled from 'styled-components'
import 'bulma/css/bulma.min.css'

const StyledLink = styled(Link)`
  &.button {
    background-color: #000000;
    border-color: #00d1b2;
  }
`

function Home() {
  return (
    <div className="home">
      <div className="home__container">
        <h1 className="home__title">
          Bienvenue sur le site de la Mairie de Saint-Quentin
        </h1>
        <p className="home__text">
          Vous trouverez ici toutes les informations concernant la vie de la
          commune.
        </p>
        <StyledLink to="/news" className="button is-primary">
          Actualités
        </StyledLink>
      </div>
    </div>
  )
}

export default Home
