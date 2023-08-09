import React from 'react'
import { useState } from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'

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

//Style du panneau de l'accordéon.
const StyledPanel = styled.div`
  padding: ${(props) => (props.open ? '18px' : '0')};
  background-color: white;
  max-height: ${(props) => (props.open ? '1000px' : '0')};
  overflow: hidden;
  transition: max-height;
`

//Style du wrapper de l'accordéon.
const StyledWrapper = styled.div`
  box-shadow: ${(props) =>
    props.open ? '0px 2px 4px rgba(0, 0, 0, 0.2)' : 'none'};
  margin-bottom: 6px;
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
    <StyledWrapper open={isOpen}>
      <StyledButton onClick={toggleAccordion}>
        {title}
        <StyledIcon open={isOpen} />
      </StyledButton>
      <StyledPanel open={isOpen}>
        <div>{content}</div>
        <div>{others}</div>
      </StyledPanel>
    </StyledWrapper>
  )
}

//Définition des props de l'accordéon.
Accordion.propTypes = {
  title: PropTypes.string.isRequired,
  content: PropTypes.node.isRequired,
  others: PropTypes.node,
}

export default Accordion
