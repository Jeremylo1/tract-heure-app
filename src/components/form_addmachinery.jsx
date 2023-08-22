import React, { useState } from 'react'
import { useCategory, useStatus } from '../utils/react/hooks'
import PropTypes from 'prop-types'
import CustomButton from './button'
/*Base de données*/
import { COLUMN_ID, COLUMN_NAME } from '../utils/database/query'
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
  const [errorName, setErrorName] = useState('')
  //const [errorName, setErrorName] = useState('')
  //Pour stocker les données du formulaire.
  const [nameMachine, setNameMachine] = useState('')
  const [selectedCategoryId, setSelectedCategoryId] = useState(0)
  const [selectedStatusId, setSelectedStatusId] = useState(0)
  const [modelMachine, setModelMachine] = useState('')
  const [serialNumber, setSerialNumber] = useState('')
  const [barcode, setBarcode] = useState('')
  const [totalTime, setTotalTime] = useState()
  const [price, setPrice] = useState()
  const [comment, setComment] = useState('')
  const [location, setLocation] = useState('')

  //Pour récupérer les catégories.
  const { sortedCategories, category_loading, category_error } = useCategory()
  //Pour récupérer les statuts.
  const { status, status_loading, status_error } = useStatus()

  //Pour ajouter une machine.
  async function handleAddition(e) {
    e.preventDefault()
    //Vérification des champs.
    if (!nameMachine) {
      setErrorName('Veuillez entrer le nom de la machine.')
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
  function TextField({
    label,
    typeInput,
    placeholder,
    value,
    functionOnChange,
  }) {
    return (
      <div className="field">
        <label className="label">{label}</label>
        <div className="control">
          <input
            className="input"
            type={typeInput}
            placeholder={placeholder}
            value={value}
            onChange={(e) => functionOnChange(e.target.value)}
          />
        </div>
      </div>
    )
  }

  //Vérification des types.
  TextField.propTypes = {
    label: PropTypes.string.isRequired,
    typeInput: PropTypes.string.isRequired,
    placeholder: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    functionOnChange: PropTypes.func.isRequired,
  }

  //Affichage du formulaire.
  return (
    <div>
      <p>
        Veuillez remplir les informations ci-dessous pour ajouter une machine.
      </p>
      <form onSubmit={handleAddition}>
        {/*Nom*/}
        <div className="field">
          <label className="label">Nom</label>
          <div className="control">
            <input
              className={`input ${errorName && 'is-danger'}`}
              type="text"
              placeholder="Entrez le nom de la machine"
              value={nameMachine}
              onChange={(e) => setNameMachine(e.target.value)}
              required
            />
          </div>
          {errorName && <p className="help is-danger">{errorName}</p>}
        </div>
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
        {TextField({
          label: 'Modèle',
          typeInput: 'text',
          placeholder: 'Modèle de la machine',
          value: modelMachine,
          functionOnChange: setModelMachine,
        })}
        {/*Numéro de série*/}
        {TextField({
          label: 'Numéro de série',
          typeInput: 'text',
          placeholder: 'Numéro de série de la machine',
          value: serialNumber,
          functionOnChange: setSerialNumber,
        })}
        {/*Code-barres*/}
        {TextField({
          label: 'Code-barres',
          typeInput: 'text',
          placeholder: 'Code-barres de la machine',
          value: barcode,
          functionOnChange: setBarcode,
        })}
        {/*Temps d'utilisation total*/}
        {/*Prix d'achat*/}
        {TextField({
          label: "Prix d'achat",
          typeInput: 'number',
          placeholder: "Prix d'achat de la machine",
          value: price,
          functionOnChange: setPrice,
        })}
        {/*Date d'acquisition*/}
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
        {TextField({
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
