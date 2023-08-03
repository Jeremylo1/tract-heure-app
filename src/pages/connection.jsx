import React from 'react'
import { useState, useEffect } from 'react'

function Connection() {
  // Page de connexion avec un champ nom d'utilisateur et un champ mot de passe

  return (
    <div>
      <h1>Page de connexion</h1>
      <form>
        <label>
          Nom d'utilisateur :
          <input type="text" name="username" />
        </label>
        <label>
          Mot de passe :
          <input type="password" name="password" />
        </label>
        <input type="submit" value="Se connecter" />
      </form>
    </div>
  )
}

export default Connection
