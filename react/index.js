import React, { Component } from 'react'
import { orderFormConsumer, contextPropTypes } from 'vtex.store-resources/OrderFormContext'
import ChangeAddressModal from './components/ChangeAddressModal'
import AddressModal from './components/AddressModal'
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

  state = {
    isModalOpen: false,
  }

  handleOpenModal = () => this.setState({ isModalOpen: true })
  handleCloseModal = () => this.setState({ isModalOpen: false })

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
    const { orderFormContext, logoUrl } = this.props
    const { shippingData } = orderFormContext.orderForm

    const isLoading = shippingData === undefined

    if (!shippingData || !shippingData.address) {
      return <AddressModal
        logoUrl={logoUrl}
        loading={isLoading}
        onClose={this.handleSelectAddress} />
    }

    /** TODO: Add a redirect placeholder (perhaps one of those "If you are not redirected, click here" things)
     * @author lbebber */
    return null
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
