import { createContext, useState, useEffect } from 'react'

//Contexte pour gérer la connexion.
export const AuthContext = createContext()

//Fonction pour gérer la connexion.
export function AuthProvider({ children }) {
  const [isConnected, setIsConnected] = useState(false)

  //Vérifie si l'utilisateur est connecté.
  useEffect(() => {
    const connected = localStorage.getItem('isConnected') === 'true'
    setIsConnected(connected)
  }, [])

  //Fonction pour se connecter.
  const setLogin = (userType) => {
    setIsConnected(true)
    localStorage.setItem('userType', userType)
    localStorage.setItem('isConnected', 'true')
  }

  //Fonction pour se déconnecter.
  const setLogout = () => {
    setIsConnected(false)
    localStorage.removeItem('isConnected')
    localStorage.removeItem('userType')
  }

  return (
    <AuthContext.Provider value={{ isConnected, setLogin, setLogout }}>
      {children}
    </AuthContext.Provider>
  )
}
