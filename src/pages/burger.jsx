import React from 'react'
import { useConnexion } from '../utils/react/hooks'
/*Style*/
import styled from 'styled-components'

//Style du wrapper.
const StyledWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin: 20px;
`

function Burger() {
  //Pour savoir si l'utilisateur est connecté.
  const { isConnected, handleLogout } = useConnexion()

  return isConnected ? (
    /*Si l'utilisateur est connecté, alors déconnexion.*/
    <StyledWrapper>
      <button onClick={handleLogout} className="button is-info">
        <strong>Déconnexion</strong>
      </button>
    </StyledWrapper>
  ) : null
}

export default Burger
