import React from 'react'
import { useTable, useSortBy } from 'react-table'

function TodoList({ todos, showJSON }) {
  const data = React.useMemo(() => todos, [todos])

  const columns = React.useMemo(
    () => [
      {
        Header: 'Titre',
        accessor: 'title', // Nom de la propriété à afficher
      },
      {
        Header: 'Auteur',
        accessor: (row) => row.user.name,
      },
      {
        Header: 'Statut',
        accessor: (row) => (row.is_completed ? 'Complété' : 'Non Complété'),
      },
    ],
    [],
  )

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data }, useSortBy) // Utilisation du hook useSortBy pour le tri

  if (showJSON) {
    return <pre>{JSON.stringify(todos, null, 2)}</pre>
  }

  return (
    <div>
      <h2>Todos:</h2>
      <table {...getTableProps()} className="table is-striped is-fullwidth">
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                  {column.render('Header')}
                  {/* Ajout d'un indicateur de tri */}
                  <span>
                    {column.isSorted
                      ? column.isSortedDesc
                        ? ' 🔽'
                        : ' 🔼'
                      : ''}
                  </span>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row) => {
            prepareRow(row)
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map((cell) => {
                  return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                })}
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

export default TodoList
