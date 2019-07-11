import React, { memo, useMemo } from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import { pathOr, uniq } from 'ramda'

import { useAddress } from '../AddressContext'
import AddressListItem from './AddressListItem'

const MAX_ADDRESS_QUANTITY = 5

const AddressList = ({ onSelectAddress }) => {
  const { address } = useAddress()
  const availableAddresses = useMemo(() => {
    const filtered = pathOr(
      [],
      ['orderForm', 'shippingData', 'availableAddresses'],
      address
    )
      .filter(
        address =>
          address.city &&
          address.street &&
          address.number &&
          address.addressType !== 'pickup'
      )
      .reverse()
    return uniq(filtered).slice(0, MAX_ADDRESS_QUANTITY)
  }, [address])

  if (availableAddresses.length === 0) {
    return null
  }

  return (
    <div className="vtex-address-locator__address-list pa5">
      <FormattedMessage id="store/address-manager.address-list">
        {text => <span className="t-small f6 c-muted-1">{text}</span>}
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
}

AddressList.propTypes = {
  /* Function that will be called when selecting an address */
  onSelectAddress: PropTypes.func,
}

export default memo(AddressList)
