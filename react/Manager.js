import React, { Component } from 'react'
import _ from 'lodash' //TODO: Replace with ramda
import { orderFormConsumer, contextPropTypes } from 'vtex.store/OrderFormContext'
import ChangeAddressIcon from './components/ChangeAddressIcon'
import ChangeAddressModal from './components/ChangeAddressModal'
import AddressModal from './components/AddressModal'
import hoistNonReactStatics from 'hoist-non-react-statics'
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

  render() {
    const { orderFormContext, logoUrl } = this.props
    const { shippingData } = orderFormContext.orderForm

    // If we don't know if there is an address or not we shouldn't load anything
    if (shippingData === undefined) return null

    // If there is no address, it means that the user isn't identified, and so the component won't render
    if (!shippingData || !shippingData.address) return <AddressModal logoUrl={logoUrl}/>

    const { street, number } = shippingData.address
    const modalProps = {
      isOpen: this.state.isModalOpen,
      onClose: this.handleCloseModal,
      orderFormContext: this.props.orderFormContext,
      logoUrl,
    }

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
        <ChangeAddressModal {...modalProps}/>
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
