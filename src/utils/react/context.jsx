import { createContext, useState, useEffect } from 'react'

export const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    const connected = localStorage.getItem('isConnected') === 'true'
    setIsConnected(connected)
  }, [])

  // const toggleLog = () => {
  //   setIsConnected(!isConnected)
  // }

  //Fonction pour se connecter.
  const setLogin = () => {
    setIsConnected(true)
    localStorage.setItem('isConnected', 'true')
  }

  //Fonction pour se déconnecter.
  const setLogout = () => {
    setIsConnected(false)
    localStorage.removeItem('isConnected')
  }

  return (
    <AuthContext.Provider value={{ isConnected, setLogin, setLogout }}>
      {children}
    </AuthContext.Provider>
  )
}
