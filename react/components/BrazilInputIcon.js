import React from 'react'
import PropTypes from 'prop-types'

import withImage from './withImage'

const BrazilInputIcon = ({ imageSrc }) => {
  if (!imageSrc) {
    return null
  }

  return (
    <span className="input-icon input-icon--brazil">
      <img src={imageSrc} />+55
    </span>
  )
}

BrazilInputIcon.propTypes = {
  imageSrc: PropTypes.string,
}

const getImagePath = () => 'brazil.svg'

export default withImage(getImagePath)(BrazilInputIcon)
