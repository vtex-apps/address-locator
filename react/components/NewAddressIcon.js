import React from 'react'
import PropTypes from 'prop-types'

import withImage from './withImage'

const NewAddressIcon = ({ imageSrc }) => {
  if (!imageSrc) {
    return null
  }

  return (
    <p className="mt8 tc">
      <img className="v-mid" src={imageSrc} />
    </p>
  )
}

NewAddressIcon.propTypes = {
  imageSrc: PropTypes.string,
  onClick: PropTypes.func,
}

const getImagePath = () => 'New-Address-Icon.svg'

export default withImage(getImagePath)(NewAddressIcon)
