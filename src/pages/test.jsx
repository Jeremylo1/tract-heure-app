import React from 'react'
import PropTypes from 'prop-types'
import { useState, useEffect } from 'react'
import { useFetchHasura } from '../utils/react/hooks'
/*import { useMutationHasura } from '../utils/react/hooks'*/

function Test() {
  //Le titre du todo à ajouter.
  const [title, setTitle] = useState('')
  //Pour stocker l'ID de l'utilisateur sélectionné.
  const [selectedUserId, setSelectedUserId] = useState('')
  //État pour suivre si les données doivent être affichées en format JSON ou non.
  const [showJSON, setShowJSON] = useState(false)

  //Permet de récupérer les données todos depuis Hasura.
  const { data, isLoading, error, reload } = useFetchHasura(
    'https://champion-tiger-15.hasura.app/v1/graphql',
    `{todos{id title is_public is_completed user_id user { name }}}`,
  )

  //Permet de récupérer les données utilisateurs depuis Hasura.
  const {
    data: usersData, //On crée une variable usersData pour éviter les conflits.
    isLoading: usersLoading,
    error: usersError,
  } = useFetchHasura(
    'https://champion-tiger-15.hasura.app/v1/graphql',
    `{users{id name}}`,
  )

  //Permet de sélectionner le premier utilisateur par défaut et de réinitialiser l'ID sélectionné si la liste des utilisateurs change.
  useEffect(() => {
    if (usersData && usersData.users.length > 0) {
      setSelectedUserId(usersData.users[0].id)
    }
  }, [usersData])

  //Permet d'envoyer une requête de mutation (INSERT, UPDATE, DELETE) à Hasura.
  const { doMutation } = useMutationHasura(
    'https://champion-tiger-15.hasura.app/v1/graphql',
  )

  // Permet d'ajouter un todo à la base de données. Le titre du todo est récupéré depuis le state `title`.
  const addTodo = async () => {
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
        <button onClick={addTodo}>Ajouter</button>
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

// Définition des types des props.
Test.propTypes = {
  title: PropTypes.string,
  selectedUserId: PropTypes.string,
  showJSON: PropTypes.bool,
  data: PropTypes.object,
  isLoading: PropTypes.bool,
  error: PropTypes.bool,
  usersData: PropTypes.object,
  usersLoading: PropTypes.bool,
  usersError: PropTypes.bool,
  addTodo: PropTypes.func,
  reload: PropTypes.func,
  doMutation: PropTypes.func,
  fetchData: PropTypes.func,
}

//Hook pour envoyer une requête de mutation à Hasura.
function useMutationHasura(url) {
  const [error, setError] = useState(false)

  if (!url) return //Aucune action si l'url est indéfinie.

  const doMutation = async (mutation, variables) => {
    //ici.
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-hasura-admin-secret': process.env.REACT_APP_HASURA_API_KEY,
        },
        body: JSON.stringify({ query: mutation, variables }), //ici.
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

  return { doMutation } //ici : return error.
}

export default Test
