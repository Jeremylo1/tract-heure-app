import React, { useContext, useEffect, useState } from 'react'
import { useTable, useSortBy } from 'react-table'
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

//Page d'accueil pour l'administrateur.
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
}

export default AdminCategory
