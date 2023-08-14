import React, { useContext, useEffect, useState } from 'react'
import { useTable, useSortBy, useRowSelect } from 'react-table'
import { ScreenContext } from '../utils/react/context'
import { Link } from 'react-router-dom'
import { useFetchHasura } from '../utils/react/hooks'
/*Base de données*/
import {
  LIEN_API,
  TABLE_CATEGORY,
  COLUMN_ID,
  COLUMN_NAME,
} from '../utils/database/query'

//Page de gestion des catégories.
function AdminCategory() {
  //Pour savoir si c'est la première fois qu'on charge les données.
  const [firstLoading, setFirstLoading] = useState(true)

  //Pour savoir si c'est un appareil mobile.
  const { isMobile } = useContext(ScreenContext)

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

  //Permet de créer le tableau des catégories.
  function tableCategory() {
    return (
      <div>
        {category_loading ? (
          <div>Chargement des catégories ...</div>
        ) : category_error ? (
          <div>Erreur lors du chargement des catégories !</div>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Catégorie</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {category_data[TABLE_CATEGORY].map((category) => (
                <tr key={`${category[COLUMN_NAME]}-${category[COLUMN_ID]}`}>
                  <td>{category[COLUMN_NAME]}</td>
                  <td>
                    <button>S</button>
                    <button>M</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    )
  }

  //Affichage selon le type d'appareil.
  return (
    <div>
      {isMobile ? (
        /* DESIGN POUR MOBILE */
        <div>
          <div className="columns-mobile">
            <div className="columns-mobile-size">
              <h1>Gestion des catégories</h1>
              <div>{tableCategory()}</div>
            </div>
          </div>
        </div>
      ) : (
        /* DESIGN POUR TABLETTE ET ORDINATEUR */
        <div>
          <div className="columns-tablet-desktop">
            <div className="columns-tablet-desktop-size">
              <h1>Gestion des catégories</h1>
              <div>{tableCategory()}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminCategory
