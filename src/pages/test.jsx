import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import 'bulma/css/bulma.min.css'

function Test() {
  const [data, setData] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(
        'https://champion-tiger-15.hasura.app/v1/graphql',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-hasura-admin-secret':
              '2rbDMpmAVf8hUXvGy535Gv6xf5U87Ht0zTxLIzukfh3VtqDZRxPUkxZwko3ln5Bo',
          },
          body: JSON.stringify({
            query: '{todos{id title is_public is_completed user_id}}',
          }),
        },
      )

      const responseData = await response.json()

      setData(responseData.data)
    }

    fetchData()
  }, [])

  return (
    <div>
      <h1> Page de test </h1>
      {data && (
        <div>
          <h2>Data:</h2>
          <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
      )}
    </div>
  )
}

export default Test
