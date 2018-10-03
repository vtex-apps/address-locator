import React from 'react'
import PropTypes from 'prop-types'

import withImage from './withImage'

const LocationInputIcon = ({ onClick, imageSrc }) => {
  if (!imageSrc) {
    return null
  }

  return (
    <span onClick={onClick} className="absolute bottom-0 pv4 right-1 input-icon input-icon--location">
      <img className="v-mid pl3" src={imageSrc} />
    </span>
  )
}

LocationInputIcon.propTypes = {
  imageSrc: PropTypes.string,
  onClick: PropTypes.func,
}

const getImagePath = () => 'My-Address-Icon.svg'

export default withImage(getImagePath)(LocationInputIcon)
