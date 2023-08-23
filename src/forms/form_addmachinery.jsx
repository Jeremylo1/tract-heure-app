import React, { useState } from 'react'
import { useCategory, useStatus } from '../utils/react/hooks'
import PropTypes from 'prop-types'
import CustomButton from '../components/button'
/*Base de données*/
import {
  COLUMN_ID,
  COLUMN_NAME,
  INSERT_MACHINERY,
} from '../utils/database/query'
/*Style*/
import colors from '../utils/styles/color'
import 'bulma/css/bulma.min.css'
import styled from 'styled-components'

//Style des sections du formulaire.
const StyledPart = styled.div`
  margin-bottom: 15px;
`

//Formulaire d'ajout d'une machine.
function FormAddMachinery() {
  //Erreurs possibles.
  const [errorName, setErrorName] = useState('')
  const [errorTime, setErrorTime] = useState('')
  const [errorPrice, setErrorPrice] = useState('')
  //Pour stocker les données du formulaire.
  const [nameMachine, setNameMachine] = useState('')
  const [selectedCategoryId, setSelectedCategoryId] = useState(0)
  const [selectedStatusId, setSelectedStatusId] = useState(0)
  const [modelMachine, setModelMachine] = useState('')
  const [serialNumber, setSerialNumber] = useState('')
  const [barcode, setBarcode] = useState('')
  const [totalTime, setTotalTime] = useState()
  const [price, setPrice] = useState()
  const [dateAcquisition, setDateAcquisition] = useState('')
  const [comment, setComment] = useState('')
  const [location, setLocation] = useState('')

  //Pour récupérer les catégories.
  const { sortedCategories, category_loading, category_error } = useCategory()
  //Pour récupérer les statuts.
  const { status, status_loading, status_error } = useStatus()

  //Pour ajouter une machine.
  async function handleAdditionMachinery(e) {
    e.preventDefault()

    //Vérification des champs.
    if (!nameMachine) {
      setErrorName('Veuillez entrer le nom de la machine.')
    } else {
      setErrorName('')
    }

    if (!totalTime) {
      setErrorTime("Veuillez entrer le nombre d'heures d'utilisation.")
    } else {
      setErrorTime('')
    }

    //S'il y a un prix.
    if (price) {
      //Si le prix est négatif ou non numérique.
      if (price < 0 || isNaN(parseFloat(price))) {
        setErrorPrice("Veuillez entrer un prix d'achat valide ou rien.")
      }
    } else {
      setErrorPrice('')
    }

    //Vérification des erreurs.
    if (!nameMachine || !totalTime || !price) {
      return
    }

    //Ajout de la machine.
    // const { data, error } = await addMachinery({
    //   name: nameMachine,
    //   categoryId: selectedCategoryId,
    //   statusId: selectedStatusId,
    //   model: modelMachine,
    //   serialNumber: serialNumber,
    //   comment: comment,
    // })
    // if (error) {
    //   setError(error.message)
    //   return
    // }
    // if (data) {
    //   //Réinitialisation des champs.
    //   setNameMachine('')
    //   setSelectedCategoryId(0)
    //   setSelectedStatusId(0)
    //   setModelMachine('')
    //   setSerialNumber('')
    //   setComment('')
    // }
  }

  /*AFFICHAGE*/
  //Template d'un champ du formulaire.
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
            className={error ? `input ${error && 'is-danger'}` : 'input'} //Si erreur possible, ajout de la classe 'is-danger'.
            type={typeInput}
            step={hasStep ? '0.1' : null} //Si le champ a un step, on l'ajoute.
            placeholder={placeholder}
            value={value}
            onChange={(e) => functionOnChange(e.target.value)}
          />
        </div>
        {/*Si erreur possible, affichage du message d'erreur.*/}
        {error ? <p className="help is-danger">{error}</p> : null}
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

  //Affichage du formulaire.
  return (
    <div>
      <p>
        Veuillez remplir les informations ci-dessous pour ajouter une machine.
      </p>
      <form onSubmit={handleAdditionMachinery}>
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
              onChange={(e) => setSelectedCategoryId(parseInt(e.target.value))}
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
              onChange={(e) => setSelectedStatusId(parseInt(e.target.value))}
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
    </div>
  )
}

export default FormAddMachinery
