import React from 'react'
import PropTypes from 'prop-types'

function FormAddCategory() {
  return (
    <div>
      <div class="field">
        <label class="label">Nom</label>
        <div class="control">
          <input
            class="input"
            type="text"
            placeholder="Entrez le nom de la catégorie"
          />
        </div>
      </div>
    </div>
  )
}

export default FormAddCategory
