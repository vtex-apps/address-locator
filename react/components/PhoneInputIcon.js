import React from 'react'
import PropTypes from 'prop-types'

const PhoneInputIcon = ({ imageSrc, countryCode }) => {
  if (!imageSrc) return null

  return (
    <span className="input-icon input-icon--flag left-1 absolute pv4 flex items-center">
      <img src={imageSrc} className="w-20 pr2" />
      <span className="pt1">{`+${countryCode}`}</span>
    </span>
  )
}

PhoneInputIcon.propTypes = {
  imageSrc: PropTypes.string,
  countryCode: PropTypes.number,
}

export default PhoneInputIcon
