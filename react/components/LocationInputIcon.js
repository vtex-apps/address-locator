import React from 'react'
import PropTypes from 'prop-types'

import withImage from './withImage'

import styles from '../styles.css'

const LocationInputIcon = ({ onClick, imageSrc }) => {
  if (!imageSrc) {
    return null
  }

  return (
    <div onClick={onClick} className={`${styles.locationIcon} pointer`}>
      <img className="v-mid pl3" src={imageSrc} />
    </div>
  )
}

LocationInputIcon.propTypes = {
  imageSrc: PropTypes.string,
  onClick: PropTypes.func,
}

const getImagePath = () => 'My-Address-Icon.svg'

export default withImage(getImagePath)(LocationInputIcon)
