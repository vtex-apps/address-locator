import React from 'react'
import PropTypes from 'prop-types'

const Card = ({ children }) => (
  <div className="w-100 flex justify-center">
    <div className="ph6 ph9-ns pv7 pv8-ns bg-base shadow-2 br2 mh5 mv5 mw6 w-100">
      {children}
    </div>
  </div>
)

Card.propTypes = {
  children: PropTypes.node,
}

export default Card