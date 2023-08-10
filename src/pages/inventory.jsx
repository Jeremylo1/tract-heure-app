import React from 'react'
import { useState } from 'react'
import Modal from '../components/modal'
import CustomButton from '../components/button'
import StyledTitlePage from '../utils/styles/atoms'
import colors from '../utils/styles/color'
import ShowMachinery from '../components/showmachinery'
import '../styles/inventory.css'

function Inventory() {
  //Hook pour la gestion de la modale.
  const [isModalOpen, setModalOpen] = useState(false)

  //Affichage des boutons du bas de l'accordéon.
  function groupButtons() {
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
            functionclick={() => setModalOpen(true)}
            color={colors.greenButton}
            hovercolor={colors.greenButtonHover}
          >
            Réserver
          </CustomButton>
        </p>
      </div>
    )
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
        title="Titre de la Modal"
        content={
          <div>
            Contenu de la modal. Vous pouvez mettre ici du texte, des images,
            des composants, etc.
          </div>
        }
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
      />
    </div>
  )
}

export default Inventory
