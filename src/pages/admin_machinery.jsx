import React, { useState, useContext } from 'react'
import { ScreenContext } from '../utils/react/context'
/*Composants*/
import CustomButton from '../components/button'
import AddButton from '../components/addbutton'
import ShowMachinery from '../components/showmachinery'
import Modal from '../components/modal'
/*Formulaire*/
import FormMachinery from '../forms/form_machinery'
import FormDelMachinery from '../forms/form_delmachinery'
/*Style*/
import '../styles/admin_machinery.css'
import colors from '../utils/styles/color'
/*Importation des icônes*/
import Icon from '@mdi/react'
import { mdiTrashCanOutline } from '@mdi/js'
import { mdiInformationBoxOutline } from '@mdi/js'

function AdminMachinery() {
  //Titre de la page.
  document.title = 'Tableau de bord'

  //Hook pour la gestion de la machinerie sélectionnée.
  const [selectedMachinery, setSelectedMachinery] = useState(null)
  //Hook pour la gestion de la modale d'ajout.
  const [isAddModalOpen, setAddModalOpen] = useState(false)
  //Hook pour la gestion de la modale de modification.
  const [isEditModalOpen, setEditModalOpen] = useState(false)
  //Hook pour la gestion de la modale de suppression.
  const [isDelModalOpen, setDelModalOpen] = useState(false)

  //Pour savoir si c'est un appareil mobile.
  const { isMobile } = useContext(ScreenContext)

  /*AFFICHAGE*/
  //Affichage des boutons du bas de l'accordéon.
  function groupButtonsAdmin(machinery) {
    return (
      <div className="grouped-buttons">
        <p className="control">
          <CustomButton
            functionclick={() => {
              setDelModalOpen(true) /*Pour la modale de suppression.*/
              setSelectedMachinery(machinery)
            }}
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
            functionclick={() => {
              setEditModalOpen(true) /*Pour la modale de modification.*/
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
          <h1>Gestion de la machinerie</h1>
          <AddButton
            onClick={() => {
              setAddModalOpen(true)
            }}
          />
          <ShowMachinery functionButtons={groupButtonsAdmin} />
        </div>
      </div>

      {/* MODALE POUR AJOUTER UNE MACHINE */}
      <Modal
        title={'Ajouter une machine'}
        content={
          <FormMachinery
            closeModal={() => {
              setAddModalOpen(false) //Fermeture de la modale.
            }}
          />
        }
        isOpen={isAddModalOpen}
        onClose={() => {
          setAddModalOpen(false)
        }}
      />

      {/* MODALE POUR MODIFIER UNE MACHINE */}
      <Modal
        title={'Modifier une machine'}
        content={
          <FormMachinery
            closeModal={() => {
              setEditModalOpen(false) //Fermeture de la modale.
            }}
            selectedMachinery={selectedMachinery}
          />
        }
        isOpen={isEditModalOpen}
        onClose={() => {
          setEditModalOpen(false)
        }}
      />

      {/* MODALE POUR SUPPRIMER UNE MACHINE */}
      <Modal
        title={'Supprimer une machine'}
        content={
          <FormDelMachinery
            closeModal={() => {
              setDelModalOpen(false) //Fermeture de la modale.
            }}
            selectedMachinery={selectedMachinery}
          />
        }
        isOpen={isDelModalOpen}
        onClose={() => {
          setDelModalOpen(false)
        }}
      />
    </div>
  )
}

export default AdminMachinery
