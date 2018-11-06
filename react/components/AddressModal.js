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

  /* Function that will be called when updating the orderform */
  handleOrderFormUpdated = async () => await this.props.orderFormContext.refetch()

  render() {
    return (
      <Modal {...{ isOpen: this.needAddress(), closeOnEsc: false, closeOnOverlayClick: false, showCloseIcon: false, onClose: () => {} }} >
        <div className="vtex-address-modal">
          <div className="vtex-logo-bar bg-white w-100 pv5 tc">
            Logo
          </div>
          <div className="vtex-address-form">
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
        </div>
      </Modal>
    )
  }
}

export default compose(
  withRuntimeContext,
  orderFormConsumer
)(AddressModal)
