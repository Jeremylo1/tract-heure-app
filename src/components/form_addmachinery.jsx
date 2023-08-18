import React, { useState } from 'react'
import { useCategory } from '../utils/react/hooks'
import PropTypes from 'prop-types'
/*Base de données*/
import { COLUMN_ID, COLUMN_NAME } from '../utils/database/query'
/*Style*/
import colors from '../utils/styles/color'
import 'bulma/css/bulma.min.css'

//Formulaire d'ajout d'une machine.
function FormAddMachinery() {
  //Pour stocker l'ID de la catégorie sélectionnée.
  const [selectedCategoryId, setSelectedCategoryId] = useState(0)

  //Pour récupérer les catégories.
  const { sortedCategories, category_loading, category_error } = useCategory()

  return (
    <div>
      {/*Nom*/}
      <div className="field">
        <label className="label">Nom</label>
        <div className="control">
          <input
            className="input"
            type="text"
            placeholder="Entrez le nom de la machine"
          />
        </div>
      </div>
      {/*Catégorie*/}
      <label className="label">Catégorie</label>
      <div className="select">
        <select
          value={selectedCategoryId}
          onChange={(e) => setSelectedCategoryId(parseInt(e.target.value))}
        >
          {sortedCategories.map((category) => (
            <option
              key={`${category[COLUMN_NAME]}-${category[COLUMN_ID]}`}
              value={parseInt(category[COLUMN_ID])}
            >
              {category[COLUMN_NAME]}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}

export default FormAddMachinery
