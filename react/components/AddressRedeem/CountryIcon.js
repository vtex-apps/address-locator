import React, { memo, useState } from 'react'
import getCountryDialCode from '../../utils/getCountryDialCode'

const CountryIcon = ({ size, country }) => {
  const [flagSource, setFlagSource] = useState(undefined)

  if (flagSource === undefined) {
    import(`svg-country-flags/png100px/${country.toLowerCase()}.png`)
      .then(src => setFlagSource(src.default))
      .catch(() => setFlagSource(null))
    return null
  }

  const dialCode = getCountryDialCode(country)
  return (
    <div className="flex items-center">
      {flagSource && (
        <img
          className="pr2"
          style={{ objectFit: 'contain' }}
          src={flagSource}
          width={size}
          height={size}
        />
      )}
      <p>{`+${dialCode}`}</p>
    </div>
  )
}

export default memo(CountryIcon)
