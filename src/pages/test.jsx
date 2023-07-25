import React from 'react'
import { useState, useEffect } from 'react'

function Test() {
  // Ici, nous définissons un état pour la valeur du titre du todo.
  // `setTitle` sera utilisé pour mettre à jour ce titre lorsque l'utilisateur saisit des données dans le champ du formulaire.
  const [title, setTitle] = useState('')

  // Ici, nous utilisons le hook personnalisé `useFetchHasura` pour récupérer les todos depuis la base de données.
  // L'état de la récupération est stocké dans `data`, `isLoading`, et `error`.
  const { data, isLoading, error } = useFetchHasura(
    'https://champion-tiger-15.hasura.app/v1/graphql',
    '{todos{id title is_public is_completed user_id}}',
  )

  // Ici, nous utilisons le hook personnalisé `useMutationHasura` qui nous donne une fonction `doMutation` pour envoyer une mutation à Hasura.
  const { doMutation } = useMutationHasura(
    'https://champion-tiger-15.hasura.app/v1/graphql',
  )

  // Cette fonction est appelée lorsque l'utilisateur clique sur le bouton "Ajouter".
  // Elle crée la requête de mutation, l'envoie à Hasura avec `doMutation`, puis efface le champ du formulaire.
  const handleAddTodo = async () => {
    const mutation = `
      mutation {
        insert_todos(objects: [{title: "${title}", user_id: "1"}]) {
          affected_rows
        }
      }
    `
    await doMutation(mutation)
    setTitle('')
  }

  // C'est le code de rendu du composant.
  // Il affiche un champ de formulaire, un bouton, et soit un message d'erreur, un spinner de chargement, ou les données récupérées.
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

// Ce hook personnalisé effectue une mutation GraphQL sur Hasura.
// Il définit une fonction `doMutation` qui envoie la requête de mutation à l'URL spécifiée.
function useMutationHasura(url) {
  const doMutation = async (mutation) => {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-hasura-admin-secret':
            '2rbDMpmAVf8hUXvGy535Gv6xf5U87Ht0zTxLIzukfh3VtqDZRxPUkxZwko3ln5Bo',
        },
        body: JSON.stringify({ query: mutation }),
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

// Ce hook personnalisé récupère les données depuis Hasura.
// Il utilise `fetch` pour envoyer une requête POST à l'URL spécifiée, avec la requête GraphQL en corps de requête.
// L'état de la requête est suivi avec les états `data`, `isLoading`, et `error`.
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
