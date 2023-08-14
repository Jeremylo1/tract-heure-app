import React, { useState, useContext } from 'react'
import { useMutationHasura } from '../utils/react/hooks'
import CustomButton from '../components/button'
import ShowMachinery from '../components/showmachinery'
import { ScreenContext } from '../utils/react/context'
/*Style*/
import '../styles/inventory.css'
import colors from '../utils/styles/color'

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
            /*to="" ou functionclick=""*/
            color={colors.redButton}
            hovercolor={colors.redButtonHover}
          >
            Supprimer
          </CustomButton>
        </p>
        <p className="control">
          <CustomButton
            /*to="" ou functionclick=""*/
            color={colors.blueButton}
            hovercolor={colors.blueButtonHover}
          >
            Rapport
          </CustomButton>
        </p>
        <p className="control">
          <CustomButton
            functionclick={() => {
              setSelectedMachinery(machinery)
            }}
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
  const { doMutation, error_mutation } = useMutationHasura(
    'https://champion-tiger-15.hasura.app/v1/graphql',
  )

  //Affichage selon le type d'appareil.
  return (
    <div>
      {isMobile ? (
        /* DESIGN POUR MOBILE */
        <div>
          <div className="columns-mobile">
            <div className="columns-mobile-size">
              <h1>Machinerie agricole</h1>
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
              <ShowMachinery functionButtons={groupButtonsAdmin} />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminMachinery
