import { useState, useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from './context'
/*Base de données*/
import {
  LIEN_API,
  TABLE_CATEGORY,
  TABLE_STATUS,
  COLUMN_ID,
  COLUMN_NAME,
} from '../database/query'

/*Permet de récupérer (SELECT) des données depuis Hasura.*/
const defaultVariables = {}
export function useFetchHasura(
  url,
  query,
  stopFetch = false,
  variables = defaultVariables,
) {
  const [data, setData] = useState(null)
  const [isLoading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [reloadTimestamp, setReloadTimestamp] = useState(0) //Timestamp de rechargement.
  const reload = () => setReloadTimestamp(Date.now()) //Fonction pour déclencher un rechargement.

  useEffect(() => {
    if (!url || !query || stopFetch) return //Aucune action si l'url ou la requête est indéfinie ou si le rechargement est désactivé.
    setLoading(true) //Données en cours de chargement.
    console.log('query', query) //!DEBUG

    async function fetchData() {
      try {
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-hasura-admin-secret': process.env.REACT_APP_HASURA_API_KEY,
            'x-hasura-role': 'user', //TEMPORAIRE.
          },
          body: JSON.stringify({
            query,
            variables,
          }),
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
        setError(true)
      } finally {
        setLoading(false) //Données plus en cours de chargement.
      }
    }
    fetchData()
  }, [url, query, stopFetch, variables]) //Recharge les données si l'url, la requête ou le timestamp de rechargement change.

  return { isLoading, data, error, reload }
}

/*Permet d'envoyer une requête de mutation (INSERT, UPDATE, DELETE) à Hasura.*/
export function useMutationHasura(url) {
  const [error, setError] = useState(false)

  if (!url) return //Aucune action si l'url est indéfinie.

  async function doMutation(mutation, variables) {
    try {
      console.log('mutation', mutation, variables) //!DEBUG
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-hasura-admin-secret': process.env.REACT_APP_HASURA_API_KEY,
          'x-hasura-role': 'user', //TEMPORAIRE.
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
      setError(true)
    }
  }

  return { doMutation, error }
}

/*Permet de récupérer les catégories triées par ordre alphabétique depuis Hasura.*/
export function useCategory() {
  //Pour savoir si c'est la première fois qu'on charge les données.
  const [firstLoading, setFirstLoading] = useState(true)
  //Pour stocker les catégories triées.
  const [sortedCategories, setSortedCategories] = useState([])

  //Permet de récupérer la liste des catégories depuis Hasura.
  const {
    data: category_data,
    isLoading: category_loading,
    error: category_error,
  } = useFetchHasura(
    LIEN_API,
    `{${TABLE_CATEGORY}{${COLUMN_ID} ${COLUMN_NAME}}}`,
    firstLoading,
  )

  //Permet de définir si c'est la première fois qu'on charge la page.
  useEffect(() => {
    setFirstLoading(false)
  }, [])

  //Permet de trier les catégories par ordre alphabétique.
  useEffect(() => {
    if (category_data && category_data[TABLE_CATEGORY]) {
      const sorted = category_data[TABLE_CATEGORY].slice().sort((a, b) =>
        a[COLUMN_NAME].localeCompare(b[COLUMN_NAME]),
      )
      //On stocke les catégories triées.
      setSortedCategories(sorted)
    }
  }, [category_data])

  return { sortedCategories, category_loading, category_error }
}

/*Permet de récupérer les statuts depuis Hasura.*/
export function useStatus() {
  //Pour savoir si c'est la première fois qu'on charge les données.
  const [firstLoading, setFirstLoading] = useState(true)
  //Pour stocker les statuts.
  const [status, setStatus] = useState([])

  //Permet de récupérer la liste des statuts depuis Hasura.
  const {
    data: status_data,
    isLoading: status_loading,
    error: status_error,
  } = useFetchHasura(
    LIEN_API,
    `{${TABLE_STATUS}{${COLUMN_ID} ${COLUMN_NAME}}}`,
    firstLoading,
  )

  //Permet de définir si c'est la première fois qu'on charge la page.
  useEffect(() => {
    setFirstLoading(false)
  }, [])

  //Permet de stocker les statuts dans un tableau.
  useEffect(() => {
    if (status_data && status_data[TABLE_STATUS]) {
      setStatus(status_data[TABLE_STATUS])
    }
  }, [status_data])

  return { status, status_loading, status_error }
}

/*Permet de se déconnecter, de récupérer le type d'utilisateur et de savoir si l'utilisateur est connecté.*/
export function useConnexion() {
  const { isConnected, setLogout } = useContext(AuthContext)
  const { userType } = useContext(AuthContext) //TEMPORAIRE.
  const navigate = useNavigate()

  //Déconnexion et redirection.
  function handleLogout() {
    setLogout()
    navigate('/login')
  }

  return { isConnected, userType, handleLogout }
}

/*Permet de sélectionner un onglet.*/
export function useTab() {
  const [activeTab, setActiveTab] = useState('accueil')

  //Permet de sélectionner l'onglet actif.
  const handleTabClick = (tabId) => {
    setActiveTab(tabId)
  }

  //Permet de sélectionner l'onglet actif selon le chemin.
  useEffect(() => {
    const currentPath = window.location.pathname

    switch (currentPath) {
      case '/':
        setActiveTab('accueil')
        break
      case '/inventory':
        setActiveTab('catalogue')
        break
      case '/calendar':
        setActiveTab('calendrier')
        break
      case '/admin':
        setActiveTab('dashboard')
        break
      default:
        setActiveTab('accueil')
        break
    }
  }, [])

  return { activeTab, handleTabClick }
}
