import React, { Component } from 'react'
import { orderFormConsumer, contextPropTypes } from 'vtex.store-resources/OrderFormContext'
import ChangeAddressModal from './components/ChangeAddressModal'
import AddressBar from './components/AddressBar'
import AddressModal from './components/AddressModal'
import hoistNonReactStatics from 'hoist-non-react-statics'
import { Spinner } from 'vtex.styleguide'
import { compose } from 'recompose'
import { graphql } from 'react-apollo'
import { path } from 'ramda'
import pickupPointQuery from './queries/pickupPoint.gql'
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
    const { orderFormContext, logoUrl, pickupPointQuery } = this.props
    const { shippingData } = orderFormContext.orderForm

    // If we don't know if there is an address or not we shouldn't load anything
    const isLoading = pickupPointQuery && pickupPointQuery.loading
    if (shippingData === undefined || isLoading) {
      return (
        <React.Fragment>
          <AddressBar />
          <div className="flex items-center justify-center fixed absolute--fill z-999 c-action-primary">
            <div className="absolute absolute--fill bg-black-30" />
            <div className="relative bg-base br3 flex items-center justify-center w4 h4">
              <Spinner />
            </div>
          </div>
        </React.Fragment>
      )
    }

    // If there is no address, it means that the user isn't identified, and so the component won't render
    if (!shippingData || !shippingData.address) {
      return (
        <React.Fragment>
          <AddressBar />
          <AddressModal logoUrl={logoUrl} />
        </React.Fragment>
      )
    }

    const { street, number } = shippingData.address
    const modalProps = {
      isOpen: this.state.isModalOpen,
      onClose: this.handleCloseModal,
      orderFormContext: this.props.orderFormContext,
      logoUrl,
    }

    const pickupName = path(['pickupPoint', 'friendlyName'], pickupPointQuery)
    const pickupNameString = pickupName ? pickupName + ' - ' : ''

    return (
      <React.Fragment>
        <AddressBar onClick={this.handleOpenModal}>
          {`${pickupNameString}${street}, ${number}`}
        </AddressBar>
        <ChangeAddressModal {...modalProps} />
      </React.Fragment>
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

const composed = compose(
  orderFormConsumer,
  graphql(pickupPointQuery, {
    name: 'pickupPointQuery',
    skip: ({ orderFormContext: { orderForm: { isCheckedIn, checkedInPickupPointId  } } }) => 
      !isCheckedIn || !checkedInPickupPointId,
    options: ({ orderFormContext: { orderForm: { checkedInPickupPointId  } } }) => ({
      variables: {
        id: checkedInPickupPointId,
      }
    })
  })
)

export default hoistNonReactStatics(composed(AddressManager), AddressManager)
