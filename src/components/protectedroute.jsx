import { useContext } from 'react'
import { Outlet, Navigate } from 'react-router-dom'
import { AuthContext } from '../utils/react/context'

//Fonction pour protéger les routes.
function ProtectedRoute() {
  const { isConnected } = useContext(AuthContext)
  // retourne Outlet si isConnected est true, sinon retourne Navigate
  // <Outlet /> permet de faire le rendu des routes enfants
  return isConnected ? <Outlet /> : <Navigate to="/login" replace />
}

export default ProtectedRoute
