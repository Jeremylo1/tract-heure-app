import React, { useState, useEffect } from 'react'
import { useMutationHasura, useBreakdownStatus } from '../utils/react/hooks'
import { toISODateTime, formatInputDate } from '../utils/reusable/functions'
/*Composants*/
import CustomButton from '../components/button'
import ModalSuccess from '../components/message_success_modal'
/*Types*/
import PropTypes from 'prop-types'
/*Toast*/
import { toast } from 'react-toastify'
/*Base de données*/
import {
  LIEN_API,
  COLUMN_ID,
  COLUMN_NAME,
  COLUMN_STATUS_ID,
  COLUMN_DATE_BRIS,
  COLUMN_DESCRIPTION,
  COLUMN_DATE_REPARATION,
  COLUMN_REMARQUES,
  COLUMN_REPARATION_ESTIMEE,
  INSERT_BREAKDOWN,
  UPDATE_BREAKDOWN,
} from '../utils/database/query'
/*Style*/
import colors from '../utils/styles/color'
import 'bulma/css/bulma.min.css'
import styled from 'styled-components'

//Style des sections du formulaire.
const StyledPart = styled.div`
  margin-bottom: 15px;
`

/*NOTE : si il y a 'selectedMachinery', c'est une modification, sinon c'est un ajout.*/

