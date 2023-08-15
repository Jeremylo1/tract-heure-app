import React, { useState, useContext } from 'react'
import { useMutationHasura } from '../utils/react/hooks'
import CustomButton from '../components/button'
import AddButton from '../components/addbutton'
import ShowMachinery from '../components/showmachinery'
import { ScreenContext } from '../utils/react/context'
/*Base de données*/
import { LIEN_API } from '../utils/database/query'
/*Style*/
import '../styles/inventory.css'
import colors from '../utils/styles/color'
/*Importation des icônes*/
import Icon from '@mdi/react'
import { mdiTrashCanOutline } from '@mdi/js'
import { mdiInformationBoxOutline } from '@mdi/js'

function AdminMachinery() {
  //Hook pour la gestion de la machinerie sélectionnée.
  const [selectedMachinery, setSelectedMachinery] = useState(null)
  //Pour savoir si c'est un appareil mobile.
  const { isMobile } = useContext(ScreenContext)

  //Affichage des boutons du bas de l'accordéon.
  function groupButtonsAdmin(machinery) {
    return (
      <div className="grouped-buttons">
        <p className="control">
          <CustomButton
            /*functionclick={() => {
            }}*/
            color={colors.redButton}
            hovercolor={colors.redButtonHover}
          >
            {isMobile ? (
              <Icon path={mdiTrashCanOutline} size={1} color="white" />
            ) : (
              'Supprimer'
            )}
          </CustomButton>
        </p>
        <p className="control">
          <CustomButton
            /*to="" ou functionclick=""*/
            color={colors.blueButton}
            hovercolor={colors.blueButtonHover}
          >
            {isMobile ? (
              <Icon path={mdiInformationBoxOutline} size={1} color="white" />
            ) : (
              'Rapport'
            )}
          </CustomButton>
        </p>
        <p className="control">
          <CustomButton
            /*functionclick={() => {
            }}*/
            color={colors.greenButton}
            hovercolor={colors.greenButtonHover}
          >
            Modifier
          </CustomButton>
        </p>
      </div>
    )
  }

  //Permet d'envoyer une requête de mutation (INSERT, UPDATE, DELETE) à Hasura.
  const { doMutation, error_mutation } = useMutationHasura(LIEN_API)

  //Affichage selon le type d'appareil.
  return (
    <div>
      {isMobile ? (
        /* DESIGN POUR MOBILE */
        <div>
          <div className="columns-mobile">
            <div className="columns-mobile-size">
              <h1>Machinerie agricole</h1>
              <AddButton
                onClick={() => {
                  console.log('Ajouter') //TODO: Ajouter la fonctionnalité d'ajout !!!
                }}
              />
              <ShowMachinery functionButtons={groupButtonsAdmin} />
            </div>
          </div>
        </div>
      ) : (
        /* DESIGN POUR TABLETTE ET ORDINATEUR */
        <div>
          <div className="columns-tablet-desktop">
            <div className="columns-tablet-desktop-size">
              <h1>Machinerie agricole</h1>
              <AddButton
                onClick={() => {
                  console.log('Ajouter') //TODO: Ajouter la fonctionnalité d'ajout !!!
                }}
              />
              <ShowMachinery functionButtons={groupButtonsAdmin} />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminMachinery
