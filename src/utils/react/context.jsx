import { createContext, useState, useEffect } from 'react'

export const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    const connected = localStorage.getItem('isConnected') === 'true'
    setIsConnected(connected)
  }, [])

  const setLogin = (userType) => {
    setIsConnected(true)
    localStorage.setItem('userType', userType)
    localStorage.setItem('isConnected', 'true')
  }

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
