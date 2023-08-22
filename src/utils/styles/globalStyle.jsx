import { createGlobalStyle } from 'styled-components'

//On définit le style global des composants.
const StyledGlobalStyle = createGlobalStyle`
/* =============== TITRE H1 =============== */

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

/* =============== RESPONSIVE =============== */

/* MOBILE ET TABLETTE */
.columns-mobile {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.columns-mobile-size {
    width: 80%;
    margin: 0 auto;
}

/* ORDINATEUR */
.columns-tablet-desktop {
    justify-content: center;
}

.columns-tablet-desktop-size {
    width: 65%;
    margin: 0 auto;
}
`

function GlobalStyle() {
  return <StyledGlobalStyle />
}

export default GlobalStyle
