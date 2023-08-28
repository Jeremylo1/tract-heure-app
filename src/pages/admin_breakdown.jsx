import React, { useState, useContext } from 'react'
import { ScreenContext } from '../utils/react/context'
/*Composants*/
import CustomButton from '../components/button'
//import AddButton from '../components/addbutton'
import ShowBreakdown from '../components/showbreakdown'
import Modal from '../components/modal'
/*Formulaire*/
import FormDelBreakdown from '../forms/form_delbreakdown'
import FormBreakdown from '../forms/form_breakdown'
/*Style*/
import '../styles/admin_machinery.css'
import colors from '../utils/styles/color'
/*Importation des icônes*/
import Icon from '@mdi/react'
import { mdiTrashCanOutline } from '@mdi/js'
import { mdiPencilOutline } from '@mdi/js'

function AdminBreakdown() {
  //Titre de la page.
  document.title = 'Tableau de bord'

  //Hook pour la gestion du bris sélectionné.
  const [selectedMachineryBreakdown, setSelectedMachineryBreakdown] =
    useState(null)
  //Hook pour la gestion de la modale de modification.
  const [isEditModalOpen, setEditModalOpen] = useState(false)
  //Hook pour la gestion de la modale de suppression.
  const [isDelModalOpen, setDelModalOpen] = useState(false)

  //Pour savoir si c'est un appareil mobile.
  const { isMobile } = useContext(ScreenContext)

  /*AFFICHAGE*/
  //Affichage des boutons du bas de l'accordéon.
  function groupButtonsAdmin(bris) {
    return (
      <div className="grouped-buttons">
        <p className="control">
          <CustomButton
            functionclick={() => {
              setDelModalOpen(true) /*Pour la modale de suppression.*/
              setSelectedMachineryBreakdown(bris)
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
            functionclick={() => {
              setEditModalOpen(true) /*Pour la modale de modification.*/
              setSelectedMachineryBreakdown(bris)
            }}
            color={colors.greenButton}
            hovercolor={colors.greenButtonHover}
          >
            {isMobile ? (
              <Icon path={mdiPencilOutline} size={1} color="white" />
            ) : (
              'Modifier'
            )}
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
          <h1>Gestion des bris</h1>
          {/*<AddButton
            onClick={() => {
              setAddModalOpen(true)
            }}
          />*/}
          <ShowBreakdown functionButtons={groupButtonsAdmin} />
        </div>
      </div>

      {/* MODALE POUR MODIFIER UN BRIS */}
      <Modal
        title={'Modifier un bris'}
        content={
          <FormBreakdown
            closeModal={() => {
              setEditModalOpen(false) //Fermeture de la modale.
            }}
            selectedMachinery={selectedMachineryBreakdown}
          />
        }
        isOpen={isEditModalOpen}
        onClose={() => {
          setEditModalOpen(false)
        }}
      />

      {/* MODALE POUR SUPPRIMER UN BRIS */}
      <Modal
        title={'Supprimer un bris'}
        content={
          <FormDelBreakdown
            closeModal={() => {
              setDelModalOpen(false) //Fermeture de la modale.
            }}
            selectedMachineryBreakdown={selectedMachineryBreakdown}
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

export default AdminBreakdown
