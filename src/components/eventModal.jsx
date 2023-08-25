import React from 'react'
import { useMutationHasura } from '../utils/react/hooks'
/*Composants*/
import Modal from '../components/modal'
import CustomButton from '../components/button'
/*Base de données*/
import { LIEN_API, DELETE_RESERVATION } from '../utils/database/query'
/*Style*/
import '../styles/calendar.css'
import colors from '../utils/styles/color'
const eventType = (type) => {
  switch (type) {
    case 1:
      return 'Réservation'
    case 2:
      return 'Maintenance'
    default:
      return 'Réservation'
  }
}

function EventModal({ isOpen, onClose, event }) {
  //Permet d'envoyer une requête de mutation (INSERT, UPDATE, DELETE) à Hasura.
  const { doMutation } = useMutationHasura(LIEN_API)

  const deleteReservation = async (id) => {
    try {
      const responseDataMutation = await doMutation(DELETE_RESERVATION, { id })
      if (responseDataMutation) {
        alert('Réservation annulée avec succès!')
        onClose() // Fermer la modale
        localStorage.setItem('currentDate', new Date().toISOString())
        window.location.reload()
      }
    } catch (err) {
      console.error(err)
      alert("Une erreur s'est produite lors de l'annulation de la réservation.")
    }
  }

  const confirmDeletion = (id) => {
    const userConfirmed = window.confirm(
      'Êtes-vous sûr de vouloir annuler cette réservation?',
    )
    if (userConfirmed) {
      deleteReservation(id)
    }
  }

  return (
    <Modal
      title={event ? event.title : "Détails de l'événement"}
      isOpen={isOpen}
      onClose={onClose}
      content={
        <>
          {event && (
            <div>
              {event?.description ? (
                <>
                  <h2>Commentaire</h2>
                  <p>{event?.description}</p>
                </>
              ) : null}

              <h3>Type</h3>
              <p>{eventType(event?.type)}</p>
              <h3>Date de début</h3>
              <p>{event?.start?.toLocaleString()}</p>
              <h3>Date de fin</h3>
              <p>{event?.end?.toLocaleString()}</p>
              <CustomButton
                color={colors.redButton}
                hovercolor={colors.redButtonHover}
                functionclick={() => confirmDeletion(event?.id)}
              >
                Annuler la réservation
              </CustomButton>
            </div>
          )}
        </>
      }
    />
  )
}

export default EventModal
