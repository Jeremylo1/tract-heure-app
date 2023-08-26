import React, { useState, useEffect } from 'react'
import { useCategory, useStatus, useMutationHasura } from '../utils/react/hooks'
import { toISODateTime } from '../utils/reusable/functions'
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
  INSERT_MACHINERY,
  UPDATE_MACHINERY,
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
function FormMachinery({ closeModal, selectedMachinery }) {
  //Pour stocker les données du formulaire.
  const [nameMachine, setNameMachine] = useState('')
  const [selectedCategoryId, setSelectedCategoryId] = useState(1)
  const [selectedStatusId, setSelectedStatusId] = useState(1)
  const [modelMachine, setModelMachine] = useState('')
  const [serialNumber, setSerialNumber] = useState('')
  const [barcode, setBarcode] = useState('')
  const [totalTime, setTotalTime] = useState('')
  const [price, setPrice] = useState('')
  const [dateAcquisition, setDateAcquisition] = useState('')
  const [comment, setComment] = useState('')
  const [location, setLocation] = useState('')
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
  const { sortedCategories, category_error } = useCategory()
  //Pour récupérer les statuts (pour le sélecteur).
  const { status, status_error } = useStatus()
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
    if (category_error || status_error) {
      return
    }

    //Ajout de la machine.
    await addMachinery()
  }

  /*VÉRIFICATION DES CHAMPS DU FORMULAIRE*/
  useEffect(() => {
    //Vérification de la présence d'un nom.
    if (!nameMachine) {
      setErrorName('Veuillez entrer le nom de la machine.')
    } else {
      setErrorName('')
    }

    //Vérification de la présence et de la validité du temps d'utilisation.
    if (!totalTime) {
      setErrorTime("Veuillez entrer le nombre d'heures d'utilisation.")
    } else if (totalTime < 0 || isNaN(parseInt(totalTime))) {
      setErrorTime("Veuillez entrer un nombre d'heures valide.")
    } else {
      setErrorTime('')
    }

    //Vérification du prix (s'il y en a un).
    if (price) {
      //Vérification si négatif ou non numérique.
      if (price < 0 || isNaN(parseFloat(price))) {
        setErrorPrice("Veuillez entrer un prix d'achat valide ou rien.")
      }
    } else {
      setErrorPrice('')
    }
  }, [nameMachine, totalTime, price])

  /*VÉRIFICATION POUR LE TOAST D'ERREUR*/
  useEffect(() => {
    //Affichage d'un toast en cas d'erreur.
    if (category_error) {
      toast.error('Erreur lors de la récupération des catégories.')
    }
    if (status_error) {
      toast.error('Erreur lors de la récupération des statuts.')
    }
    if (errorMutation) {
      toast.error("Erreur lors de l'enregistrement de la machine.")
      setErrorMutation(false) //Pour pouvoir afficher le toast à nouveau.
    }
  }, [category_error, status_error, errorMutation])

  /*AJOUT DE LA MACHINE DANS LA BASE DE DONNÉES*/
  const addMachinery = async () => {
    try {
      const resultMutation = await doMutation(INSERT_MACHINERY, {
        //Obligatoire.
        name: nameMachine,
        categoryId: selectedCategoryId,
        statusId: selectedStatusId,
        totalTime: parseInt(totalTime), //Transformation en int.
        //Optionnel.
        model: modelMachine ? modelMachine : null,
        serialNumber: serialNumber ? serialNumber : null,
        barcode: barcode ? barcode : null,
        price: price ? parseFloat(price) : null, //Transformation en float.
        dateAcquisition: dateAcquisition
          ? toISODateTime(dateAcquisition, '00:00')
          : null,
        comment: comment ? comment : null,
        location: location ? location : null,
      })

      //Si l'ajout a fonctionné.
      if (resultMutation?.insert_machinerie?.affected_rows > 0) {
        setSuccessMutation(true) //Pour toast + réinitialisation des variables.
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
      //Toast de succès.
      toast.success('Machine ajoutée.')

      //Réinitialisation des champs.
      setNameMachine('')
      setSelectedCategoryId(1)
      setSelectedStatusId(1)
      setModelMachine('')
      setSerialNumber('')
      setBarcode('')
      setTotalTime('')
      setPrice('')
      setDateAcquisition('')
      setComment('')
      setLocation('')

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
  }, [successMutation, closeModal])

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
            value={value}
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

  //Vérification des types.
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
            Veuillez remplir les informations ci-dessous pour ajouter une
            machine.
          </p>
          <form onSubmit={handleClickMachinery}>
            {/*Nom*/}
            {FormField({
              label: 'Nom',
              typeInput: 'text',
              placeholder: 'Entrez le nom de la machine',
              value: nameMachine,
              functionOnChange: setNameMachine,
              error: errorName,
            })}
            {/*Catégorie*/}
            <StyledPart>
              <label className="label">Catégorie</label>
              <div className="select">
                <select
                  value={selectedCategoryId}
                  onChange={(e) =>
                    setSelectedCategoryId(parseInt(e.target.value))
                  }
                >
                  {sortedCategories.map((category) => (
                    <option
                      key={`${category[COLUMN_NAME]}-${category[COLUMN_ID]}`}
                      value={parseInt(category[COLUMN_ID])}
                    >
                      {category[COLUMN_NAME]}
                    </option>
                  ))}
                </select>
              </div>
            </StyledPart>
            {/*Statut*/}
            <StyledPart>
              <label className="label">Statut</label>
              <div className="select">
                <select
                  value={selectedStatusId}
                  onChange={(e) =>
                    setSelectedStatusId(parseInt(e.target.value))
                  }
                >
                  {status.map((status) => (
                    <option
                      key={`${status[COLUMN_NAME]}-${status[COLUMN_ID]}`}
                      value={parseInt(status[COLUMN_ID])}
                    >
                      {status[COLUMN_NAME]}
                    </option>
                  ))}
                </select>
              </div>
            </StyledPart>
            {/*Modèle*/}
            {FormField({
              label: 'Modèle',
              typeInput: 'text',
              placeholder: 'Entrez le modèle de la machine',
              value: modelMachine,
              functionOnChange: setModelMachine,
            })}
            {/*Numéro de série*/}
            {FormField({
              label: 'Numéro de série',
              typeInput: 'text',
              placeholder: 'Entrez le numéro de série',
              value: serialNumber,
              functionOnChange: setSerialNumber,
            })}
            {/*Code-barres*/}
            {FormField({
              label: 'Code-barres',
              typeInput: 'text',
              placeholder: 'Entrez le code-barres de la machine',
              value: barcode,
              functionOnChange: setBarcode,
            })}
            {/*Temps d'utilisation total*/}
            {FormField({
              label: "Temps d'utilisation total",
              typeInput: 'number',
              placeholder: "Entrez le nombre d'heures d'utilisation",
              value: totalTime,
              functionOnChange: setTotalTime,
              error: errorTime,
            })}
            {/*Prix d'achat*/}
            {FormField({
              label: "Prix d'achat",
              typeInput: 'number',
              placeholder: "Entrez le prix d'achat (en $)",
              value: price,
              functionOnChange: setPrice,
              error: errorPrice,
              hasStep: true, //Pour avoir un step de 0.1.
            })}
            {/*Date d'acquisition*/}
            {FormField({
              label: "Date d'acquisition",
              typeInput: 'date',
              value: dateAcquisition,
              functionOnChange: setDateAcquisition,
            })}
            {/*Commentaire*/}
            <StyledPart>
              <label className="label">Commentaire</label>
              <div className="control">
                <textarea
                  className="textarea"
                  placeholder="Commentaire à propos de la machine"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
              </div>
            </StyledPart>
            {/*Localisation*/}
            {FormField({
              label: 'Localisation',
              typeInput: 'text',
              placeholder: 'Adresse, lieu, etc.',
              value: location,
              functionOnChange: setLocation,
            })}
            {/*Bouton d'ajout*/}
            <div className="has-text-centered">
              <CustomButton
                type="submit"
                color={colors.greenButton}
                hovercolor={colors.greenButtonHover}
              >
                Ajouter
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
FormMachinery.propTypes = {
  closeModal: PropTypes.func,
  selectedMachinery: PropTypes.object /*Pour la modification.*/,
}

export default FormMachinery

/*À FAIRE :
- Fermeture de la modale après ajout.
- Rafraîchissement de la page.
- Modification d'une machine (template à réutiliser).*/
