import React from 'react'
import { useState } from 'react'
import styled from 'styled-components'

//Style du bouton de l'accordéon.
const StyledButton = styled.button`
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
`

//Style de l'icône du bouton de l'accordéon.
const StyledIcon = styled.span`
  &::before {
    content: ${(props) => (props.open ? '"\\2212"' : '"\\002B"')};
    color: #777;
    font-weight: bold;
    float: right;
    margin-left: 5px;
  }
`

//Style du panneau.
const StyledPanel = styled.div`
  padding: ${(props) => (props.open ? '18px' : '0')};
  background-color: white;
  max-height: ${(props) => (props.open ? '1000px' : '0')};
  overflow: hidden;
  transition: max-height;
`

//Composant de l'accordéon.
function Accordion({ title, content, others }) {
  //Pour savoir si le panneau est ouvert ou non.
  const [isOpen, setIsOpen] = useState(false)
  //Pour ouvrir ou fermer le panneau.
  const toggleAccordion = () => {
    setIsOpen(!isOpen)
  }

  return (
    <div>
      <StyledButton onClick={toggleAccordion}>
        {title}
        <StyledIcon open={isOpen} />
      </StyledButton>
      <StyledPanel open={isOpen}>
        <div>{content}</div>
        <div>{others}</div>
      </StyledPanel>
    </div>
  )
}

export default Accordion
