import { useContext } from 'react'
import { Outlet, Navigate } from 'react-router-dom'
import { AuthContext } from '../utils/react/context'

//Fonction pour protéger les routes.
function ProtectedRoute(children) {
  const { isConnected } = useContext(AuthContext)
  console.log('Is connected?', isConnected)
  console.log('Children:', children) // Ici
  return isConnected ? <Outlet /> : <Navigate to="/login" replace />
}

export default ProtectedRoute
