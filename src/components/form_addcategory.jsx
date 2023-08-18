import React from 'react'
import PropTypes from 'prop-types'

function FormAddCategory() {
  return (
    <div>
      <div className="field">
        <label className="label">Nom</label>
        <div className="control">
          <input
            className="input"
            type="text"
            placeholder="Entrez le nom de la catégorie"
          />
        </div>
      </div>
    </div>
  )
}

export default FormAddCategory
