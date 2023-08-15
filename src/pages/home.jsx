import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { ScreenContext } from '../utils/react/context'
/*CSS*/
import 'bulma/css/bulma.min.css'
import '../styles/home.css'

function Home() {
  //Pour savoir si c'est un appareil mobile.
  const { isMobileTablet } = useContext(ScreenContext)
  return (
    <div>
      {isMobileTablet ? (
        /* DESIGN POUR MOBILE ET TABLETTE */
        <div>
          <div className="columns-mobile">
            <div className="columns-mobile-size">
              <h1>Mes réservations</h1>
              <div className="tile is-ancestor">
                <div className="tile is-vertical">
                  <div className="tile">
                    <div className="tile is-parent">
                      <article className="tile is-child box">
                        <p className="title is-4">En cours</p>
                        <p className="subtitle">Sous-titre pour en cours</p>
                      </article>
                    </div>
                    <div className="tile is-vertical">
                      <div className="tile">
                        <div className="tile is-parent">
                          <article className="tile is-child box">
                            <p className="title is-4">Début de location</p>
                            <p className="subtitle">
                              Sous-titre pour début de location
                            </p>
                          </article>
                        </div>
                        <div className="tile is-parent">
                          <article className="tile is-child box">
                            <p className="title is-4">Fin de location</p>
                            <p className="subtitle">
                              Sous-titre pour fin de location
                            </p>
                          </article>
                        </div>
                      </div>
                      <div className="tile is-parent">
                        <article className="tile is-child box">
                          <p className="title is-4">À venir</p>
                          <p className="subtitle">Sous-titre pour à venir</p>
                        </article>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* DESIGN POUR ORDINATEUR */
        <div>
          <div className="columns-tablet-desktop">
            <div className="columns-tablet-desktop-size">
              <h1>Mes réservations</h1>
              <div className="tile is-ancestor">
                <div className="tile is-vertical">
                  <div className="tile">
                    <div className="tile is-parent">
                      <article className="tile is-child box">
                        <p className="title is-4">En cours</p>
                        <p className="subtitle">Sous-titre pour en cours</p>
                      </article>
                    </div>
                    <div className="tile is-8 is-vertical">
                      <div className="tile">
                        <div className="tile is-parent">
                          <article className="tile is-child box">
                            <p className="title is-4">Début de location</p>
                            <p className="subtitle">
                              Sous-titre pour début de location
                            </p>
                          </article>
                        </div>
                        <div className="tile is-parent">
                          <article className="tile is-child box">
                            <p className="title is-4">Fin de location</p>
                            <p className="subtitle">
                              Sous-titre pour fin de location
                            </p>
                          </article>
                        </div>
                      </div>
                      <div className="tile is-parent">
                        <article className="tile is-child box">
                          <p className="title is-4">À venir</p>
                          <p className="subtitle">Sous-titre pour à venir</p>
                        </article>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Home
