import React, { Component } from 'react'
import { compose } from 'recompose'
import { withRuntimeContext } from 'render'
import PropTypes from 'prop-types'

import { orderFormConsumer, contextPropTypes } from 'vtex.store-resources/OrderFormContext'
import { Modal } from 'vtex.styleguide'

import AddressRedeem from './Redeem'
import Tabs from './Tabs';

import '../global.css'

/**
 * Component that allows the user to locate his address, by inserting, searching, retrieving and
 * saving it into orderform.
 * Configure the key for Google Geolocation API, by inserting it on the admin logistics section.
 */
class AddressModal extends Component {
  static propTypes = {
    /* Context used to call address mutation and retrieve the orderForm */
    orderFormContext: contextPropTypes,
    /* URL for the store logo */
    logoUrl: PropTypes.string,
  }

  needAddress() {
    const shippingData = this.props.orderFormContext.orderForm.shippingData
    return shippingData == null || shippingData.address == null
  }

  handleClose = () => this.setState({ isOpen: false })

  componentDidMount() {
    const overlayElement = document && document.querySelector('.vtex-modal__overlay')

    if (overlayElement) {
      overlayElement.addEventListener('click', this.shakeModal)
    }
  }

  componentWillUnmount() {
    const overlayElement = document && document.querySelector('.vtex-modal__overlay')

    if (overlayElement) {
      overlayElement.removeEventListener('click', this.shakeModal)
    }
  }

  shakeModal = e => {
    const modalElement = document && document.querySelector('.vtex-modal__modal')

    if (modalElement) {
      if (e.target !== e.currentTarget) {
        return
      }

      modalElement.classList.add('animated', 'shake')

      setTimeout(() => {
        modalElement.classList.remove('shake')
      }, 1000)
    }
  }

  /* Function that will be called when updating the orderform */
  handleOrderFormUpdated = async () => await this.props.orderFormContext.refetch()

  render() {
    return (
      <Modal {...{ isOpen: this.needAddress(), closeOnEsc: false, closeOnOverlayClick: false, showCloseIcon: false, onClose: () => { } }} >
        <div className="vtex-address-modal">
          <div className="w-100 bg-base">
            <img className="vtex-address-modal__logo" src={this.props.logoUrl} />
          </div>
          <div className="vtex-address-modal__form">
            <div className="vtex-address-modal__new">
              <Tabs
                onOrderFormUpdated={this.handleOrderFormUpdated}
                orderFormContext={this.props.orderFormContext}
              />
            </div>
            <div className="vtex-address-modal__redeem">
              <AddressRedeem
                orderFormContext={this.props.orderFormContext}
                onOrderFormUpdated={this.handleOrderFormUpdated}
              />
            </div>
          </div>
        </div>
      </Modal>
    )
  }
}

export default compose(
  withRuntimeContext,
  orderFormConsumer
)(AddressModal)
