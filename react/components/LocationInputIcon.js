import React from 'react'
import PropTypes from 'prop-types'

import withImage from './withImage'

const LocationInputIcon = ({ onClick, imageSrc }) => {
  if (!imageSrc) {
    return null
  }

  return (
    <span onClick={onClick} className="input-icon input-icon--location">
      <img src={imageSrc} />
    </span>
  )
}

LocationInputIcon.propTypes = {
  imageSrc: PropTypes.string,
  onClick: PropTypes.func,
}

const getImagePath = () => 'My-Address-Icon.svg'

export default withImage(getImagePath)(LocationInputIcon)
