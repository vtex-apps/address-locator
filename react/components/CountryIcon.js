import React, { memo } from 'react'
import getCountryDialCode from '../utils/getCountryDialCode'

const CountryIcon = ({ size, country }) => {
  const dialCode = getCountryDialCode(country)
  const source = `https://www.countryflags.io/${country}/flat/32.png`
  return (
    <div className="flex items-center">
      <img className="pr2" src={source} width={size} height={size} />
      <p>{`+${dialCode}`}</p>
    </div>
  )
}

export default memo(CountryIcon)
