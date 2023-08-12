import React, { useContext, useEffect, useState } from 'react'
import { useTable, useSortBy } from 'react-table'
import { ScreenContext } from '../utils/react/context'
import { Link } from 'react-router-dom'
import { useFetchHasura } from '../utils/react/hooks'

//Page d'accueil pour l'administrateur.
function AdminCategory() {
  /*INFOS SUR LA BASE DE DONNÉES (À MODIFIER AU BESOIN)*/
  //Lien de l'API GraphQL à utiliser.
  const api_url = 'https://champion-tiger-15.hasura.app/v1/graphql'
  //Nom de la table à utiliser.
  const table_category = 'machinerie_categorie'
  //Nom des colonnes à utiliser.
  const column_id = 'id'
  const column_name = 'nom'
  /* FIN DES INFOS*/

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
    api_url,
    `{${table_category}{${column_id} ${column_name}}}`,
    firstLoading,
  )

  //Permet de définir si c'est la première fois qu'on charge la page.
  useEffect(() => {
    setFirstLoading(false)
  }, [])
}

export default AdminCategory
