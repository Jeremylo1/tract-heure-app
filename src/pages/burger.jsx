import React from 'react'
import { useContext } from 'react'
import { AuthContext } from '../utils/react/context'
import { useNavigate } from 'react-router-dom'

function Burger() {
  const { isConnected, setLogout } = useContext(AuthContext)

  const navigate = useNavigate()

  //Fonction pour se déconnecter (!!!!!!!!!).
  const handleLogout = () => {
    setLogout()
    navigate('/login')
  }

  return isConnected ? (
    /*Si l'utilisateur est connecté, alors déconnexion.*/
    <div>
      <button onClick={handleLogout} className="button is-info">
        <strong>Déconnexion</strong>
      </button>
    </div>
  ) : null
}

export default Burger
