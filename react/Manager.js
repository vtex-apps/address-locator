import React, { Component, Fragment } from 'react'
import { FormattedMessage } from 'react-intl'
import _ from 'lodash' //TODO: Replace with ramda
import { orderFormConsumer, contextPropTypes } from 'vtex.store/OrderFormContext'
import Modal from 'vtex.styleguide/Modal'
import Button from 'vtex.styleguide/Button'
import Spinner from 'vtex.styleguide/Spinner'
import ChangeAddressIcon from './components/ChangeAddressIcon'
import NewAddressIcon from './components/NewAddressIcon'
import AddressList from './components/AddressList'
import AddressSearch from './components/Search'
import './global.css'

/**
 * Component responsible for displaying and managing user's address using orderFormContext.
 */
class AddressManager extends Component {
  static propTypes = {
    /* Context used to call address mutation and retrieve the orderForm */
    orderFormContext: contextPropTypes,
  }

  state = {
    isModalOpen: false,
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

  /**
   * Updates the orderFormContext with the selected address
   *
   * @param {Object} address The selected address
   */
  handleSelectAddress = address => {
    const { orderFormContext } = this.props
    const { orderFormId } = orderFormContext.orderForm

    this.setState({
      isLoading: true,
    })

    orderFormContext
      .updateOrderFormShipping({
        variables: {
          orderFormId,
          address,
        },
      })
      .then(async () => {
        await this.handleOrderFormUpdated()
      })
  }

  handleOpenModal = () => this.setState({ isModalOpen: true })

  handleCloseModal = () =>
    this.setState({
      isModalOpen: false,
      isSearchingAddress: false,
      isLoading: false,
    })

  /* Function that will be called when updating the orderform */
  handleOrderFormUpdated = async () => {
    const { orderFormContext } = this.props

    await orderFormContext.refetch()
    this.handleCloseModal()
  }

  handleAddressSearch = () => this.setState({ isSearchingAddress: true })

  render() {
    const { orderFormContext } = this.props
    const { shippingData } = orderFormContext.orderForm

    /* If there is no address, it means that the user isn't identified, and so the component won't render */
    if (!shippingData || !shippingData.address) return null

    const { street, number } = shippingData.address
    const { isModalOpen, isSearchingAddress, isLoading } = this.state
    const availableAddresses = this.getAvailableAddresses()

    return (
      <div className="vtex-address-manager">
        <div
          className="vtex-address-manager__bar flex ph5 white pointer"
          onClick={this.handleOpenModal}
        >
          <p className="vtex-address-manager__address mr5 overflow-hidden nowrap">
            {`${street}, ${number}`}
          </p>
          <div className="vtex-address-manager__icon">
            <ChangeAddressIcon />
          </div>
        </div>
        <Modal isOpen={isModalOpen} onClose={this.handleCloseModal}>
          <p className="f4 pa5 ma0 bb b--light-gray bw1 b near-black">
            <FormattedMessage id="address-locator.address-manager-title" />
          </p>
          <span className={`${isSearchingAddress ? 'mt10' : 'mt8'} db mb5 tc`}>
            <NewAddressIcon />
          </span>
          {!isSearchingAddress ? (
            <Fragment>
              <div className="pa5 mb5">
                <Button onClick={this.handleAddressSearch} block>
                  <FormattedMessage id="address-locator.address-manager-button" />
                </Button>
              </div>
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
            </Fragment>
          ) : (
            <AddressSearch
              onOrderFormUpdated={this.handleOrderFormUpdated}
              orderFormContext={orderFormContext}
            />
          )}
        </Modal>
      </div>
    )
  }
}

export default orderFormConsumer(AddressManager)
