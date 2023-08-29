import React, { useState } from 'react'
import { useMutationHasura } from '../utils/react/hooks'
/*Composants*/
import Modal from '../components/modal'
import CustomButton from '../components/button'
import ModalSuccess from '../components/message_success_modal'
/*Toast*/
import { toast } from 'react-toastify'
/*Base de données*/
import { LIEN_API, DELETE_RESERVATION } from '../utils/database/query'
/*Style*/
import '../styles/calendar.css'
import colors from '../utils/styles/color'

//Permet de déterminer le type d'événement.
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
  //Afficher le formulaire ou le check de succès.
  const [showForm, setShowForm] = useState(true)

  const deleteReservation = async (id) => {
    try {
      const responseDataMutation = await doMutation(DELETE_RESERVATION, { id })
      if (responseDataMutation) {
        toast.success('Réservation annulée avec succès!')

        //Affichage du message de succès.
        setShowForm(false)

        setTimeout(() => {
          onClose()
        }, 3000)
        localStorage.setItem('currentDate', new Date().toISOString())
        window.location.reload()
      }
    } catch (err) {
      console.error(err)
      toast.error("Une erreur s'est produite!")
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
        showForm ? (
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
                <p>
                  {event?.start?.toLocaleString(undefined, {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
                <h3>Date de fin</h3>
                <p>
                  {event?.end?.toLocaleString(undefined, {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
                {/* Centrer le bouton */}
                <div className="has-text-centered">
                  <CustomButton
                    color={colors.redButton}
                    hovercolor={colors.redButtonHover}
                    functionclick={() => confirmDeletion(event?.id)}
                  >
                    Annuler la réservation
                  </CustomButton>
                </div>
              </div>
            )}
          </>
        ) : (
          //Icone de succès.
          <ModalSuccess />
        )
      }
    />
  )
}

export default EventModal
