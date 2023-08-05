import Accordion from '../components/accordion'

function Burger() {
  return (
    <div className="columns">
      <div className="column is-8 is-offset-2">
        <h1>Menu Burger - Brouillon Accordéon</h1>
        {/* Exemple d'accordéon à supprimer */}
        <Accordion
          title="Fleur"
          content="En biologie, chez toutes sortes de « plantes à fleur », la fleur
          constitue l'organe de la reproduction sexuée et l'ensemble des «
          enveloppes » qui l'entourent. Après la pollinisation, la fleur est
          fécondée et se transforme en fruit contenant les graines."
        />
        <Accordion
          title="Graine"
          content="Dans le cycle de vie des « plantes à graines », appelées
          spermatophytes, la graine est la structure qui contient et protège
          l'embryon végétal. Elle est souvent contenue dans un fruit qui permet
          sa dissémination."
        />
        <Accordion
          title="Fruit"
          content="Le fruit, en botanique, est l'organe végétal contenant une ou
          plusieurs graines. Caractéristique des Angiospermes, il succède à la
          fleur par transformation du pistil. La paroi de l'ovaire forme le
          péricarpe du fruit et l'ovule donne la graine."
        />
      </div>
    </div>
  )
}

export default Burger
