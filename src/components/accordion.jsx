import styled from 'styled-components'

//Style de l'accordéon.
const StyledAccordion = styled.div`
  background-color: #eee;
  color: #444;
  cursor: pointer;
  padding: 18px;
  width: 100%;
  border: none;
  text-align: left;
  outline: none;
  font-size: 15px;
  transition: 0.4s;
  &:hover {
    background-color: #ccc;
  }
  &:after {
    content: '\002B';
  color: #777;
  font-weight: bold;
  float: right;
  margin-left: 5px;
  }
`

function Accordion() {
  return (
    <div>
      <button className="accordion">Fleur</button>
      <div className="panel">
        <p>
          En biologie, chez toutes sortes de « plantes à fleur », la fleur
          constitue l'organe de la reproduction sexuée et l'ensemble des «
          enveloppes » qui l'entourent. Après la pollinisation, la fleur est
          fécondée et se transforme en fruit contenant les graines.
        </p>
      </div>

      <button className="accordion">Graine</button>
      <div className="panel">
        <p>
          Dans le cycle de vie des « plantes à graines », appelées
          spermatophytes, la graine est la structure qui contient et protège
          l'embryon végétal. Elle est souvent contenue dans un fruit qui permet
          sa dissémination.
        </p>
      </div>

      <button className="accordion">Fruit</button>
      <div className="panel">
        <p>
          Le fruit, en botanique, est l'organe végétal contenant une ou
          plusieurs graines. Caractéristique des Angiospermes, il succède à la
          fleur par transformation du pistil. La paroi de l'ovaire forme le
          péricarpe du fruit et l'ovule donne la graine.
        </p>
      </div>
    </div>
  )
}

export default Accordion
