import { createContext, useState, useEffect } from 'react'

export const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    const connected = localStorage.getItem('isConnected') === 'true'
    setIsConnected(connected)
  }, [])

  const login = () => {
    setIsConnected(true)
    localStorage.setItem('isConnected', 'true')
  }

  const logout = () => {
    setIsConnected(false)
    localStorage.removeItem('isConnected')
  }

  return (
    <AuthContext.Provider value={{ isConnected, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
