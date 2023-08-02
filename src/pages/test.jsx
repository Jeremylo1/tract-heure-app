import React from 'react'
import { useState, useEffect } from 'react'

function Test() {
  const [title, setTitle] = useState('') // Le titre du todo à ajouter

  // Permet de récupérer les données depuis Hasura.
  const { data, isLoading, error } = useFetchHasura(
    'https://champion-tiger-15.hasura.app/v1/graphql',
    '{todos{id title is_public is_completed user_id}}',
  )

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

    await doMutation(mutation, { title, userId: '1' })
    setTitle('')
  }

  // Affichage de la page de test avec le formulaire et les données récupérées depuis Hasura.
  return (
    <div>
      <h1> Page de test </h1>
      {/* Formulaire pour l'ajout de todo */}
      <div>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Ajouter un todo"
        />
        <button onClick={handleAddTodo}>Ajouter</button>
      </div>
      {error && <div>Erreur lors du chargement des données</div>}
      {isLoading ? (
        <div>Chargement...</div>
      ) : (
        data && (
          <div>
            <h2>Data:</h2>
            <pre>{JSON.stringify(data, null, 2)}</pre>
          </div>
        )
      )}
    </div>
  )
}

// Hook permettant d'envoyer une requête de mutation à Hasura.
function useMutationHasura(url) {
  const doMutation = async (mutation, variables) => {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-hasura-admin-secret':
            '2rbDMpmAVf8hUXvGy535Gv6xf5U87Ht0zTxLIzukfh3VtqDZRxPUkxZwko3ln5Bo',
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

// Hook permettant de récupérer les données depuis Hasura.
function useFetchHasura(url, query) {
  const [data, setData] = useState(null)
  const [isLoading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    if (!url || !query) return
    setLoading(true)

    async function fetchData() {
      try {
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-hasura-admin-secret':
              '2rbDMpmAVf8hUXvGy535Gv6xf5U87Ht0zTxLIzukfh3VtqDZRxPUkxZwko3ln5Bo',
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
  }, [url, query])

  return { isLoading, data, error }
}

export default Test
