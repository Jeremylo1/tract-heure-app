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
              <th className="is-narrow"></th>
            </tr>
          </thead>
          <tbody>
            {availabilities.map((slot, index) => {
              let startTimeStr = slot.start.toLocaleString(undefined, {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
              })
              const currentTime = new Date().getTime()

              if (Math.abs(slot.start.getTime() - currentTime) <= 2000) {
                startTimeStr = 'Maintenant'
              }

              let endTimeStr =
                slot.end === 'Indéfiniment'
                  ? slot.end
                  : slot.end.toLocaleString(undefined, {
                      year: 'numeric',
                      month: '2-digit',
                      day: '2-digit',
                      hour: '2-digit',
                      minute: '2-digit',
                    })

              return (
                <tr key={index}>
                  <td>{startTimeStr}</td>
                  <td>{endTimeStr}</td>
                  <td>{/* Pour le bouton si nécessaire */}</td>
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
