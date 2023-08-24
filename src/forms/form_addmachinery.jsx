import React, { useState, useEffect } from 'react'
import { useCategory, useStatus, useMutationHasura } from '../utils/react/hooks'
import { toISODateTime } from '../utils/reusable/functions'
import PropTypes from 'prop-types'
import CustomButton from '../components/button'
/*Base de données*/
import {
  LIEN_API,
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
  //Pour savoir si le bouton est cliqué.
  const [isClicked, setIsClicked] = useState(false)

  //Pour récupérer les catégories.
  const { sortedCategories, category_loading, category_error } = useCategory()
  //Pour récupérer les statuts.
  const { status, status_loading, status_error } = useStatus()
  //Permet d'envoyer une requête de mutation (INSERT, UPDATE) à Hasura.
  const { doMutation } = useMutationHasura(LIEN_API)

  /*VÉRIFICATION DU FORMULAIRE*/
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
      console.log('Résultat ajout', resultMutation) //DEBUG !

      //Si l'ajout a fonctionné.
      if (resultMutation) {
        alert('Machine ajoutée avec succès.')

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

        //Réinitialisation des erreurs.
        setErrorName('')
        setErrorTime('')
        setErrorPrice('')
      }
      //Si l'ajout n'a pas fonctionné.
    } catch (err) {
      console.error(err)
      alert("Une erreur s'est produite lors de l'enregistrement de la machine.")
    }
  }

  /*FONCTION AGISSANT À L'ENVOI DU FORMULAIRE*/
  async function handleClickMachinery(e) {
    e.preventDefault()
    setIsClicked(true) //Si le bouton est cliqué.

    console.log('errorName', errorName) //DEBUG !
    console.log('errorTime', errorTime) //DEBUG !
    console.log('errorPrice', errorPrice) //DEBUG !

    //Vérification des erreurs.
    if (errorName || errorTime || errorPrice) {
      return
    }

    console.log('ENFIN !') //DEBUG !

    //Ajout de la machine.
    await addMachinery()
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
      <p>
        Veuillez remplir les informations ci-dessous pour ajouter une machine.
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

/*À FAIRE :
- Notifications au-dessus du formulaire (pour les erreurs).
- Gestion d'erreurs (category_error, status_error) + loading.
- Fermeture de la modale après ajout.
- Rafraîchissement de la page.
- Modification d'une machine (template à réutiliser).*/
