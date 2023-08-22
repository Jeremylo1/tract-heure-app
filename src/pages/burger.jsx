import React from 'react'
import { useConnexion } from '../utils/react/hooks'

function Burger() {
  //Pour savoir si l'utilisateur est connecté.
  const { isConnected, handleLogout } = useConnexion()

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
