import React, { useEffect, useState, useContext } from 'react'
import Modal from '../components/modal'
import CustomButton from '../components/button'
import ShowMachinery from '../components/showmachinery'
import { ScreenContext } from '../utils/react/context'
/*Style*/
import '../styles/inventory.css'
import colors from '../utils/styles/color'
import StyledTitlePage from '../utils/styles/atoms'

function Inventory() {
  //Hook pour la gestion de la modale.
  const [isModalOpen, setModalOpen] = useState(false)
  //Hook pour la gestion de la machinerie sélectionnée.
  const [selectedMachinery, setSelectedMachinery] = useState(null)
  //Pour savoir si c'est un appareil mobile.
  const { isMobile } = useContext(ScreenContext)

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
            Disponibilités
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

  const [startDate, setStartDate] = useState(null)
  const [startTime, setStartTime] = useState(null)
  const [endDate, setEndDate] = useState(null)
  const [endTime, setEndTime] = useState(null)

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
    console.log('Réservation effectuée !')
    console.log('Date de début : ' + startDate)
    console.log('Heure de début : ' + startTime)
    console.log('Date de fin : ' + endDate)
    console.log('Heure de fin : ' + endTime)
  }

  //Affichage selon le type d'appareil.
  return (
    <div>
      {/* DESIGN POUR ORDINATEUR */}
      <div className="is-hidden-touch">
        <div className="columns">
          <div className="column is-8 is-offset-2">
            <StyledTitlePage className="title">
              Machinerie agricole
            </StyledTitlePage>
            <ShowMachinery functionButtons={groupButtons} />
          </div>
        </div>
      </div>

      {/* DESIGN POUR MOBILE */}
      <div className="is-hidden-desktop">
        <div className="columns is-mobile">
          <div className="column is-10 is-offset-1">
            <StyledTitlePage className="title is-5 has-text-centered">
              Machinerie agricole
            </StyledTitlePage>
            <ShowMachinery functionButtons={groupButtons} />
          </div>
        </div>
      </div>

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
