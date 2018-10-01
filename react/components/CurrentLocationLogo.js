import React from 'react'
import PropTypes from 'prop-types'

import withImage from './withImage'

const CurrentLocationLogo = ({ imageSrc }) => {
  if (!imageSrc) {
    return null
  }

  return (
    <span className="icon-current-location">
      <img src={imageSrc} />
    </span>
  )
}

CurrentLocationLogo.propTypes = {
  imageSrc: PropTypes.string,
}

const getImagePath = () => 'My-Address-Icon.svg'

export default withImage(getImagePath)(CurrentLocationLogo)
