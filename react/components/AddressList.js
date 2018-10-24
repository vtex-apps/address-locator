import React from 'react'
import PropTypes from 'prop-types'
import { Adopt } from 'react-adopt'
import { FormattedMessage } from 'react-intl'
import AddressListItem from './AddressListItem'

const AddressList = ({ availableAddresses, onSelectAddress }) => (
  <div className="vtex-address-locator__address-list pa5">
    <FormattedMessage id="address-manager.address-list">
      {text => <span className="f6 dark-gray">{text}</span>}
    </FormattedMessage>
    {availableAddresses.map((address, key) => (
      <AddressListItem
        key={key}
        address={address}
        isLastAddress={key === availableAddresses.length - 1}
        onSelectAddress={onSelectAddress}
      />
    ))}
  </div>
)

AddressList.propTypes = {
  /* Array of user's available addresses */
  availableAddresses: PropTypes.arrayOf(PropTypes.object),
  /* Function that will be called when selecting an address */
  onSelectAddress: PropTypes.func,
}

export default AddressList
