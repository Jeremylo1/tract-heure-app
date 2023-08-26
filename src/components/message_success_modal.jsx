import React from 'react'
/*Importation des icônes*/
import Icon from '@mdi/react'
import { mdiCheckCircleOutline } from '@mdi/js'

//Afficher un message de succès.
function ModalSuccess() {
  return (
    <div className="has-text-centered">
      <Icon path={mdiCheckCircleOutline} size={4} color="green" />
    </div>
  )
}

export default ModalSuccess
