import { useContext } from 'react'
import { Outlet, Navigate, useLocation } from 'react-router-dom'
import { AuthContext } from './context'

function ProtectedRoute() {
  const { isConnected, isInitialized, userType } = useContext(AuthContext)
  const location = useLocation()

  //Si AuthProvider n'est pas encore initialisé, affichez simplement un spinner de chargement.
  if (!isInitialized) {
    return <div className="loader is-loading"></div>
  }

  //Si vous êtes sur la page de login et que vous êtes déjà connecté.
  if (location.pathname === '/login' && isConnected) {
    return <Navigate to="/" replace />
  }

  //Si vous êtes sur une autre page et que vous n'êtes pas connecté.
  if (location.pathname !== '/login' && !isConnected) {
    //Rediriger l'utilisateur vers la page de connexion en gardant l'URL actuelle dans l'état.
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  //Si vous êtes sur la page d'administration et que vous n'êtes pas administrateur
  if (location.pathname === '/admin' && userType !== 'admin') {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}

export default ProtectedRoute
