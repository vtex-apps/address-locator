import React from 'react'
import PropTypes from 'prop-types'

const PhoneInputIconWithText = ({ imageSrc, text }) => {
  if (!imageSrc) return null

  return (
    <span className="input-icon input-icon--flag">
      <img src={imageSrc} className="w-20 pr2" />
      <span className="pt1">{text}</span>
    </span>
  )
}

PhoneInputIconWithText.propTypes = {
  imageSrc: PropTypes.string,
  text: PropTypes.string,
}

export default PhoneInputIconWithText
