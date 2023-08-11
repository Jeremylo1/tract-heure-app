import { createContext, useState, useEffect } from 'react'

//Contexte pour gérer la connexion.
export const AuthContext = createContext()

//Fonction pour gérer la connexion.
export function AuthProvider({ children }) {
  const [isConnected, setIsConnected] = useState(false)
  const [userType, setUserType] = useState('user') //TEMPORAIRE.

  //Récupère les données de connexion dans le local storage lors du chargement de la page.
  useEffect(() => {
    const connected = localStorage.getItem('isConnected') === 'true'
    setIsConnected(connected)
    const type = localStorage.getItem('userType') //TEMPORAIRE.
    setUserType(type) //TEMPORAIRE.
  }, [])

  //Fonction pour se connecter.
  const setLogin = (userType) => {
    setIsConnected(true)
    localStorage.setItem('isConnected', 'true')
    setUserType(userType) //TEMPORAIRE.
    localStorage.setItem('userType', userType) //TEMPORAIRE.
  }

  //Fonction pour se déconnecter.
  const setLogout = () => {
    setIsConnected(false)
    localStorage.removeItem('isConnected')
    localStorage.removeItem('userType') //TEMPORAIRE.
  }

  return (
    <AuthContext.Provider
      value={{ userType, isConnected, setLogin, setLogout }}
    >
      {children}
    </AuthContext.Provider>
  )
}

//Contexte pour gérer la taille de l'écran.
export const ScreenContext = createContext()

//Fonction pour gérer la taille de l'écran.
export function ScreenProvider({ children }) {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 767)
  const [isMobileTablet, setIsTabletMobile] = useState(
    window.innerWidth <= 1023,
  )

  //Fonction pour savoir si c'est un appareil mobile.
  const handleResize = () => {
    setIsMobile(window.innerWidth <= 768)
    setIsTabletMobile(window.innerWidth <= 1023)
  }

  //Ajoute un écouteur d'évènement pour savoir si la taille de l'écran change.
  useEffect(() => {
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <ScreenContext.Provider value={{ isMobile, isMobileTablet }}>
      {children}
    </ScreenContext.Provider>
  )
}
