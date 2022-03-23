import React from 'react'

import './style.css'

export class FlagsComponent extends React.Component {
  render(): React.ReactNode {
    // TODO: replace dummy StatusFlags
    const statusFlags = [
      { key: 'N', value: '0' },
      { key: 'Z', value: '0' },
      { key: 'C', value: '0' },
      { key: 'V', value: '0' }
    ]

    return (
      <div className="status-flags-container">
        <div>
          <div className="row justify-content-md-center">
            {statusFlags.map((r) => (
              <div key={'flag_' + r.key} className="col-md-auto">
                {r.key}
              </div>
            ))}
          </div>
          <div className="row justify-content-md-center">
            {statusFlags.map((r) => (
              <div key={'flagvalue_' + r.key} className="col-md-auto">
                {r.value}
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }
}
