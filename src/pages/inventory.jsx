import React, { useState, useContext } from 'react'
import { useMutationHasura } from '../utils/react/hooks'
import Modal from '../components/modal'
import CustomButton from '../components/button'
import ShowMachinery from '../components/showmachinery'
import { ScreenContext } from '../utils/react/context'
import { toISODateTime } from '../utils/reusable/functions'
/*Style*/
import '../styles/inventory.css'
import colors from '../utils/styles/color'
/*Importation des icônes*/
import Icon from '@mdi/react'
import { mdiCalendarSearch } from '@mdi/js'
import { mdiInformationBoxOutline } from '@mdi/js'

function Inventory() {
  //Hook pour la gestion de la modale.
  const [isModalOpen, setModalOpen] = useState(false)
  //Hook pour la gestion de la machinerie sélectionnée.
  const [selectedMachinery, setSelectedMachinery] = useState(null)
  //Pour savoir si c'est un appareil mobile.
  const { isMobile } = useContext(ScreenContext)
  //Pour stocker les dates et heures de réservation.
  const [startDate, setStartDate] = useState(new Date())
  const [startTime, setStartTime] = useState(new Date())
  const [endDate, setEndDate] = useState(new Date())
  const [endTime, setEndTime] = useState(new Date())

  //Affichage des boutons du bas de l'accordéon.
  function groupButtons(machinery) {
    return (
      <div className="grouped-buttons">
        <p className="control">
          <CustomButton
            /*to="" ou functionclick=""*/
            color={colors.blueButton}
            hovercolor={colors.blueButtonHover}
          >
            {isMobile ? (
              <Icon path={mdiCalendarSearch} size={1} color="white" />
            ) : (
              'Disponibilités'
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
              setSelectedMachinery(machinery)
              setModalOpen(true)
            }}
            color={colors.greenButton}
            hovercolor={colors.greenButtonHover}
          >
            Réserver
          </CustomButton>
        </p>
      </div>
    )
  }

  //Permet d'envoyer une requête de mutation (INSERT, UPDATE, DELETE) à Hasura.
  const { doMutation, error_mutation } = useMutationHasura(
    'https://champion-tiger-15.hasura.app/v1/graphql',
  )

  /*Permet d'ajouter un todo à la base de données. 
  Le titre du todo est récupéré depuis le state `title`.*/
  const addReservation = async () => {
    const mutation = `
      mutation InsertMachinerieReservation($machineryId: Int!, $userId: String!, $startDate: timestamptz!, $endDate: timestamptz!) {
        insert_machinerie_reservation(objects:[{machinerie_id:$machineryId, utilisateur_id:$userId, date_debut: $startDate, date_fin: $endDate}]) {
          affected_rows
        }
      }
    `

    try {
      const responseDataMutation = await doMutation(mutation, {
        machineryId: selectedMachinery.id,
        userId: '1', // TODO: Remplacer par l'ID de l'utilisateur connecté
        // Convertir les dates et heures en objets Date format ISO pour faciliter la comparaison avec " "
        startDate: toISODateTime(startDate, startTime),
        endDate: toISODateTime(endDate, endTime),
      })
      if (responseDataMutation) {
        // Réinitialise les valeurs après la soumission
        setStartDate(null)
        setStartTime(null)
        setEndDate(null)
        setEndTime(null)

        // Ferme la modale
        setModalOpen(false)
      }
    } catch (err) {
      console.error(err)
      alert(
        "Une erreur s'est produite lors de l'enregistrement de la réservation.",
      )
    }
  }

  // Gestion de réservation de la machinerie
  function handleReservation(e) {
    e.preventDefault()

    // Convertir les dates et heures en objets Date pour faciliter la comparaison
    const startDateTime = new Date(startDate + ' ' + startTime)
    const endDateTime = new Date(endDate + ' ' + endTime)

    // Vérifier si la date/heure de début est supérieure à la date/heure de fin
    if (startDateTime >= endDateTime) {
      alert(
        "La date et l'heure de début doivent être antérieures à la date et l'heure de fin!",
      )
      return
    }

    // Vérifier si la durée de la réservation est au moins de 30 minutes
    const duration = (endDateTime - startDateTime) / (1000 * 60) // Durée en minutes
    if (duration < 30) {
      alert("La réservation doit être d'une durée minimale de 30 minutes!")
      return
    }

    // Traitement de la réservation ici, par exemple en envoyant les données au serveur

    // Réinitialise les valeurs après la soumission
    setStartDate(null)
    setStartTime(null)
    setEndDate(null)
    setEndTime(null)

    // Ferme la modale
    setModalOpen(false)
    addReservation()
  }

  //Affichage selon le type d'appareil.
  return (
    <div>
      {isMobile ? (
        /* DESIGN POUR MOBILE */
        <div>
          <div className="columns-mobile">
            <div className="columns-mobile-size">
              <h1>Machinerie agricole</h1>
              <ShowMachinery functionButtons={groupButtons} />
            </div>
          </div>
        </div>
      ) : (
        /* DESIGN POUR TABLETTE ET ORDINATEUR */
        <div>
          <div className="columns-tablet-desktop">
            <div className="columns-tablet-desktop-size">
              <h1>Machinerie agricole</h1>
              <ShowMachinery functionButtons={groupButtons} />
            </div>
          </div>
        </div>
      )}

      {/* MODALE DE RÉSERVATION */}
      <Modal
        title={`Réserver : ${selectedMachinery?.nom || 'Non sélectionné'}`}
        content={
          <>
            <form onSubmit={handleReservation}>
              <div>
                <label>Date de début: </label>
                <input
                  type="date"
                  required
                  onChange={(e) => setStartDate(e.target.value)}
                />
                <label>Heure de début: </label>
                <input
                  type="time"
                  required
                  onChange={(e) => setStartTime(e.target.value)}
                />
              </div>
              <div>
                <label>Date de fin: </label>
                <input
                  type="date"
                  required
                  onChange={(e) => setEndDate(e.target.value)}
                />
                <label>Heure de fin: </label>
                <input
                  type="time"
                  required
                  onChange={(e) => setEndTime(e.target.value)}
                />
              </div>
              <CustomButton
                type="submit"
                color={colors.greenButton}
                hovercolor={colors.greenButtonHover}
              >
                Confirmer la réservation
              </CustomButton>
            </form>
          </>
        }
        isOpen={isModalOpen}
        onClose={() => {
          setModalOpen(false)
          setSelectedMachinery(null) //Réinitialise la machinerie sélectionnée.
        }}
      />
    </div>
  )
}

export default Inventory
