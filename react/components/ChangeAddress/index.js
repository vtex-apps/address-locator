import React, { Component } from 'react'
import { path, uniq } from 'ramda'
import { orderFormConsumer, contextPropTypes } from 'vtex.store-resources/OrderFormContext'
import { graphql } from 'react-apollo'
import { compose } from 'ramda'
import gql from 'graphql-tag'
import Spinner from 'vtex.styleguide/Spinner'
import { withModal } from 'vtex.modal/ModalContext'

import AddressList from '../AddressList'
import AddressContent from '../AddressContent'
import PickupContent from '../PickupContent'
import '../../global.css'

const MAX_ADDRESS_QUANTITY = 5

/**
 * Component responsible for displaying and managing user's address using orderFormContext.
 */
class ChangeAddress extends Component {
  static propTypes = {
    orderFormContext: contextPropTypes,
  }

  state = {
    isLoading: false,
    isPickupOpen: false,
  }

  /* Filters available addresses and returns only valid ones */
  getValidAvailableAddresses = availableAddresses =>
    availableAddresses.filter(address => address.city && address.street && address.number && address.addressType !== 'pickup')

  /**
   * Prepare available addresses to list, by removing invalid and duplicate ones, as well reversing and slicing
   *
   * @returns {Array} The available addresses array prepared to list
   */
  getAvailableAddresses = () => {
    let { availableAddresses } = this.props.orderFormContext.orderForm.shippingData

    /* Remove invalid addresses from array and then reverse it, to be sorted by the last selected */
    availableAddresses = this.getValidAvailableAddresses(availableAddresses).reverse()
    /* Remove duplicate objects from array and then slice by the setted max length */
    availableAddresses = uniq(availableAddresses).slice(0, MAX_ADDRESS_QUANTITY)

    return availableAddresses
  }

  handleSelectAddress = async (address) => {
    const { updateOrderFormShipping } = this.props
    const { orderFormContext } = this.props
    const { orderFormId } = orderFormContext.orderForm

    this.setState({ isLoading: true })

    const orderForm = await updateOrderFormShipping(orderFormId, address).catch(() => null)
    if (!orderForm) {
      // TODO: Display error
    }
    this.handleCloseModal()
  }

  handleChangeAddress = () => {
    this.handleOrderFormUpdated()
  }

  handleCloseModal = () => {
    const { closeModal } = this.props
    closeModal && closeModal()
    this.setState({
      isLoading: false,
      isPickupOpen: false,
    })
  }

  handleOrderFormUpdated = async () => {
    const { orderFormContext, updateOrderForm } = this.props
    const orderFormResp = await orderFormContext.refetch().catch(() => null)
    orderFormResp && updateOrderForm(orderFormResp.data.orderForm)
    this.handleCloseModal()
  }

  handlePickupConfirm = () => {
    this.setState({
      isPickupOpen: false,
    })
    this.handleOrderFormUpdated()
  }

  handlePickupClick = () => {
    this.setState({
      isPickupOpen: true,
    })
  }

  render() {
    const { orderFormContext } = this.props
    const { isPickupOpen } = this.state

    if (!path(['orderForm', 'shippingData', 'address'], orderFormContext)) return null

    const { isLoading } = this.state
    const availableAddresses = this.getAvailableAddresses()

    const pickupPage = isPickupOpen ? (
      <PickupContent
        orderFormContext={orderFormContext}
        onConfirm={this.handlePickupConfirm}
        onUpdateOrderForm={this.handleOrderFormUpdated}
      />
    ) : null

    return (
      <div className="overflow-hidden relative br2"
        style={{
          margin: '-3rem',
          padding: '3rem',
        }}>
        <div
          style={{
            transition: 'transform 300ms',
            transform: `translate3d(${isPickupOpen ? '-100%' : '0'}, 0, 0)`
          }}>
          <AddressContent
            onPickupClick={this.handlePickupClick}
            onUpdateOrderForm={this.handleChangeAddress} />
          {!isLoading ? (
            <AddressList
              availableAddresses={availableAddresses}
              onOrderFormUpdated={this.handleOrderFormUpdated}
              onSelectAddress={this.handleSelectAddress}
            />
          ) : (
            <div className="flex flex-grow-1 justify-center items-center">
              <Spinner />
            </div>
          )}
        </div>
        <div className="absolute w-100 h-100 top-0" style={{
          left: '100%',
          transition: 'transform 300ms',
          transform: `translate3d(${isPickupOpen ? '-100%' : '0'}, 0, 0)`
        }}>
          {pickupPage}
        </div>
      </div>
    )
  }
}


const withMutationShipping = graphql(
  gql`
    mutation updateOrderFormShipping($orderFormId: String, $address: Address) {
      updateOrderFormShipping(orderFormId: $orderFormId, address: $address) @client
    }
  `,
  {
    props: ({ mutate }) => ({
      updateOrderFormShipping: (orderFormId, address) => mutate({ variables: {orderFormId, address} }),
    }),
  }
)

const withMutationOrderFormUpdate = graphql(
  gql`
    mutation updateOrderForm($orderForm: [OrderForm]) {
      updateOrderForm(orderForm: $orderForm) @client
    }
  `,
  {
    name: 'updateOrderForm',
    props: ({ updateOrderForm }) => ({
      updateOrderForm: (orderForm) => updateOrderForm({ variables: {orderForm} }),
    }),
  }
)

const enhanced = compose(
  withModal,
  orderFormConsumer,
  withMutationOrderFormUpdate,
  withMutationShipping,
)

export default enhanced(ChangeAddress)
