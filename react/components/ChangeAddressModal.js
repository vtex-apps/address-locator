import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import _ from 'lodash' //TODO: Replace with ramda
import { contextPropTypes } from 'vtex.store-resources/OrderFormContext'
import Modal from 'vtex.styleguide/Modal'
import Button from 'vtex.styleguide/Button'
import Spinner from 'vtex.styleguide/Spinner'
import NewAddressIcon from './NewAddressIcon'
import AddressList from './AddressList'
import Tabs from './Tabs';
import AddressContent from './AddressContent';

/**
 * Component responsible for displaying and managing user's address using orderFormContext.
 */
class ChangeAddressModal extends Component {
  static propTypes = {
    orderFormContext: contextPropTypes,
    isOpen: PropTypes.bool,
    onClose: PropTypes.func,
  }

  state = {
    isSearchingAddress: false,
    isLoading: false,
  }

  /* Filters available addresses and returns only valid ones */
  getValidAvailableAddresses = availableAddresses =>
    availableAddresses.filter(address => address.city && address.street && address.number)

  /**
   * Prepare available addresses to list, by removing invalid and duplicate ones, as well reversing and slicing
   *
   * @returns {Array} The available addresses array prepared to list
   */
  getAvailableAddresses = () => {
    /* It will set the max length of available addresses array */
    const maxAddressesQuantity = 5

    let { availableAddresses } = this.props.orderFormContext.orderForm.shippingData

    /* Remove invalid addresses from array and then reverse it, to be sorted by the last selected */
    availableAddresses = this.getValidAvailableAddresses(availableAddresses).reverse()
    /* Remove duplicate objects from array and then slice by the setted max length */
    availableAddresses = _.uniqWith(availableAddresses, _.isEqual).slice(0, maxAddressesQuantity)

    return availableAddresses
  }

  handleSelectAddress = async (address) => {
    const { orderFormContext } = this.props
    const { orderFormId, isCheckedIn } = orderFormContext.orderForm

    this.setState({ isLoading: true })

    await orderFormContext.updateOrderFormShipping({
      variables: {
        orderFormId,
        address,
      },
    })
    if (isCheckedIn) {
      await orderFormContext.updateOrderFormCheckin({
        variables: {
          orderFormId: orderFormContext.orderForm.orderFormId,
          checkin: { isCheckedIn: false },
        },
      })
    }
    
    await this.handleOrderFormUpdated()
  }

  handleCloseModal = () => {
    this.props.onClose()
    this.setState({
      isSearchingAddress: false,
      isLoading: false,
    })
  }

  handleOrderFormUpdated = async () => {
    const { orderFormContext } = this.props

    await orderFormContext.refetch()
    this.handleCloseModal()
  }

  handleAddressSearch = () => this.setState({ isSearchingAddress: true })

  handlePickupClick = () => {

  }

  render() {
    const { orderFormContext, isOpen } = this.props
    const { shippingData } = orderFormContext.orderForm

    if (!shippingData || !shippingData.address) return null

    const { isSearchingAddress, isLoading } = this.state
    const availableAddresses = this.getAvailableAddresses()

    return (
      <Modal isOpen={isOpen} onClose={this.handleCloseModal} centered>
        <AddressContent onPickup={this.handlePickupClick} />
        {!isLoading ? (
          <AddressList
            availableAddresses={availableAddresses}
            onOrderFormUpdated={this.handleCloseModal}
            onSelectAddress={this.handleSelectAddress}
          />
        ) : (
            <i className="tc">
              <Spinner />
            </i>
        )}
      </Modal>
    )
  }
}

export default ChangeAddressModal
