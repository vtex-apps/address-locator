import React, { Component, Fragment } from 'react'
import { Adopt } from 'react-adopt'
import { FormattedMessage } from 'react-intl'
import _ from 'lodash'
import { orderFormConsumer, contextPropTypes } from 'vtex.store/OrderFormContext'
import Modal from 'vtex.styleguide/Modal'
import Button from 'vtex.styleguide/Button'
import Spinner from 'vtex.styleguide/Spinner'
import ChangeAddressIcon from './components/ChangeAddressIcon'
import NewAddressIcon from './components/NewAddressIcon'
import AddressList from './components/AddressList'
import AddressSearch from './components/AddressSearch'
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

  /* Get available addresses from orderform and returns it prepared to list */
  getAvailableAddresses = () => {
    /* It will set the max length of available addresses array */
    const maxAddressesQuantity = 5

    let { availableAddresses } = this.props.orderFormContext.orderForm.shippingData

    /* Removing duplicate objects from array */
    availableAddresses = _.uniqWith(availableAddresses, _.isEqual)

    availableAddresses = this.getValidAvailableAddresses(availableAddresses)
      .reverse()
      .slice(0, maxAddressesQuantity)

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
      .then(() => {
        if (window.location.pathname !== '/order') {
          return window.location.assign('/order')
        }
        orderFormContext.refetch()

        this.setState({
          isLoading: false,
          isModalOpen: false,
        })
      })
  }

  handleOpenModal = () => {
    this.setState({ isModalOpen: true })
  }

  handleCloseModal = () => {
    this.setState({
      isModalOpen: false,
      isSearchingAddress: false,
    })
  }

  handleAddressSearch = () => {
    this.setState({ isSearchingAddress: true })
  }

  render() {
    const { orderFormContext } = this.props
    const { shippingData } = orderFormContext.orderForm

    /* If there is no address, it means that the user isn't identified, and so the component won't render */
    if (!shippingData || !shippingData.address) {
      return null
    }

    const { street, number } = shippingData.address
    const { isModalOpen, isSearchingAddress, isLoading } = this.state
    const availableAddresses = this.getAvailableAddresses()

    return (
      <div className="address-manager">
        <div className="address-manager__bar flex ph5 white pointer" onClick={this.handleOpenModal}>
          <p className="address-manager__address mr5 overflow-hidden nowrap">
            {`${street}, ${number}`}
          </p>
          <ChangeAddressIcon />
        </div>
        <Modal isOpen={isModalOpen} onClose={this.handleCloseModal}>
          <Adopt
            mapper={{
              title: <FormattedMessage id="address-locator.address-manager-title" />,
            }}
          >
            {({ title }) => <p className="f4 pa5 ma0 bb b--light-gray bw1 b near-black">{title}</p>}
          </Adopt>
          <p className={`${isSearchingAddress ? 'mt10' : 'mt8'} tc`}>
            <NewAddressIcon />
          </p>
          {!isSearchingAddress ? (
            <Fragment>
              <div className="pa5 mb5">
                <Adopt
                  mapper={{
                    text: <FormattedMessage id="address-locator.address-manager-button" />,
                  }}
                >
                  {({ text }) => (
                    <Button onClick={this.handleAddressSearch} block>
                      {text}
                    </Button>
                  )}
                </Adopt>
              </div>
              {!isLoading ? (
                <AddressList
                  availableAddresses={availableAddresses}
                  onOrderFormUpdated={this.handleCloseModal}
                  onSelectAddress={this.handleSelectAddress}
                />
              ) : (
                <p className="tc">
                  <Spinner />
                </p>
              )}
            </Fragment>
          ) : (
            <AddressSearch
              onOrderFormUpdated={this.handleCloseModal}
              orderFormContext={orderFormContext}
            />
          )}
        </Modal>
      </div>
    )
  }
}

export default orderFormConsumer(AddressManager)
