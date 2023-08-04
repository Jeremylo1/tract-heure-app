import React from 'react'
import PropTypes from 'prop-types'
import { useState, useEffect } from 'react'
import { useFetchHasura } from '../utils/react/hooks'
import { useMutationHasura } from '../utils/react/hooks'

function Test() {
  //Le titre du todo à ajouter.
  const [title, setTitle] = useState('')
  //Pour stocker l'ID de l'utilisateur sélectionné.
  const [selectedUserId, setSelectedUserId] = useState('')
  //État pour suivre si les données doivent être affichées en format JSON ou non.
  const [showJSON, setShowJSON] = useState(false)

  //Permet de récupérer les données todos depuis Hasura.
  const {
    data: todo_data,
    isLoading: todo_loading,
    error: todo_error,
    reload,
  } = useFetchHasura(
    'https://champion-tiger-15.hasura.app/v1/graphql',
    `{todos{id title is_public is_completed user_id user { name }}}`,
  )

  //Permet de récupérer les données utilisateurs depuis Hasura.
  const {
    data: user_data, //On crée une variable user_data pour éviter les conflits.
    isLoading: user_loading,
    error: user_error,
  } = useFetchHasura(
    'https://champion-tiger-15.hasura.app/v1/graphql',
    `{users{id name}}`,
  )

  //Permet de sélectionner le premier utilisateur par défaut et de réinitialiser l'ID sélectionné si la liste des utilisateurs change.
  useEffect(() => {
    if (user_data && user_data.users.length > 0) {
      setSelectedUserId(user_data.users[0].id)
    }
  }, [user_data])

  //Permet d'envoyer une requête de mutation (INSERT, UPDATE, DELETE) à Hasura.
  const { doMutation, error_mutation } = useMutationHasura(
    'https://champion-tiger-15.hasura.app/v1/graphql',
  )

  /*Permet d'ajouter un todo à la base de données. 
  Le titre du todo est récupéré depuis le state `title`.*/
  const addTodo = async () => {
    const mutation = `
      mutation InsertTodo($title: String!, $userId: String!) {
        insert_todos(objects: [{title: $title, user_id: $userId}]) {
          affected_rows
        }
      }
    `

    try {
      const responseDataMutation = await doMutation(mutation, {
        title,
        userId: selectedUserId,
      })
      if (responseDataMutation) {
        setTitle('')
        setSelectedUserId('') //Réinitialiser l'ID sélectionné.
        reload() //Pour déclencher un rechargement des todos.
      }
    } catch (err) {
      console.error(err)
      //Gérer l'erreur, si nécessaire !!!!!!!
    }
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
        {user_loading ? (
          <div>Chargement des utilisateurs ...</div>
        ) : user_error ? (
          <div>Erreur lors du chargement des utilisateurs !</div>
        ) : (
          <select
            value={selectedUserId}
            onChange={(e) => setSelectedUserId(e.target.value)}
          >
            {user_data.users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name}
              </option>
            ))}
          </select>
        )}
        <button onClick={addTodo}>Ajouter</button>
        {todo_error ? (
          <div>Erreur lors du chargement des todos !</div>
        ) : todo_loading ? (
          <div>Chargement des todos ...</div>
        ) : showJSON ? (
          // Si showJSON est vrai, affiche les données au format JSON
          <pre>{JSON.stringify(todo_data, null, 2)}</pre>
        ) : (
          // Si showJSON est faux, affiche les données formatées
          <div>
            <h2>Todos:</h2>
            <ul>
              {todo_data.todos.map((todo) => (
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
  todo_data: PropTypes.object,
  todo_loading: PropTypes.bool,
  todo_error: PropTypes.bool,
  user_data: PropTypes.object,
  user_loading: PropTypes.bool,
  user_error: PropTypes.bool,
  doMutation: PropTypes.func,
  error_mutation: PropTypes.bool,
  addTodo: PropTypes.func,
}

export default Test
