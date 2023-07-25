import { Link } from 'react-router-dom'

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
        <Link to="/news" className="home__button">
          Actualités
        </Link>
      </div>
    </div>
  )
}

export default Home
