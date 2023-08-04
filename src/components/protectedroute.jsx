import { useContext } from 'react'
import { Outlet, Navigate } from 'react-router-dom'
import { AuthContext } from '../utils/react/context'

//Fonction pour protéger les routes.
function ProtectedRoute() {
  const { isConnected } = useContext(AuthContext)

  if (window.location.pathname === '/login' && isConnected) {
    return <Navigate to="/" replace />
  }

  if (window.location.pathname !== '/login' && !isConnected) {
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}

export default ProtectedRoute
