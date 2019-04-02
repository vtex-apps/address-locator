import { getCountryCallingCode } from 'libphonenumber-js'
import convertIso3To2 from 'country-iso-3-to-2'

const getCountryDialCode = country => {
  const countryString = country.length === 3 ? convertIso3To2(country) : country
  return getCountryCallingCode(countryString)
}

export default getCountryDialCode
