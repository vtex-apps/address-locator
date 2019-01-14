import React, { Component } from 'react'
import PropTypes from 'prop-types'

const Card = ({ children }) => (
  <div className="ph6 pv7 bg-base shadow-2 br2 mh5 mv5">
    {children}
  </div>
)

Card.propTypes = {
  children: PropTypes.node,
}

export default Card