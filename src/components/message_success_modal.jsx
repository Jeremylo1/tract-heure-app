import React from 'react'
/*Style*/
import colors from '../utils/styles/color'
/*Importation del'icône*/
import Icon from '@mdi/react'
import { mdiCheckCircleOutline } from '@mdi/js'

//Affichage d'un message de succès.
function ModalSuccess() {
  return (
    <div className="has-text-centered">
      <Icon path={mdiCheckCircleOutline} size={4} color={colors.colorSuccess} />
    </div>
  )
}

export default ModalSuccess
