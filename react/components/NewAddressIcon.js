import React from 'react'
import PropTypes from 'prop-types'

import withImage from './withImage'

const NewAddressIcon = ({ imageSrc }) => {
  if (!imageSrc) {
    return null
  }

  return (
    <img className="v-mid" src={imageSrc} />
  )
}

NewAddressIcon.propTypes = {
  imageSrc: PropTypes.string,
  onClick: PropTypes.func,
}

const getImagePath = () => 'New-Address-Icon.svg'

export default withImage(getImagePath)(NewAddressIcon)
