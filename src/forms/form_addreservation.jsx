import React, { useEffect, useState } from 'react'
import { useMutationHasura } from '../utils/react/hooks'
import { toISODateTime } from '../utils/reusable/functions'
/*Composants*/
import CustomButton from '../components/button'
import AvailabilityTable from '../components/availability_table'
/*Base de données*/
import {
  LIEN_API,
  INSERT_RESERVATION,
  CHECK_RESERVATION_TIME_CONFLICT,
  COLUMN_ID,
} from '../utils/database/query'
/*Style*/
import '../styles/inventory.css'
import colors from '../utils/styles/color'

//Formulaire de réservation d'une machine.
function FormAddReservation({
  machinery,
  onClose,
  availabilitiesIsLoading,
  availabilities,
}) {
  //Pour stocker les dates et heures de réservation.
  const [startDate, setStartDate] = useState(new Date())
  const [startTime, setStartTime] = useState(new Date())
  const [endDate, setEndDate] = useState(new Date())
  const [endTime, setEndTime] = useState(new Date())
  //Pour stocker le type de réservation.
  const [reservationType, setReservationType] = useState(null)
  //Pour stocker le commentaire de la réservation.
  const [reservationComment, setReservationComment] = useState('')
  //Succès lors de l'enregistrement.
  const [successMutation, setSuccessMutation] = useState(false)

  //Permet d'envoyer une requête de mutation (INSERT, GET) à Hasura.
  const { doMutation } = useMutationHasura(LIEN_API)

  /*AJOUT DE LA RÉSERVATION À LA BASE DE DONNÉES*/
  const addReservation = async () => {
    try {
      const responseDataMutation = await doMutation(INSERT_RESERVATION, {
        machineryId: machinery.id,
        userId: localStorage.getItem('userId'), //TEMPORAIRE.
        //Convertir les dates et heures en objets Date format ISO pour faciliter la comparaison avec " ".
        startDate: toISODateTime(startDate, startTime),
        endDate: toISODateTime(endDate, endTime),
        typeId: reservationType,
        userReservationComment: reservationComment ? reservationComment : null,
      })
      if (responseDataMutation) {
        setSuccessMutation(true) //Pour toast + réinitialisation +fermeture modale.
      }
    } catch (err) {
      console.error(err)
      toast.error("Erreur lors de l'enregistrement de la réservation.")
    }
  }

  /*TOAST DE SUCCÈS ET RÉINITIALISATION DES VARIABLES*/
  useEffect(() => {
    if (successMutation) {
      //Toast de succès.
      toast.success('Réservation ajoutée.')

      //Réinitialise les valeurs après la soumission.
      setStartDate(null)
      setStartTime(null)
      setEndDate(null)
      setEndTime(null)
      setReservationType(null)
      setReservationComment('')
      setSuccessMutation(false)

      //Fermeture de la modale.
      onClose()
      // setTimeout(() => {
      //   onClose()
      // }, 3000)
    }
  }, [successMutation, onClose])

  /*VÉRIFICATION DE CONFLIT DE RÉSERVATION*/
  //Permet de vérifier si la réservation est en conflit avec une autre réservation existante.
  const checkReservationConflict = async (startDateTime, endDateTime) => {
    const variables = {
      machineryId: machinery?.[COLUMN_ID],
      startDateTime: toISODateTime(startDate, startTime),
      endDateTime: toISODateTime(endDate, endTime),
    }

    const reservations = await doMutation(
      CHECK_RESERVATION_TIME_CONFLICT,
      variables,
    )
    return reservations?.machinerie_reservation?.length > 0
  }

  /*FONCTION AGISSANT À L'ENVOI DU FORMULAIRE*/
  async function handleReservation(e) {
    e.preventDefault()

    //Convertir les dates et heures en objets Date pour faciliter la comparaison.
    const startDateTime = new Date(startDate + ' ' + startTime)
    const endDateTime = new Date(endDate + ' ' + endTime)
    const currentDateTime = new Date() // Date et heure actuelles

    //Vérifier si la date/heure de début est dans le passé.
    if (startDateTime < currentDateTime) {
      toast.error('Date/heure de la réservation déjà passée !')
      return
    }

    //Vérifier si la date/heure de début est supérieure à la date/heure de fin.
    if (startDateTime >= endDateTime) {
      toast.error(
        "La date et l'heure de début doivent être antérieures à la date et à l'heure de fin !",
      )
      return
    }

    //Vérifier si la durée de la réservation est au moins de 30 minutes.
    const duration = (endDateTime - startDateTime) / (1000 * 60) //Durée en minutes.
    if (duration < 30) {
      toast.error('Réservation minimale de 30 minutes !')
      return
    }

    //Traitement de la réservation ici, par exemple en envoyant les données au serveur.
    const conflictExists = await checkReservationConflict(
      startDateTime,
      endDateTime,
    )

    if (conflictExists) {
      toast.error('Machine déjà réservée pour la période sélectionnée.')
      return
    } else {
      addReservation()
    }
  }

  /*AFFICHAGE DU FORMULAIRE*/
  return (
    <div>
      <p>Veuillez remplir les informations ci-dessous pour réserver.</p>
      <form onSubmit={handleReservation}>
        {/*Type de réservation*/}
        <div className="form-group">
          <label className="form-label">Type de réservation :</label>
          <div>
            <input
              type="radio"
              id="reservation"
              name="reservationType"
              value="1"
              checked={reservationType === '1'}
              required
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
              required
              onChange={(e) => setReservationType(e.target.value)}
            />
            <label htmlFor="maintenance">Maintenance</label>
          </div>
        </div>
        {/*Date de début*/}
        <div className="columns">
          <div className="column is-6 py-0">
            <div className="form-group">
              <label className="form-label" htmlFor="startDate">
                Date de début :
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
            </div>
          </div>
          {/*Heure de début*/}
          <div className="column is-6 py-0">
            <div className="form-group">
              <label className="form-label" htmlFor="startTime">
                Heure de début :
              </label>
              <div className="input-wrapper">
                <input
                  id="startTime"
                  type="time"
                  className="form-input"
                  required
                  onChange={(e) => setStartTime(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
        {/*Date de fin*/}
        <div className="columns">
          <div className="column is-6 py-0">
            <div className="form-group">
              <label className="form-label" htmlFor="endDate">
                Date de fin :
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
            </div>
          </div>
          {/*Heure de fin*/}
          <div className="column is-6 py-0">
            <div className="form-group">
              <label className="form-label" htmlFor="endTime">
                Heure de fin :
              </label>
              <div className="input-wrapper">
                <input
                  id="endTime"
                  type="time"
                  className="form-input"
                  required
                  onChange={(e) => setEndTime(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
        {/*Commentaire*/}
        <div className="form-group">
          <label className="form-label py-0" htmlFor="reservationComment">
            Commentaire :
          </label>
          <textarea
            id="reservationComment"
            className="form-input"
            rows="4"
            placeholder="Entrez votre commentaire ici ..."
            onChange={(e) => setReservationComment(e.target.value)}
            value={reservationComment}
          ></textarea>
        </div>
        {/* Centrer le bouton */}
        <div className="has-text-centered">
          <CustomButton
            type="submit"
            color={colors.greenButton}
            hovercolor={colors.greenButtonHover}
          >
            Confirmer
          </CustomButton>
        </div>

        <h3>Prochaines disponibilités</h3>
        {availabilitiesIsLoading ? (
          <div className="loader is-loading"></div>
        ) : (
          <AvailabilityTable availabilities={availabilities} />
        )}
      </form>
    </div>
  )
}

export default FormAddReservation
