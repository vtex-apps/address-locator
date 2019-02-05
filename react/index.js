import React, { Component } from 'react'
import { orderFormConsumer, contextPropTypes } from 'vtex.store-resources/OrderFormContext'
import ChangeAddressModal from './components/ChangeAddressModal'
import AddressPage from './components/AddressPage'
import { Spinner } from 'vtex.styleguide'
import hoistNonReactStatics from 'hoist-non-react-statics'
import queryString from 'query-string'
import './global.css'

/**
 * Component responsible for displaying and managing user's address using orderFormContext.
 */
class AddressManager extends Component {
  static propTypes = {
    /* Context used to call address mutation and retrieve the orderForm */
    orderFormContext: contextPropTypes,
    /* URL for the store logo */
    logoUrl: PropTypes.string,
  }

  handleSelectAddress = () => {
    this.redirectToReturnURL()
  }

  componentDidMount() {
    this.checkAddress()
  }

  componentDidUpdate() {
    this.checkAddress()
  }

  checkAddress = () => {
    const { orderFormContext } = this.props
    const { shippingData } = orderFormContext.orderForm

    if (shippingData && shippingData.address) {
      this.redirectToReturnURL()
    }
  }

  redirectToReturnURL = () => {
    try {
      const parsedQueryString = queryString.parse(window.location.search)
      const returnURL = parsedQueryString && parsedQueryString.returnUrl
      window.location.href = `/${returnURL || ''}`
    } catch (e) {
      // Unable to redirect
    }
  }

  render() {
    const { orderFormContext } = this.props
    const { shippingData } = orderFormContext.orderForm

    const isLoading = shippingData === undefined

    if (!shippingData || !shippingData.address) {
      return (
        <AddressPage
          loading={isLoading}
          onSelectAddress={this.handleSelectAddress} />
      )
    }

    return (
      <AddressPage loading />
    )
    /** TODO: Add a redirect placeholder (perhaps one of those "If you are not redirected, click here" things)
     * @author lbebber */
    return (
      <div
        className="w-100 flex items-center justify-center"
        style={{
          height: 400
        }}>
        <Spinner />
      </div>
    )
  }
}

AddressManager.schema = {
  title: 'address-locator.address-manager-title',
  description: 'address-locator.address-manager-description',
  type: 'object',
  properties: {
    logoUrl: {
      type: 'string',
      title: 'address-locator.address-manager.logo-title',
      widget: {
        'ui:widget': 'image-uploader'
      }
    },
  }
}

export default hoistNonReactStatics(orderFormConsumer(AddressManager), AddressManager)
