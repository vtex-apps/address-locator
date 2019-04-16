import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import AddressListItem from './AddressListItem'

import styles from '../styles.css'

const AddressList = ({ availableAddresses, onSelectAddress }) => (
  <div className={`${styles.addressList} pa5`}>
    <FormattedMessage id="address-manager.address-list">
      {text => <span className="t-small f6 dark-gray">{text}</span>}
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
