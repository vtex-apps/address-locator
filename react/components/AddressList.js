import React from 'react'
import PropTypes from 'prop-types'

const AddressList = ({ availableAddresses }) => (
  <div className="vtex-address-locator__address-list pa5">
    <span className="f6 dark-gray">Previous addresses</span>
    {availableAddresses.slice(0, 5).map((e, key) => (
      <div className={`bb ${key !== 4 && 'b--light-gray'} pv4`} key={key}>
        <p className="mb2 mt0">{`${key} ${e.street}, ${e.number}`}</p>
        <span className="f6 dark-gray">{`${e.neighborhood}, ${e.city}`}</span>
      </div>
    ))}
  </div>
)

AddressList.propTypes = {
  /* Array of user's available addresses */
  availableAddresses: PropTypes.arrayOf(PropTypes.object),
}

export default AddressList
