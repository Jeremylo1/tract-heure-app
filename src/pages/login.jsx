import React from 'react'
import { useState, useContext } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { AuthContext } from '../utils/react/context'
/*Style*/
import 'bulma/css/bulma.min.css'

//Json pour les utilisateurs.
const users = [
  {
    userId: 1,
    username: 'admin',
    password: 'admin',
    userType: 'admin',
  },
  {
    userId: 2,
    username: 'user',
    password: 'user',
    userType: 'user',
  },
  {
    userId: 3,
    username: 'user2',
    password: 'user2',
    userType: 'user',
  },
]

//Permet de se connecter à l'application.
function Connection() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [connectionTryCount, setConnectionTryCount] = useState(0)
  const [lastTryTimestamp, setLastTryTimestamp] = useState(0)
  const [error, setError] = useState('')
  const { isConnected, setLogin } = useContext(AuthContext)
  const navigate = useNavigate()
  const location = useLocation()

  //Fonction pour se connecter.
  function tryConnection() {
    const diff = Date.now() - lastTryTimestamp

    //Si l'utilisateur est déjà connecté, si le nombre de tentatives de connexion est supérieur à 3 et si le délai entre les tentatives est inférieur à 3 secondes, alors on affiche un message d'erreur.
    if (isConnected) {
      setError('Vous êtes déjà connecté')
    } else if (connectionTryCount >= 3 && diff <= 3000) {
      setError('Trop de tentatives de connexion')
    } else {
      if (diff > 3000) {
        setConnectionTryCount(0)
      }

      // Trouvez l'utilisateur qui correspond au nom d'utilisateur et au mot de passe saisis
      const user = users.find(
        (user) => user.username === username && user.password === password,
      )

      //Si le nom d'utilisateur et le mot de passe sont corrects, alors on se connecte et on est redirigé vers la page d'accueil.
      if (user) {
        setLogin(user.userType, user.userId)
        setError('')

        const from = location.state?.from || '/'
        navigate(from) // Redirection vers la page initialement demandée ou la page d'accueil
      } else {
        setError("Nom d'utilisateur ou mot de passe incorrect")
      }

      setConnectionTryCount(connectionTryCount + 1)
      setLastTryTimestamp(Date.now())
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault() //Empêche la soumission par défaut du formulaire.
    tryConnection()
  }

  //Page de connexion avec un champ nom d'utilisateur et un champ mot de passe.
  return (
    <div className="container">
      <div className="box">
        <h1 className="title">Page de connexion</h1>
        <form onSubmit={handleSubmit}>
          <div className="field">
            <label className="label">Nom d'utilisateur :</label>
            <div className="control">
              <input
                className={`input ${error && 'is-danger'}`}
                type="text"
                name="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
          </div>
          <div className="field">
            <label className="label">Mot de passe :</label>
            <div className="control">
              <input
                className={`input ${error && 'is-danger'}`}
                type="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>
          {error && <p className="help is-danger">{error}</p>}
          <div className="field">
            <div className="control">
              <button className="button is-info" type="submit">
                Connexion
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Connection
