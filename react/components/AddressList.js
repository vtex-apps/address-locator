import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Adopt } from 'react-adopt'
import { FormattedMessage } from 'react-intl'
import AddressListItem from './AddressListItem'
import { contextPropTypes } from 'vtex.store/OrderFormContext'

class AddressList extends Component {
  static propTypes = {
    /* Array of user's available addresses */
    availableAddresses: PropTypes.arrayOf(PropTypes.object),
    /* Function that will be called after updating the orderform */
    onOrderFormUpdated: PropTypes.func,
    /* Context used to call address mutation and retrieve the orderForm */
    orderFormContext: contextPropTypes,
  }

  handleSelectAddress = address => {
    const { orderFormContext, onOrderFormUpdated } = this.props
    const { orderFormId } = orderFormContext.orderForm

    orderFormContext
      .updateOrderFormShipping({
        variables: {
          orderFormId,
          address,
        },
      })
      .then(() => {
        if (onOrderFormUpdated) {
          onOrderFormUpdated()
        }
        orderFormContext.refetch()
        this.setState({
          isLoading: false,
        })
      })
  }

  getValidAvailableAddresses = () => {
    const { availableAddresses } = this.props

    return availableAddresses.filter(
      address => (address.city && address.street && address.number)
    )
  }

  render() {
    const availableAddresses = this.getValidAvailableAddresses()

    /* It will set the max length of available addresses array */
    const maxAddressesQuantity = 5
    return (
      <div className="vtex-address-locator__address-list pa5">
        <Adopt
          mapper={{
            text: <FormattedMessage id="address-manager.address-list" />,
          }}
        >
          {({ text }) => <span className="f6 dark-gray">{text}</span>}
        </Adopt>
        {availableAddresses
          .reverse()
          .slice(0, maxAddressesQuantity)
          .map((address, key) => (
            <AddressListItem
              key={key}
              address={address}
              isLastAddress={key === maxAddressesQuantity - 1}
              onSelectAddress={this.handleSelectAddress}
            />
          ))}
      </div>
    )
  }
}

export default AddressList
