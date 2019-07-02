import React from 'react'
import PropTypes from 'prop-types'

import { IconLocationInput } from 'vtex.store-icons'

const LocationInputIcon = ({ onClick }) => {
  return (
    <span
      onClick={onClick}
      className="pointer vtex-input-icon vtex-input-icon--location c-action-primary"
    >
      <IconLocationInput size={18} viewBox="0 0 18 18" />
    </span>
  )
}

LocationInputIcon.propTypes = {
  imageSrc: PropTypes.string,
  onClick: PropTypes.func,
}

export default LocationInputIcon
