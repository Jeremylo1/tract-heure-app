import React from 'react'
import { useState, useEffect } from 'react'

function Test() {
  const [title, setTitle] = useState('') // Le titre du todo à ajouter
  const [selectedUserId, setSelectedUserId] = useState('') // Pour stocker l'ID de l'utilisateur sélectionné

  // État pour suivre si les données doivent être affichées en format JSON ou non
  const [showJSON, setShowJSON] = useState(false)

  // Permet de récupérer les données todos depuis Hasura.
  const { data, isLoading, error, reload } = useFetchHasura(
    'https://champion-tiger-15.hasura.app/v1/graphql',
    `{todos{id title is_public is_completed user_id user { name }}}`,
  )

  // Permet de récupérer les données utilisateurs depuis Hasura.
  const {
    data: usersData,
    isLoading: usersLoading,
    error: usersError,
  } = useFetchHasura(
    'https://champion-tiger-15.hasura.app/v1/graphql',
    `{users{id name}}`,
  )

  // Permet de sélectionner le premier utilisateur par défaut et de réinitialiser l'ID sélectionné si la liste des utilisateurs change.
  useEffect(() => {
    if (usersData && usersData.users.length > 0) {
      setSelectedUserId(usersData.users[0].id)
    }
  }, [usersData])

  // Permet d'envoyer une requête à Hasura.
  const { doMutation } = useMutationHasura(
    'https://champion-tiger-15.hasura.app/v1/graphql',
  )

  // Permet d'ajouter un todo à la base de données. Le titre du todo est récupéré depuis le state `title`.
  const handleAddTodo = async () => {
    const mutation = `
      mutation InsertTodo($title: String!, $userId: String!) {
        insert_todos(objects: [{title: $title, user_id: $userId}]) {
          affected_rows
        }
      }
    `

    await doMutation(mutation, { title, userId: selectedUserId })
    setTitle('')
    setSelectedUserId('') // Réinitialiser l'ID sélectionné
    reload() // Appeler reload pour déclencher un rechargement des todos
  }

  // Affichage de la page de test avec le formulaire et les données récupérées depuis Hasura.
  return (
    <div>
      <h1>Page de test</h1>
      <button onClick={() => setShowJSON(!showJSON)}>
        {showJSON ? 'Afficher au format normal' : 'Afficher au format JSON'}
      </button>
      <div>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Ajouter un todo"
        />
        {usersLoading ? (
          <div>Chargement des utilisateurs...</div>
        ) : usersError ? (
          <div>Erreur lors du chargement des utilisateurs</div>
        ) : (
          <select
            value={selectedUserId}
            onChange={(e) => setSelectedUserId(e.target.value)}
          >
            {usersData.users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name}
              </option>
            ))}
          </select>
        )}
        <button onClick={handleAddTodo}>Ajouter</button>
        {error ? (
          <div>Erreur lors du chargement des données</div>
        ) : isLoading ? (
          <div>Chargement...</div>
        ) : showJSON ? (
          // Si showJSON est vrai, affiche les données au format JSON
          <pre>{JSON.stringify(data, null, 2)}</pre>
        ) : (
          // Si showJSON est faux, affiche les données formatées
          <div>
            <h2>Todos:</h2>
            <ul>
              {data.todos.map((todo) => (
                <li key={todo.id}>
                  {todo.title} (Par : {todo.user.name}) -{' '}
                  {todo.is_completed ? 'Complété' : 'Non Complété'}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}

// Hook pour envoyer une requête de mutation à Hasura
function useMutationHasura(url) {
  const doMutation = async (mutation, variables) => {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-hasura-admin-secret': process.env.REACT_APP_HASURA_API_KEY,
        },
        body: JSON.stringify({ query: mutation, variables }),
      })

      if (!response.ok) {
        throw new Error('Network response was not ok')
      }

      const responseData = await response.json()
      return responseData.data
    } catch (err) {
      console.error(err)
      throw err
    }
  }

  return { doMutation }
}

// Hook pour récupérer des données depuis Hasura
function useFetchHasura(url, query) {
  const [data, setData] = useState(null)
  const [isLoading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [reloadTimestamp, setReloadTimestamp] = useState(0) // Nouvel état pour le timestamp de rechargement
  const reload = () => setReloadTimestamp(Date.now()) // Fonction pour déclencher un rechargement

  useEffect(() => {
    if (!url || !query) return // Ne fait rien si l'url ou la requête sont indéfinis
    setLoading(true)

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

        if (!response.ok) {
          throw new Error('Network response was not ok')
        }

        const responseData = await response.json()
        setData(responseData.data)
      } catch (err) {
        console.error(err)
        setError(true)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [url, query, reloadTimestamp]) // Ajoutez reloadTodos ici

  return { isLoading, data, error, reload }
}

export default Test
