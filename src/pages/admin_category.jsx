import React, { useContext, useEffect, useState } from 'react'
import { useFetchHasura } from '../utils/react/hooks'
import { ScreenContext } from '../utils/react/context'
import CustomButton from '../components/button'
import AddButton from '../components/addbutton'
import Modal from '../components/modal'
import FormAddCategory from '../components/form_addmachinery'
/*Base de données*/
import {
  LIEN_API,
  TABLE_CATEGORY,
  COLUMN_ID,
  COLUMN_NAME,
} from '../utils/database/query'
/*Style*/
import colors from '../utils/styles/color'
import '../styles/admin_category.css'
/*Importation des icônes*/
import Icon from '@mdi/react'
import { mdiTrashCanOutline } from '@mdi/js'
import { mdiPencilOutline } from '@mdi/js'

//Page de gestion des catégories.
function AdminCategory() {
  //Pour savoir si c'est la première fois qu'on charge les données.
  const [firstLoading, setFirstLoading] = useState(true)
  //Pour stocker les catégories triées.
  const [sortedCategories, setSortedCategories] = useState([])
  //Hook pour la gestion des catégories.
  const [selectedCategory, setSelectedCategory] = useState(null)
  //Hook pour la gestion de la modale.
  const [isModalOpen, setModalOpen] = useState(false)

  //Pour savoir si c'est un appareil mobile.
  const { isMobile } = useContext(ScreenContext)

  //Permet de récupérer la liste des catégories depuis Hasura.
  const {
    data: category_data,
    isLoading: category_loading,
    error: category_error,
  } = useFetchHasura(
    LIEN_API,
    `{${TABLE_CATEGORY}{${COLUMN_ID} ${COLUMN_NAME}}}`,
    firstLoading,
  )

  //Permet de définir si c'est la première fois qu'on charge la page.
  useEffect(() => {
    setFirstLoading(false)
  }, [])

  //Permet de trier les catégories par ordre alphabétique.
  useEffect(() => {
    if (category_data && category_data[TABLE_CATEGORY]) {
      const sorted = category_data[TABLE_CATEGORY].slice().sort((a, b) =>
        a[COLUMN_NAME].localeCompare(b[COLUMN_NAME]),
      )
      //On stocke les catégories triées.
      setSortedCategories(sorted)
    }
  }, [category_data])

  /*AFFICHAGE*/
  //Permet de créer le tableau des catégories.
  function tableCategory() {
    return (
      <div>
        {category_loading ? (
          <div>Chargement des catégories ...</div>
        ) : category_error ? (
          <div>Erreur lors du chargement des catégories !</div>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Noms</th>
                <th className="is-narrow"></th> {/* Pour les boutons */}
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
              setModalOpen(true)
            }}
          />
          <div>{tableCategory()}</div>
        </div>
      </div>

      {/* MODALE POUR AJOUTER UNE MACHINE */}
      <Modal
        title={
          <>
            <h2>Ajouter une catégorie</h2>
          </>
        }
        content={
          <>
            <FormAddCategory />
          </>
        }
        isOpen={isModalOpen}
        onClose={() => {
          setModalOpen(false)
        }}
      />
    </div>
  )
}

export default AdminCategory
