import { createGlobalStyle } from 'styled-components'

//On définit le style global des composants.
const StyledGlobalStyle = createGlobalStyle`
.content h1 {
    font-size: 2em;
    margin-top: 1em;
    margin-bottom: 1em;
}

@media only screen and (max-width: 767px) {

    .content h1 {
        font-size: 1.25em;
        text-align: center;
        margin-top: 1em;
        margin-bottom: 1em;
    }
}
`

function GlobalStyle() {
  return <StyledGlobalStyle />
}

export default GlobalStyle
