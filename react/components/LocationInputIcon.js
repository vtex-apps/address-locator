import React from 'react'
import PropTypes from 'prop-types'

import withImage from './withImage'

const LocationInputIcon = ({ imageSrc }) => {
  if (!imageSrc) {
    return null
  }

  return (
    <span className="input-icon input-icon--location">
      <img src={imageSrc} />
    </span>
  )
}

LocationInputIcon.propTypes = {
  imageSrc: PropTypes.string,
}

const getImagePath = () => 'My-Address-Icon.svg'

export default withImage(getImagePath)(LocationInputIcon)
