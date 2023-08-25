import React from 'react'
import CustomButton from './button'
/*Types*/
import PropTypes from 'prop-types'
/*Importation de l'icône*/
import Icon from '@mdi/react'
import { mdiPlusCircleOutline } from '@mdi/js'
/*Style*/
import '../styles/addbutton.css'
import colors from '../utils/styles/color'

//Bouton d'ajout.
function AddButton({ onClick }) {
  return (
    <div className="locationAddButton">
      <CustomButton
        color={colors.blueButton}
        hovercolor={colors.blueButtonHover}
        functionclick={onClick}
      >
        <Icon path={mdiPlusCircleOutline} size={1} color="white" />
        <span className="marginBetween">Ajouter</span>
      </CustomButton>
    </div>
  )
}

//Vérification des props.
AddButton.propTypes = {
  onClick: PropTypes.func.isRequired,
}

export default AddButton
