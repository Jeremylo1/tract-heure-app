import { useContext } from 'react'
import { Outlet, Navigate } from 'react-router-dom'
import { AuthContext } from './context'

//Fonction pour protéger les routes.
function ProtectedRoute() {
  const { isConnected } = useContext(AuthContext)
  //Renvoie vers la page de connexion si l'utilisateur n'est pas connecté sinon renvoie vers la page demandée.
  return isConnected ? <Outlet /> : <Navigate to="/login" replace />
}

export default ProtectedRoute
