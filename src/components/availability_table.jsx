import React from 'react'

const AvailabilityTable = ({ availabilities }) => {
  return (
    <>
      {availabilities.length === 0 ? (
        <div>Aucune disponibilité</div>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>Heure de début</th>
              <th>Heure de fin</th>
              <th className="is-narrow"></th> {/* Pour le bouton */}
            </tr>
          </thead>
          <tbody>
            {availabilities.map((slot, index) => {
              let startTimeStr = slot.start.toLocaleString()
              const currentTime = new Date().getTime()

              if (Math.abs(slot.start.getTime() - currentTime) <= 2000) {
                startTimeStr = 'Maintenant'
              }

              let endTimeStr =
                slot.end === 'Indéfiniment'
                  ? slot.end
                  : slot.end.toLocaleString()

              return (
                <tr key={index}>
                  <td>{startTimeStr}</td>
                  <td>{endTimeStr}</td>
                  <td>
                    {/* Vous pouvez ajouter ici le bouton si nécessaire */}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      )}
    </>
  )
}

export default AvailabilityTable
