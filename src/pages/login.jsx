import React from 'react'
import { useState, useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../utils/react/context'
import 'bulma/css/bulma.min.css'

function Connection() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [connectionTryCount, setConnectionTryCount] = useState(0)
  const [lastTryTimestamp, setLastTryTimestamp] = useState(0)
  const [error, setError] = useState('')
  const { isConnected, login } = useContext(AuthContext)
  const navigate = useNavigate()

  function tryConnection() {
    const diff = Date.now() - lastTryTimestamp

    if (isConnected) {
      setError('Vous êtes déjà connecté')
    } else if (connectionTryCount >= 3 && diff <= 3000) {
      setError('Trop de tentatives de connexion')
    } else {
      if (diff > 3000) {
        setConnectionTryCount(0)
      }

      if (
        (username === 'admin' && password === 'admin') ||
        (username === 'user' && password === 'user')
      ) {
        login()
        setError('')
        navigate('/') // Rediriger vers la page d'accueil
      } else {
        setError("Nom d'utilisateur ou mot de passe incorrect")
      }

      setConnectionTryCount(connectionTryCount + 1)
      setLastTryTimestamp(Date.now())
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault() // Empêche la soumission par défaut du formulaire
    tryConnection()
  }

  // Page de connexion avec un champ nom d'utilisateur et un champ mot de passe
  return (
    <div className="container">
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
            <button className="button is-primary" type="submit">
              Se connecter
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}

export default Connection
