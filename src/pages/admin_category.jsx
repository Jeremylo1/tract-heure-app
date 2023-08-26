import React, { useContext, useState } from 'react'
import { useCategory } from '../utils/react/hooks'
import { ScreenContext } from '../utils/react/context'
/*Composants*/
import CustomButton from '../components/button'
import AddButton from '../components/addbutton'
import Modal from '../components/modal'
/*Formulaire*/
import FormCategory from '../forms/form_category'
import FormDelCategory from '../forms/form_delcategory'
/*Base de données*/
import { COLUMN_ID, COLUMN_NAME } from '../utils/database/query'
/*Style*/
import colors from '../utils/styles/color'
import '../styles/admin_category.css'
/*Importation des icônes*/
import Icon from '@mdi/react'
import { mdiTrashCanOutline } from '@mdi/js'
import { mdiPencilOutline } from '@mdi/js'

//Page de gestion des catégories.
function AdminCategory() {
  //Titre de la page.
  document.title = 'Tableau de bord'

  //Hook pour la gestion des catégories.
  const [selectedCategory, setSelectedCategory] = useState(null)
  //Hook pour la gestion de la modale d'ajout.
  const [isAddModalOpen, setAddModalOpen] = useState(false)
  //Hook pour la gestion de la modale de modification.
  const [isEditModalOpen, setEditModalOpen] = useState(false)
  //Hook pour la gestion de la modale de suppression.
  const [isDelModalOpen, setDelModalOpen] = useState(false)

  //Pour savoir si c'est un appareil mobile.
  const { isMobile } = useContext(ScreenContext)
  //Pour récupérer les catégories.
  const { sortedCategories, category_loading, category_error } = useCategory()

  /*AFFICHAGE*/
  //Permet de créer le tableau des catégories.
  function tableCategory() {
    return (
      <div>
        {category_loading ? (
          <div className="loader is-loading"></div>
        ) : category_error ? (
          <div>Erreur lors du chargement des catégories !</div>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Noms</th>
                <th className="is-narrow"></th>
                {/* Pour les boutons */}
              </tr>
            </thead>
            <tbody>
              {sortedCategories.map((category) => (
                <tr key={`${category[COLUMN_NAME]}-${category[COLUMN_ID]}`}>
                  <td>{category[COLUMN_NAME]}</td>
                  <td className="actions-buttons">
                    <CustomButton
                      color={colors.redButton}
                      hovercolor={colors.redButtonHover}
                      functionclick={() => {
                        setDelModalOpen(true) /*Pour la modale de suppression.*/
                        setSelectedCategory(category)
                      }}
                    >
                      {isMobile ? (
                        <Icon
                          path={mdiTrashCanOutline}
                          size={1}
                          color="white"
                        />
                      ) : (
                        'Supprimer'
                      )}
                    </CustomButton>
                    <CustomButton
                      color={colors.greenButton}
                      hovercolor={colors.greenButtonHover}
                      functionclick={() => {
                        setEditModalOpen(
                          true,
                        ) /*Pour la modale de modification.*/
                        setSelectedCategory(category)
                      }}
                    >
                      {isMobile ? (
                        <Icon path={mdiPencilOutline} size={1} color="white" />
                      ) : (
                        'Modifier'
                      )}
                    </CustomButton>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    )
  }

  //Affichage selon le type d'appareil.
  return (
    <div>
      {/* DESIGN POUR MOBILE : DESIGN POUR TABLETTE ET ORDINATEUR */}
      <div className={isMobile ? 'columns-mobile' : 'columns-tablet-desktop'}>
        <div
          className={
            isMobile ? 'columns-mobile-size' : 'columns-tablet-desktop-size'
          }
        >
          <h1>Gestion des catégories</h1>
          <AddButton
            onClick={() => {
              setAddModalOpen(true)
            }}
          />
          <div>{tableCategory()}</div>
        </div>
      </div>
      {/* MODALE POUR AJOUTER UNE CATÉGORIE */}
      <Modal
        title={'Ajouter une catégorie'}
        content={
          <FormCategory
            closeModal={() => {
              setAddModalOpen(false) //Fermeture de la modale.
              window.location.reload() //Rafraîchissement de la page.
            }}
          />
        }
        isOpen={isAddModalOpen}
        onClose={() => {
          setAddModalOpen(false)
        }}
      />
      {/* MODALE POUR MODIFIER UNE CATÉGORIE */}
      <Modal
        title={'Modifier une catégorie'}
        content={
          <FormCategory
            closeModal={() => {
              setEditModalOpen(false) //Fermeture de la modale.
            }}
            selectedCategory={selectedCategory}
          />
        }
        isOpen={isEditModalOpen}
        onClose={() => {
          setEditModalOpen(false)
        }}
      />
      {/* MODALE POUR SUPPRIMER UNE CATÉGORIE */}
      <Modal
        title={'Supprimer une catégorie'}
        content={
          <FormDelCategory
            closeModal={() => {
              setDelModalOpen(false) //Fermeture de la modale.
            }}
            selectedCategory={selectedCategory}
          />
        }
        isOpen={isDelModalOpen}
        onClose={() => {
          setDelModalOpen(false)
        }}
      />
    </div>
  )
}

export default AdminCategory
