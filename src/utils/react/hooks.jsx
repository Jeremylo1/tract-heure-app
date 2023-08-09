import { useState, useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from './context'

//Permet de récupérer (SELECT) des données depuis Hasura.
export function useFetchHasura(url, query, stopFetch = false) {
  const [data, setData] = useState(null)
  const [isLoading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [reloadTimestamp, setReloadTimestamp] = useState(0) //Timestamp de rechargement.
  const reload = () => setReloadTimestamp(Date.now()) //Fonction pour déclencher un rechargement.

  useEffect(() => {
    console.log('test1', stopFetch) //!DEBUG
    if (!url || !query || stopFetch) return //Aucune action si l'url ou la requête est indéfinie ou si le rechargement est désactivé.
    setLoading(true) //Données en cours de chargement.
    console.log('test0', query) //!DEBUG

    async function fetchData() {
      try {
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-hasura-admin-secret': process.env.REACT_APP_HASURA_API_KEY,
          },
          body: JSON.stringify({ query }),
        })

        //Erreur si on ne reçoit pas de réponse.
        if (!response.ok) {
          setError(true)
          throw new Error('Erreur de connexion à la base de données')
        }

        const responseData = await response.json()

        //Erreur si on ne reçoit pas de données.
        if (!responseData.data) {
          setError(true)
          throw new Error('Erreur de connexion à la base de données')
        }

        setData(responseData.data)
      } catch (err) {
        console.error(err)
        setError(true)
      } finally {
        setLoading(false) //Données plus en cours de chargement.
      }
    }
    fetchData()
  }, [url, query, stopFetch]) //Recharge les données si l'url, la requête ou le timestamp de rechargement change.

  return { isLoading, data, error, reload }
}

//Permet d'envoyer une requête de mutation (INSERT, UPDATE, DELETE) à Hasura.
export function useMutationHasura(url) {
  const [error, setError] = useState(false)

  if (!url) return //Aucune action si l'url est indéfinie.

  async function doMutation(mutation, variables) {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-hasura-admin-secret': process.env.REACT_APP_HASURA_API_KEY,
        },
        body: JSON.stringify({ query: mutation, variables }),
      })

      //Erreur si on ne reçoit pas de réponse.
      if (!response.ok) {
        setError(true)
        throw new Error('Erreur de connexion à la base de données')
      }

      const responseData = await response.json()

      //Erreur si on ne reçoit pas de données.
      if (!responseData.data) {
        setError(true)
        throw new Error('Erreur de connexion à la base de données')
      }

      return responseData.data
    } catch (err) {
      console.error(err)
      setError(true)
    }
  }

  return { doMutation, error }
}

//Permet de se déconnecter, de récupérer le type d'utilisateur et de savoir si l'utilisateur est connecté.
export function useConnexion() {
  const { isConnected, setLogout } = useContext(AuthContext)
  const { userType } = useContext(AuthContext)
  const navigate = useNavigate()

  //Fonction pour se déconnecter.
  function handleLogout() {
    setLogout()
    navigate('/login')
  }

  return { isConnected, userType, handleLogout }
}
