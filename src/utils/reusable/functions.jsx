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

//Permet de formater une date et de l'afficher en format court.
//Par exemple: 2021-03-01T15:00:00.000Z => lun. 1 mars 2021.
function formatShortDate(dateString) {
  return dateString.toLocaleDateString('fr-FR', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export { formatShortDate }

//Permet de formater une date et de l'afficher en format simple.
//Par exemple: 2021-03-01T15:00:00.000Z => yyyy-mm-dd.
function formatInputDate(dateString) {
  const date = new Date(dateString)
  let month = '' + (date.getMonth() + 1)
  let day = '' + date.getDate()
  const year = date.getFullYear()

  if (month.length < 2) month = '0' + month
  if (day.length < 2) day = '0' + day

  return [year, month, day].join('-')
}

export { formatInputDate }

//Permet de formater une heure et de l'afficher.
//Par exemple: 2021-03-01T15:00:00.000Z => 11:00.
function formatTime(dateString) {
  return dateString.toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

export { formatTime }

//Permet de transformer une date + heure au format ISO.
//Par exemple: 2023-08-03 16:05 => 2023-08-03T16:05:00.000Z.
function toISODateTime(dateString, timeString) {
  const date = new Date(dateString + ' ' + timeString)
  const isoDateTime = date.toISOString()
  console.log(isoDateTime)
  console.log(isoDateTime.slice(0, -1))
  return isoDateTime.slice(0, -1)
}

export { toISODateTime }
