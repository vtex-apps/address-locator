import React, { Component } from 'react'
import { Spinner } from 'vtex.styleguide'
import { contextPropTypes } from 'vtex.store/OrderFormContext'
import { path } from 'ramda'

import { AddressRules } from 'vtex.address-form'
import PickupModalContainer from './PickupModalContainer'
import AskForModal from './AskForModal';
import PickupPointChosen from './PickupPointChosen';

class PickupTab extends Component {
  state = {
    isModalOpen: false,
    askForGeolocation: true,
    isFetching: false,
  }

  handleOpenModal = (askForGeolocation) => this.setState({ isModalOpen: true, askForGeolocation })

  onHandleCloseModal = () => this.setState({ isModalOpen: false })

  onHandlePickedSLA = async (pickupPoint) => {
    const { orderFormContext, onOrderFormUpdated } = this.props
    this.setState({ isFetching: true })
    try {
      await orderFormContext.updateOrderFormCheckin({
        variables: {
          orderFormId: orderFormContext.orderForm.orderFormId,
          checkin: { isCheckedIn: true, pickupPointId: pickupPoint.id },
        },
      })
    } catch (err) {
      // Show user that pickup point choice failed?
    }

    this.setState({ isFetching: false })
    if (onOrderFormUpdated) {
      onOrderFormUpdated()
    }
  }

  renderAskForModal = () => {
    return <AskForModal handleOpenModal={this.handleOpenModal} />
  }

  renderDeliveryPicked = () => {
    const { orderFormContext: { orderForm } } = this.props
    const { shippingData: { address }, pickupPoint } = orderForm

    return (
      <PickupPointChosen 
        handleOpenModal={this.handleOpenModal}
        name={path(['friendlyName'], pickupPoint)}
        street={address.street}
        number={address.number}
      />
    )
  }

  render() {
    const { orderFormContext: { orderForm } } = this.props
    const { askForGeolocation, isFetching, isModalOpen } = this.state
    const { isCheckedIn, storePreferencesData, pickupPoint } = orderForm
    const { countryCode } = storePreferencesData
    const isLoading = isFetching
    return (
      <AddressRules
        country={countryCode}
        shouldUseIOFetching
      >
        <div className="w-100 center flex flex-column justify-center items-center pa6">
        {isLoading ? <Spinner /> : isCheckedIn ? this.renderDeliveryPicked() : <AskForModal handleOpenModal={this.handleOpenModal} />}
        <PickupModalContainer
          isModalOpen={isModalOpen}
          closePickupModal={this.onHandleCloseModal}
          storePreferencesData={storePreferencesData}
          askForGeolocation={askForGeolocation}
          handlePickedSLA={this.onHandlePickedSLA}
          activePickupPoint={pickupPoint}
          />
        </div>
      </AddressRules>
    )
  }
}

PickupTab.propTypes = {
  orderFormContext: contextPropTypes,
}

export default PickupTab
