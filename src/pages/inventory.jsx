import React, { useEffect, useState, useContext } from 'react'
import { useMutationHasura } from '../utils/react/hooks'
import Modal from '../components/modal'
import CustomButton from '../components/button'
import ShowMachinery from '../components/showmachinery'
import { ScreenContext } from '../utils/react/context'
import { toISODateTime } from '../utils/reusable/functions'
/*Base de données*/
import {
  LIEN_API,
  INSERT_RESERVATION,
  CHECK_RESERVATION_TIME_CONFLICT,
  GET_UPCOMING_RESERVATIONS,
} from '../utils/database/query'
/*Style*/
import '../styles/inventory.css'
import colors from '../utils/styles/color'
/*Importation des icônes*/
import Icon from '@mdi/react'
import { mdiCalendarSearch } from '@mdi/js'
import { mdiInformationBoxOutline } from '@mdi/js'
import { mdiCalendar, mdiClockTimeFourOutline } from '@mdi/js'

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
  //Pour stocker le type de réservation.
  const [reservationType, setReservationType] = useState('1') // Par défaut, on met "Réservation".
  //Pour stocker les disponibilités de la machinerie sélectionnée.
  const [availabilities, setAvailabilities] = useState([])

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

  const getNextAvailabilities = async (machineryId) => {
    const variables = {
      machineryId,
      currentDateTime: new Date().toISOString(),
    }

    const upcomingReservations = await doMutation(
      GET_UPCOMING_RESERVATIONS,
      variables,
    )
    const slots = []

    let currentDate = new Date()

    upcomingReservations.machinerie_reservation.forEach(
      (reservation, index) => {
        if (new Date(reservation.date_debut) - currentDate > 0) {
          slots.push({
            start: currentDate,
            end: new Date(reservation.date_debut),
          })
        }
        currentDate = new Date(reservation.date_fin)
      },
    )

    if (currentDate !== new Date()) {
      // Si la date courante a été mise à jour après avoir parcouru les réservations
      slots.push({
        start: currentDate,
        end: 'Indéfiniment',
      })
    } else if (
      slots.length === 0 &&
      upcomingReservations.machinerie_reservation.length === 0
    ) {
      // Si la machine n'a aucune réservation à venir, elle est disponible indéfiniment.
      slots.push({
        start: currentDate,
        end: 'Indéfiniment',
      })
    }

    return slots.slice(0, 3)
  }

  useEffect(() => {
    if (isModalOpen && selectedMachinery) {
      getNextAvailabilities(selectedMachinery.id).then((slots) => {
        setAvailabilities(slots)
      })
    }
  }, [isModalOpen, selectedMachinery])

  // Permet de vérifier si la réservation est en conflit avec une autre réservation existante
  const checkReservationConflict = async (startDateTime, endDateTime) => {
    const variables = {
      machineryId: selectedMachinery.id,
      startDateTime: toISODateTime(startDate, startTime),
      endDateTime: toISODateTime(endDate, endTime),
    }

    const reservations = await doMutation(
      CHECK_RESERVATION_TIME_CONFLICT,
      variables,
    )
    return reservations?.machinerie_reservation?.length > 0
  }

  //Permet d'envoyer une requête de mutation (INSERT, UPDATE, DELETE) à Hasura.
  const { doMutation, error_mutation } = useMutationHasura(LIEN_API)

  /*Permet d'ajouter un todo à la base de données. 
  Le titre du todo est récupéré depuis le state `title`.*/
  const addReservation = async () => {
    try {
      const responseDataMutation = await doMutation(INSERT_RESERVATION, {
        machineryId: selectedMachinery.id,
        userId: '1', // TODO: Remplacer par l'ID de l'utilisateur connecté
        // Convertir les dates et heures en objets Date format ISO pour faciliter la comparaison avec " "
        startDate: toISODateTime(startDate, startTime),
        endDate: toISODateTime(endDate, endTime),
        typeId: reservationType,
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
  async function handleReservation(e) {
    e.preventDefault()

    // Convertir les dates et heures en objets Date pour faciliter la comparaison
    const startDateTime = new Date(startDate + ' ' + startTime)
    const endDateTime = new Date(endDate + ' ' + endTime)
    const currentDateTime = new Date() // Date et heure actuelles

    // Vérifier si la date/heure de début est dans le passé
    if (startDateTime < currentDateTime) {
      alert('Vous ne pouvez pas réserver à une date/heure déjà passée !')
      return
    }

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
    const conflictExists = await checkReservationConflict(
      startDateTime,
      endDateTime,
    )

    if (conflictExists) {
      alert('Cette machinerie est déjà réservée pour la période sélectionnée.')
      return
    } else {
      addReservation()
      // Ferme la modale
      setModalOpen(false)

      // Réinitialise les valeurs APRÈS la soumission
      setStartDate(null)
      setStartTime(null)
      setEndDate(null)
      setEndTime(null)
    }
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
            <h2>Réservation de machinerie</h2>
            <p>Veuillez remplir les informations ci-dessous pour réserver.</p>
            <form onSubmit={handleReservation}>
              <div className="form-group">
                <label>Type de réservation :</label>
                <div>
                  <input
                    type="radio"
                    id="reservation"
                    name="reservationType"
                    value="1"
                    checked={reservationType === '1'}
                    onChange={(e) => setReservationType(e.target.value)}
                  />
                  <label htmlFor="reservation">Réservation</label>
                </div>
                <div>
                  <input
                    type="radio"
                    id="maintenance"
                    name="reservationType"
                    value="2"
                    checked={reservationType === '2'}
                    onChange={(e) => setReservationType(e.target.value)}
                  />
                  <label htmlFor="maintenance">Maintenance</label>
                </div>
                <label className="form-label" htmlFor="startDate">
                  Date de début:
                </label>
                <div className="input-wrapper">
                  <input
                    id="startDate"
                    type="date"
                    className="form-input"
                    required
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>
                <div className="input-wrapper">
                  <input
                    type="time"
                    className="form-input"
                    required
                    onChange={(e) => setStartTime(e.target.value)}
                  />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="endDate">
                  Date de fin:
                </label>
                <div className="input-wrapper">
                  <input
                    id="endDate"
                    type="date"
                    className="form-input"
                    required
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>
                <div className="input-wrapper">
                  <input
                    type="time"
                    className="form-input"
                    required
                    onChange={(e) => setEndTime(e.target.value)}
                  />
                </div>
              </div>
              <CustomButton
                type="submit"
                color={colors.greenButton}
                hovercolor={colors.greenButtonHover}
              >
                Confirmer la réservation
              </CustomButton>

              <h3>Prochaines disponibilités</h3>
              {availabilities.map((slot, index) => {
                let startTimeStr = slot.start.toLocaleString()
                const currentTime = new Date().getTime()

                if (Math.abs(slot.start.getTime() - currentTime) <= 2000) {
                  startTimeStr = 'Maintenant'
                }

                let endTimeStr =
                  slot.end === 'Indéfiniment'
                    ? slot.end
                    : slot.end.toLocaleString()

                return (
                  <div key={index}>
                    {startTimeStr} - {endTimeStr}
                  </div>
                )
              })}
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
