import React from 'react'
import { useNavigate } from 'react-router-dom'
import PropTypes from 'prop-types'
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

//Bouton qui permet de naviguer vers une autre page.
function CustomButton({ to, color, hovercolor, children }) {
  //Permet de naviguer vers une autre page (s'il y a une prop "to").
  const navigate = useNavigate()
  function handleClick() {
    if (to) {
      navigate(to)
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
  color: PropTypes.string,
  children: PropTypes.node.isRequired,
}

export default CustomButton