//Formulaire d'ajout et de modification de machine.
function FormBreakdown({
  closeModal,
  selectedMachinery,
  selectBreakdown,
  userId,
}) {
  //Pour stocker les données du formulaire.
  const [idMachine, setIdMachine] = useState(
    selectedMachinery ? selectedMachinery[COLUMN_ID] : '',
  )
  const [selectedBreakdownId, setSelectedBreakdownId] = useState(
    selectBreakdown ? selectBreakdown[COLUMN_ID] : '',
  )
  const [selectedBreakdownStatusId, setSelectedBreakdownStatusId] = useState(
    selectBreakdown ? selectBreakdown[COLUMN_STATUS_ID] : 1,
  )
  const [selectedResponsableId, setSelectedResponsableId] = useState(
    userId ? userId : '',
  )
  const [selectedDateBreakdown, setDateBreakdown] = useState(
    selectBreakdown ? selectBreakdown[COLUMN_DATE_BRIS] : '',
  )
  const [selectedDescription, setDescription] = useState(
    selectBreakdown ? selectBreakdown[COLUMN_DESCRIPTION] : '',
  )
  const [selectedDateReparation, setDateReparation] = useState(
    selectBreakdown ? selectBreakdown[COLUMN_DATE_REPARATION] : '',
  )
  const [selectedReparationEstimee, setReparationEstimee] = useState(
    selectBreakdown ? selectBreakdown[COLUMN_REPARATION_ESTIMEE] : '',
  )
  const [selectedRemarques, setRemarques] = useState(
    selectBreakdown ? selectBreakdown[COLUMN_REMARQUES] : '',
  )

  //Erreurs dans les données du formulaire.
  const [errorName, setErrorName] = useState('')
  const [errorTime, setErrorTime] = useState('')
  const [errorPrice, setErrorPrice] = useState('')
  //Pour savoir si le bouton est cliqué.
  const [isClicked, setIsClicked] = useState(false)
  //Erreur et succès lors de l'enregistrement.
  const [errorMutation, setErrorMutation] = useState(false)
  const [successMutation, setSuccessMutation] = useState(false)
  //Pour savoir si on affiche le formulaire ou l'icône de succès.
  const [showForm, setShowForm] = useState(true)

  //Pour récupérer les catégories (pour le sélecteur).
  const { sortedBreakdownStatus, breakdownStatus_error } = useBreakdownStatus()
  //Permet d'envoyer une requête de mutation (INSERT, UPDATE) à Hasura.
  const { doMutation } = useMutationHasura(LIEN_API)

  /*FONCTION AGISSANT À L'ENVOI DU FORMULAIRE*/
  async function handleClickMachinery(e) {
    e.preventDefault()
    setIsClicked(true) //Si le bouton est cliqué.

    //Si erreur, ne pas exécuter la fonction.
    if (errorName || errorTime || errorPrice) {
      return
    }

    //Si erreur de base de données, ne pas exécuter la fonction.
    if (breakdownStatus_error) {
      return
    }

    //Ajout de la machine.
    await addEditBreakdown()
  }

  /*VÉRIFICATION DES CHAMPS DU FORMULAIRE*/
  useEffect(() => {
    //Vérification de la présence et de la validité du temps d'utilisation.
    if (!selectedBreakdownStatusId) {
      setErrorTime('Veuillez entrer un type de bris.')
    } else if (selectedBreakdownStatusId < 0 || selectedBreakdownStatusId > 4) {
      setErrorTime('Veuillez entrer un type de bris valide.')
    } else {
      setErrorTime('')
    }

    //Vérification du prix (s'il y en a un).
    if (!selectedDateBreakdown) {
      setErrorPrice('Veuillez entrer une date de bris.')
    } else {
      setErrorPrice('')
    }
  }, [selectedBreakdownStatusId, selectedDateBreakdown])

  /*VÉRIFICATION POUR LE TOAST D'ERREUR*/
  useEffect(() => {
    //Affichage d'un toast en cas d'erreur.
    if (breakdownStatus_error) {
      toast.error('Erreur lors de la récupération des catégories.')
    }
    if (errorMutation) {
      toast.error("Erreur lors de l'enregistrement du bris.")
      setErrorMutation(false) //Pour pouvoir afficher le toast à nouveau.
    }
  }, [breakdownStatus_error, errorMutation])

  /*AJOUT DU BRIS DANS LA BASE DE DONNÉES*/
  const addEditBreakdown = async () => {
    try {
      /*VARIABLES POUR LES REQUÊTES*/
      const variables = {
        //Obligatoire.
        id: idMachine,
        idBreakdown: selectedBreakdownId,
        responsableId: selectedResponsableId,
        statusId: selectedBreakdownStatusId,
        dateBreakdown: toISODateTime(selectedDateBreakdown, '00:00'), //Transformation en ISO.
        //Optionnel.
        description: selectedDescription ? selectedDescription : null,
        reparationEstimee: selectedReparationEstimee
          ? parseFloat(selectedReparationEstimee)
          : null, //Transformation en float.
        dateReparation: selectedDateReparation
          ? toISODateTime(selectedDateReparation, '00:00')
          : null, //Transformation en ISO.
        remarques: selectedRemarques ? selectedRemarques : null,
      }
      /*VERSION POUR MODIFICATION !!!!!!!!!!!!!!!!!!!!!!!*/
      if (selectBreakdown) {
        const resultMutation = await doMutation(UPDATE_BREAKDOWN, {
          id: selectBreakdown?.[COLUMN_ID],
          ...variables,
        })

        //Si la modification a fonctionné.
        if (resultMutation?.update_machinerie?.affected_rows > 0) {
          setSuccessMutation(true) //Pour toast + réinitialisation des variables.
        }

        /*VERSION POUR AJOUT*/
      } else {
        const resultMutation = await doMutation(INSERT_BREAKDOWN, {
          ...variables,
        })

        //Si l'ajout a fonctionné.
        if (resultMutation?.insert_machinerie_bris?.affected_rows > 0) {
          setSuccessMutation(true) //Pour toast + réinitialisation des variables.
        }
      }
      /*ERREUR*/
    } catch (err) {
      console.error(err)
      setErrorMutation(true) //Pour afficher un toast.
    }
  }

  /*TOAST DE SUCCÈS ET RÉINITIALISATION DES VARIABLES*/
  useEffect(() => {
    if (successMutation) {
      //Toast de succès selon l'action.
      if (selectBreakdown) {
        toast.success('Bris modifié.')
      } else {
        toast.success('Bris ajouté.')
      }

      //Réinitialisation des champs.
      setIdMachine('')
      setSelectedBreakdownId('')
      setSelectedBreakdownStatusId(1)
      setSelectedBreakdownStatusId(null)
      setSelectedResponsableId('')
      setDateBreakdown('')
      setDescription('')
      setDateReparation('')
      setReparationEstimee('')
      setRemarques('')

      //Réinitialisation des autres variables.
      setErrorName('')
      setErrorTime('')
      setErrorPrice('')
      setIsClicked(false)
      setErrorMutation(false)
      setSuccessMutation(false)

      //Affichage de l'icône de succès.
      setShowForm(false)

      //Fermeture de la modale + rafraîchissement après 3s.
      setTimeout(() => {
        closeModal()
        window.location.reload()
      }, 3000)
    }
  }, [successMutation, closeModal, selectBreakdown])

  //Vérification des types des variables.
  FormBreakdown.propTypes = {
    errorName: PropTypes.string,
    errorTime: PropTypes.string,
    errorPrice: PropTypes.string,
    isClicked: PropTypes.bool,
    errorMutation: PropTypes.bool,
    successMutation: PropTypes.bool,
  }

  /*COMPOSANT POUR LES CHAMPS DU FORMULAIRE*/
  function FormField({
    label,
    typeInput,
    placeholder,
    value,
    functionOnChange,
    error,
    hasStep, //Pour savoir si le champ a un step.
  }) {
    return (
      <div className="field">
        <label className="label">{label}</label>
        <div className="control">
          <input
            className={
              /*Si bouton cliqué + erreur -> cadre rouge.*/
              isClicked && error ? `input ${error && 'is-danger'}` : 'input'
            }
            type={typeInput}
            step={hasStep ? '0.1' : null} //Si le champ a un step, on l'ajoute.
            placeholder={placeholder}
            value={value ? value : ''}
            onChange={(e) => functionOnChange(e.target.value)}
          />
        </div>
        {isClicked && error ? (
          /*Si bouton cliqué + erreur -> message d'erreur.*/
          <p className="help is-danger">{error}</p>
        ) : null}
      </div>
    )
  }

  //Vérification des types des variables.
  FormField.propTypes = {
    label: PropTypes.string.isRequired,
    typeInput: PropTypes.string.isRequired,
    placeholder: PropTypes.string.isRequired,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    functionOnChange: PropTypes.func.isRequired,
    error: PropTypes.string,
    hasStep: PropTypes.bool,
  }

  /*AFFICHAGE DU FORMULAIRE*/
  return (
    <div>
      {showForm ? (
        /*Formulaire à remplir.*/
        <>
          <p>
            {selectBreakdown
              ? 'Vous pouvez modifier les informations ci-dessous.'
              : 'Veuillez remplir les informations ci-dessous.'}
          </p>
          <form onSubmit={handleClickMachinery}>
            {/*Statut*/}
            <StyledPart>
              <label className="label">Statut</label>
              <div className="select">
                <select
                  value={selectedBreakdownStatusId}
                  onChange={(e) =>
                    setSelectedBreakdownStatusId(parseInt(e.target.value))
                  }
                >
                  {sortedBreakdownStatus.map((statut) => (
                    <option
                      key={`${statut[COLUMN_NAME]}-${statut[COLUMN_ID]}`}
                      value={parseInt(statut[COLUMN_ID])}
                    >
                      {statut[COLUMN_NAME]}
                    </option>
                  ))}
                </select>
              </div>
            </StyledPart>
            {/*Date du bris*/}
            {FormField({
              label: 'Date du bris',
              typeInput: 'date',
              value: selectedDateBreakdown,
              functionOnChange: setDateBreakdown,
            })}

            {/*Commentaire*/}
            <StyledPart>
              <label className="label">Description</label>
              <div className="control">
                <textarea
                  className="textarea"
                  placeholder="Description du bris"
                  value={selectedDescription ? selectedDescription : ''}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
            </StyledPart>
            {/*Date réparation*/}
            {FormField({
              label: 'Date de réparation',
              typeInput: 'date',
              value: selectedDateReparation,
              functionOnChange: setDateReparation,
            })}
            {/*Prix de réparation estimé*/}
            {FormField({
              label: 'Estimation du prix de réparation',
              typeInput: 'number',
              placeholder: 'Entrez une estimation du prix de réparation (en $)',
              value: selectedReparationEstimee,
              functionOnChange: setReparationEstimee,
              error: errorPrice,
              hasStep: true, //Pour avoir un step de 0.1.
            })}
            {/*Numéro de série*/}
            {/*Commentaire*/}
            <StyledPart>
              <label className="label">Remarques</label>
              <div className="control">
                <textarea
                  className="textarea"
                  placeholder="Toutes remarques"
                  value={selectedRemarques ? selectedRemarques : ''}
                  onChange={(e) => setRemarques(e.target.value)}
                />
              </div>
            </StyledPart>
            {/*Bouton de confirmation*/}
            <div className="has-text-centered">
              <CustomButton
                type="submit"
                color={colors.greenButton}
                hovercolor={colors.greenButtonHover}
              >
                {selectBreakdown ? 'Modifier' : 'Ajouter'}
              </CustomButton>
            </div>
          </form>
        </>
      ) : (
        /*Icône de succès.*/
        <ModalSuccess />
      )}
    </div>
  )
}

//Vérification des types des props.
FormBreakdown.propTypes = {
  closeModal: PropTypes.func,
  selectedMachinery: PropTypes.object,
  selectBreakdown: PropTypes.object /*Pour la modification.*/,
}

export default FormBreakdown
