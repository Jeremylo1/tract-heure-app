import { useContext } from 'react'
import { Outlet, Navigate } from 'react-router-dom'
import { AuthContext } from './context'

//Fonction pour protéger les routes.
function ProtectedRoute() {
  const { isConnected } = useContext(AuthContext)

  //Page de login demandée : redirige vers la page d'accueil si l'utilisateur est connecté.
  if (window.location.pathname === '/login' && isConnected) {
    return <Navigate to="/" replace />
  }
  //Page de login demandée : redirige vers la page de login si l'utilisateur n'est pas connecté.
  if (window.location.pathname !== '/login' && !isConnected) {
    return <Navigate to="/login" replace />
  }
  //Si l'utilisateur est connecté, affiche le contenu de la page demandée.
  return <Outlet />
}

export default ProtectedRoute
