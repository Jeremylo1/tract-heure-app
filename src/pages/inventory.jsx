import React, { useEffect, useState, useContext, useMemo } from 'react'
import { ScreenContext } from '../utils/react/context'
import { useFetchHasura } from '../utils/react/hooks'
/*Composants*/
import Modal from '../components/modal'
import CustomButton from '../components/button'
import ShowMachinery from '../components/showmachinery'
import AvailabilityTable from '../components/availability_table'
/*Formulaire*/
import FormAddReservation from '../forms/form_addreservation'
/*Base de données*/
import { LIEN_API, GET_UPCOMING_RESERVATIONS } from '../utils/database/query'
/*Style*/
import '../styles/inventory.css'
import colors from '../utils/styles/color'
/*Importation des icônes*/
import Icon from '@mdi/react'
import { mdiCalendarSearch } from '@mdi/js'
import { mdiInformationBoxOutline } from '@mdi/js'

function Inventory() {
  //Titre de la page.
  document.title = 'Catalogue'

  //Hook pour la gestion des modales.
  const [isModalReservationOpen, setModalReservationOpen] = useState(false)
  const [isModalAvailabilityOpen, setModalAvailabilityOpen] = useState(false)
  //Hook pour la gestion de la machinerie sélectionnée.
  const [selectedMachinery, setSelectedMachinery] = useState(null)
  //Pour savoir si c'est un appareil mobile.
  const { isMobile } = useContext(ScreenContext)

  //Pour stocker les disponibilités de la machinerie sélectionnée.
  const [availabilities, setAvailabilities] = useState([])

  //Affichage des boutons du bas de l'accordéon.
  function groupButtons(machinery) {
    return (
      <div className="grouped-buttons">
        <p className="control">
          <CustomButton
            functionclick={() => {
              setSelectedMachinery(machinery)
              setModalAvailabilityOpen(true)
            }}
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
              setModalReservationOpen(true)
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

  //Variables pour la requête.
  const machineryVariables = useMemo(
    () => ({
      machineryId: selectedMachinery ? selectedMachinery.id : null,
      currentDateTime: new Date().toISOString(),
    }),
    [selectedMachinery],
  )
  //Pour récupérer les prochaines disponibilités de la machinerie sélectionnée.
  const { isLoading, data, error } = useFetchHasura(
    LIEN_API,
    GET_UPCOMING_RESERVATIONS,
    false,
    machineryVariables,
  )

  //Permet de récupérer les prochaines disponibilités de la machinerie sélectionnée.
  useEffect(() => {
    if (data) {
      const slots = []
      let currentDate = new Date()

      data.machinerie_reservation.forEach((reservation, index) => {
        if (new Date(reservation.date_debut) - currentDate > 0) {
          slots.push({
            start: currentDate,
            end: new Date(reservation.date_debut),
          })
        }
        currentDate = new Date(reservation.date_fin)
      })

      if (
        currentDate !== new Date() ||
        (slots.length === 0 && data.machinerie_reservation.length === 0)
      ) {
        slots.push({
          start: currentDate,
          end: 'Indéfiniment',
        })
      }

      setAvailabilities(slots)
    }

    // vous pourriez gérer des erreurs ici si nécessaire, en utilisant la variable 'error'
  }, [data])

  //Affichage selon le type d'appareil.
  return (
    <div>
      <div>
        {/* DESIGN POUR MOBILE : DESIGN POUR TABLETTE ET ORDINATEUR */}
        <div className={isMobile ? 'columns-mobile' : 'columns-tablet-desktop'}>
          <div
            className={
              isMobile ? 'columns-mobile-size' : 'columns-tablet-desktop-size'
            }
          >
            <h1>Machinerie agricole</h1>
            <ShowMachinery functionButtons={groupButtons} />
          </div>
        </div>
      </div>
      {/* MODALE DES DISPONIBILITÉS */}
      <Modal
        title={`Disponibilités : ${
          selectedMachinery?.nom || 'Non sélectionné'
        }`}
        content={
          <>
            {isLoading ? (
              <div className="loader is-loading"></div>
            ) : (
              <AvailabilityTable availabilities={availabilities} />
            )}
          </>
        }
        isOpen={isModalAvailabilityOpen}
        onClose={() => {
          setModalAvailabilityOpen(false)
        }}
      />

      {/* MODALE DE RÉSERVATION */}
      <Modal
        title={`Réservation : ${selectedMachinery?.nom || 'Non sélectionné'}`}
        content={
          <FormAddReservation
            machinery={selectedMachinery}
            onClose={() => setModalReservationOpen(false)}
            availabilitiesIsLoading={isLoading}
            availabilities={availabilities}
          />
        }
        isOpen={isModalReservationOpen}
        onClose={() => {
          setModalReservationOpen(false)
        }}
      />
    </div>
  )
}

export default Inventory
