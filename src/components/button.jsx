import React from 'react'
import { useNavigate } from 'react-router-dom'
import PropTypes from 'prop-types'
import styled from 'styled-components'

//Style du bouton.
const StyledButton = styled.button`
  background-color: ${(props) => props.color || 'red'};
  color: white;
  padding: 10px 20px;
  border: none;
  cursor: pointer;
`

//Bouton qui permet de naviguer vers une autre page.
function CustomButton({ to, color, children }) {
  //Permet de naviguer vers une autre page.
  const navigate = useNavigate()
  function handleClick() {
    navigate(to)
  }

  return (
    <StyledButton onClick={handleClick} aria-label={children}>
      {children}
    </StyledButton>
  )
}

//Définition des props du bouton.
CustomButton.propTypes = {
  to: PropTypes.string.isRequired,
  color: PropTypes.string,
  children: PropTypes.node.isRequired,
}

export default CustomButton
