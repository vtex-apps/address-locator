import React from 'react'
import PropTypes from 'prop-types'

import withImage from './withImage'

const BrazilInputIcon = ({ imageSrc }) => {
  if (!imageSrc) {
    return null
  }

  return (
    <span className="absolute bottom-0 pv4 left-1 vtex-input-icon vtex-input-icon--brazil">
      <img className="v-mid pr2" src={imageSrc} />+55
    </span>
  )
}

BrazilInputIcon.propTypes = {
  imageSrc: PropTypes.string,
}

const getImagePath = () => 'brazil.svg'

export default withImage(getImagePath)(BrazilInputIcon)
