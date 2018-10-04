import React from 'react'
import PropTypes from 'prop-types'
import { Adopt } from 'react-adopt'
import { FormattedMessage } from 'react-intl'

const AddressList = ({ availableAddresses }) => (
  <div className="vtex-address-locator__address-list pa5">
    <Adopt mapper={{
      text: <FormattedMessage id="address-manager.address-list" />,
    }}>
      {({ text }) => (
        <span className="f6 dark-gray">{text}</span>
      )}
    </Adopt>
    {availableAddresses.slice(0, 5).map((e, key) => (
      <div className={`${key !== 4 && 'bb b--light-gray'} pv4`} key={key}>
        <p className="mb2 mt0">{`${e.street}, ${e.number}`}</p>
        <span className="f7 dark-gray">{`${e.neighborhood}, ${e.city}`}</span>
      </div>
    ))}
  </div>
)

AddressList.propTypes = {
  /* Array of user's available addresses */
  availableAddresses: PropTypes.arrayOf(PropTypes.object),
}

export default AddressList
