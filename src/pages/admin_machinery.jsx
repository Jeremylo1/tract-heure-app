import React, { useState, useContext } from 'react'
import { useMutationHasura } from '../utils/react/hooks'
import { ScreenContext } from '../utils/react/context'
import CustomButton from '../components/button'
import AddButton from '../components/addbutton'
import ShowMachinery from '../components/showmachinery'
import Modal from '../components/modal'
import FormAddMachinery from '../components/form_addmachinery'
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
  //Hook pour la gestion de la modale.
  const [isModalOpen, setModalOpen] = useState(false)
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
      {/* DESIGN POUR MOBILE : DESIGN POUR TABLETTE ET ORDINATEUR */}
      <div className={isMobile ? 'columns-mobile' : 'columns-tablet-desktop'}>
        <div
          className={
            isMobile ? 'columns-mobile-size' : 'columns-tablet-desktop-size'
          }
        >
          <h1>Machinerie agricole</h1>
          <AddButton
            onClick={() => {
              setModalOpen(true)
            }}
          />
          <ShowMachinery functionButtons={groupButtonsAdmin} />
        </div>
      </div>

      {/* MODALE POUR AJOUTER UNE MACHINE */}
      <Modal
        title={
          <>
            <h2>Ajouter une machine</h2>
          </>
        }
        content={
          <>
            <FormAddMachinery />
          </>
        }
        isOpen={isModalOpen}
        onClose={() => {
          setModalOpen(false)
        }}
      />
    </div>
  )
}

export default AdminMachinery
