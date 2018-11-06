import React, { Component } from 'react'
import { FormattedMessage, intlShape } from 'react-intl'
import { compose } from 'recompose'
import { withRuntimeContext } from 'render'
import PropTypes from 'prop-types'
import { orderFormConsumer, contextPropTypes } from 'vtex.store/OrderFormContext'
import { Modal } from 'vtex.styleguide'

import AddressSearch from './Search'
import AddressRedeem from './Redeem'
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
    pageToRedirect: PropTypes.string,
    runtime: PropTypes.shape({
      page: PropTypes.string.isRequired,
      pages: PropTypes.object.isRequired,
    }).isRequired,
  }

  static defaultProps = { pageToRedirect: 'store/order' }

  static contextTypes = { intl: intlShape }

  state = {
    isOpen: false,
  }

  needAddress() {
    const shippingData = this.props.orderFormContext.orderForm.shippingData
    return shippingData == null || shippingData.address == null
  }

  handleClose = () => this.setState({ isOpen: false })

  componentDidMount() {
    const overlayElement = document && document.querySelector('.vtex-modal__overlay')

    if(overlayElement){
      overlayElement.addEventListener('click', this.shakeModal)
    }
  }

  componentWillUnmount() {
    const overlayElement = document && document.querySelector('.vtex-modal__overlay')

    if(overlayElement){
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
      <Modal {...{ isOpen: this.needAddress(), closeOnEsc: false, closeOnOverlayClick: false, showCloseIcon: false, onClose: () => {} }} >
        <div className="vtex-address-modal">
          <h1 className="db b f1 mb7 mt0 pa5 tl tc-m">
            <FormattedMessage id="address-locator.order-title" />
          </h1>
          <div className="vtex-address-locator w-100 w-50-m center flex flex-column justify-center items-center pa6">
            <AddressSearch
              orderFormContext={this.props.orderFormContext}
              onOrderFormUpdated={this.handleOrderFormUpdated}
            />
            <AddressRedeem
              orderFormContext={this.props.orderFormContext}
              onOrderFormUpdated={this.handleOrderFormUpdated}
            />
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
