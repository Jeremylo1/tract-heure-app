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

/*POURRAIT SERVIR PLUS TARD (NAVBAR) :

  //Fonction pour ouvrir le menu burger.
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  //Navbar avec menu burger pour téléphone.
<div className="is-hidden-desktop">
        <div>
          <img src={LogoTxt} alt="Logo" width="150px" />
        </div>
        <nav
          id="navbar"
          className="bd-navbar navbar"
          role="navigation"
          aria-label="main navigation"
        >
          <div className="navbar-brand">
            <Link to="/" className="navbar-item">
              <Icon path={mdiHome} size={2} color="black" />
            </Link>
            <Link to="/inventory" className="navbar-item">
              <Icon path={mdiTractorVariant} size={2} color="black" />
            </Link>
            <Link to="/calendar" className="navbar-item">
              <Icon path={mdiCalendarMonth} size={2} color="black" />
            </Link>
            <button
              className={`navbar-burger ${isMenuOpen ? 'is-active' : ''}`}
              aria-label="menu"
              aria-expanded={isMenuOpen}
              onClick={handleMenuToggle}
              data-target="navMenuBurger"
            >
              <span></span>
              <span></span>
              <span></span>
            </button>
          </div>

          <div
            id="navMenuBurger"
            className={`navbar-menu ${isMenuOpen ? 'is-active' : ''}`}
          >
            <div className="navbar-start">
              <Link to="/" className="navbar-item">
                Profil
              </Link>
              <Link to="/" className="navbar-item">
                Historique
              </Link>
              <Link to="/" className="navbar-item">
                Crédits
              </Link>
            </div>
            <div className="navbar-end">
              <div className="navbar-item">
                <div className="button is-primary">
                  <strong>Se déconnecter</strong>
                </div>
              </div>
            </div>
          </div>
        </nav>
      </div>*/
