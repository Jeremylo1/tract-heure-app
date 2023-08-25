import React from 'react'
import { useNavigate } from 'react-router-dom'
/*Types*/
import PropTypes from 'prop-types'
/*Style*/
import styled from 'styled-components'
import 'bulma/css/bulma.min.css'

//Style du bouton.
const StyledButton = styled.button`
  background-color: ${(props) => props.color};
  color: white;
  &:hover {
    background-color: ${(props) => props.hovercolor};
    color: white;
  }
`

//Bouton personnalisé pour naviguer vers une autre page ou exécuter une fonction.
function CustomButton({ to, functionclick, color, hovercolor, children }) {
  const navigate = useNavigate()
  function handleClick() {
    //Si la prop "to" est définie, naviguer vers la page correspondante.
    if (to) {
      navigate(to)
      //Si la prop "functionclick" est définie, exécuter la fonction correspondante.
    } else if (typeof functionclick === 'function') {
      functionclick()
    }
  }

  return (
    <StyledButton
      className="button"
      onClick={handleClick}
      color={color}
      hovercolor={hovercolor}
      aria-label={children}
    >
      {children}
    </StyledButton>
  )
}

//Définition des props du bouton.
CustomButton.propTypes = {
  to: PropTypes.string,
  functionclick: PropTypes.func,
  color: PropTypes.string,
  children: PropTypes.node.isRequired,
}

export default CustomButton
