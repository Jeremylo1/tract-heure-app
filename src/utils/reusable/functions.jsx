//Retourne la date et l'heure locales au format ISO.
//Pour enregistrement dans la base de données.
function getLocalDateTime() {
  const now = new Date()
  const localISOString = new Date(
    now.getTime() - now.getTimezoneOffset() * 60000,
  ).toISOString()
  return localISOString.slice(0, -1)
}

export { getLocalDateTime }

//Permet de formater une date pour l'affichage.
//Par exemple: 2021-03-01T15:00:00.000Z => 1 mars 2021 11:00:00.
function formatDate(dateString) {
  const options = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    timeZone: 'America/Toronto',
  }
  return new Date(dateString).toLocaleString('fr-CA', options) //'fr-CA' pour le format français canadien.
}

export { formatDate }
