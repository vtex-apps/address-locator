import React from 'react'
import PropTypes from 'prop-types'

const PhoneInputIcon = ({ imageSrc, countryCode }) => {
  if (!imageSrc) {
    return null
  }

  return (
    <span className="input-icon input-icon--brazil">
      <img src={imageSrc} />+{countryCode}
    </span>
  )
}

PhoneInputIcon.propTypes = {
  imageSrc: PropTypes.string,
  countryCode: PropTypes.number
}

export default PhoneInputIcon
