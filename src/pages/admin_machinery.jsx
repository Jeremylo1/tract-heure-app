import React, { useState, useContext } from 'react'
import { useMutationHasura } from '../utils/react/hooks'
import { ScreenContext } from '../utils/react/context'
import CustomButton from '../components/button'
import AddButton from '../components/addbutton'
import ShowMachinery from '../components/showmachinery'
import Modal from '../components/modal'
import FormAddMachinery from '../components/form_addmachinery'
/*Base de données*/
/*Base de données*/
import {
  LIEN_API,
  COLUMN_ID,
  COLUMN_NAME,
  COLUMN_MODEL,
  COLUMN_SERIAL_NUMBER,
  CHECK_MACHINERY_RESERVATION,
  DELETE_MACHINERY,
} from '../utils/database/query'
/*Style*/
import '../styles/inventory.css'
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
  //Hook pour la gestion de la modale de suppression.
  const [isDelModalOpen, setDelModalOpen] = useState(false)

  //Pour savoir si c'est un appareil mobile.
  const { isMobile } = useContext(ScreenContext)

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

  //Permet de supprimer une machine.
  async function deleteMachinery() {
    const variables = {
      machineryId: selectedMachinery?.[COLUMN_ID],
    }

    //Vérification de l'existence de réservation(s) pour la machine.
    const reservationExists = await doMutation(
      CHECK_MACHINERY_RESERVATION,
      variables,
    )

    //Si la machine a une (ou plusieurs) réservation.
    if (reservationExists?.machinerie_reservation?.length > 0) {
      alert(
        'Impossible de supprimer cette machine, car elle a une (ou plusieurs) réservation(s).',
      )
    } else {
      //Si la machine n'a pas de réservation.
      //Suppression de la machine.
      const deleteMachinery = await doMutation(DELETE_MACHINERY, variables)

      //Si la suppression a fonctionné.
      if (deleteMachinery?.delete_machinerie?.affected_rows > 0) {
        alert('La machine a été supprimée avec succès.')
      } else {
        alert("La machine n'a pas été supprimée.")
      }

      //Fermeture de la modale de suppression.
      setDelModalOpen(false)

      //Rafraîchissement de la page.
      window.location.reload()
    }
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
          <h1>Machinerie agricole</h1>
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
        content={<FormAddMachinery />}
        isOpen={isAddModalOpen}
        onClose={() => {
          setAddModalOpen(false)
        }}
      />

      {/* MODALE POUR SUPPRIMER UNE MACHINE */}
      <Modal
        title={'Supprimer une machine'}
        content={
          <>
            <span>Êtes-vous sûr(e) de vouloir supprimer cette machine ?</span>
            <br />
            <ul>
              <li>{selectedMachinery?.[COLUMN_NAME]}</li>
              <ul>
                <li>Modèle : {selectedMachinery?.[COLUMN_MODEL]}</li>
                <li>
                  Numéro de série : {selectedMachinery?.[COLUMN_SERIAL_NUMBER]}
                </li>
              </ul>
            </ul>
            <div>
              <CustomButton
                functionclick={() => {
                  deleteMachinery()
                }}
                color={colors.redButton}
                hovercolor={colors.redButtonHover}
              >
                Oui
              </CustomButton>
              <CustomButton
                /*functionclick={() => {
            }}*/
                color={colors.greyButton}
                hovercolor={colors.greyButtonHover}
              >
                Annuler
              </CustomButton>
            </div>
          </>
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
