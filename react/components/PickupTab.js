import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { Button, Spinner } from 'vtex.styleguide'
import { contextPropTypes } from 'vtex.store/OrderFormContext'
import { graphql } from 'react-apollo'
import { path } from 'ramda'

import { AddressRules } from 'vtex.address-form'
import pickupPointQuery from '../queries/pickupPoint.gql'
import PickupModalContainer from './PickupModalContainer'
import GeolocationPin from './GeolocationPin'

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
    return (
      <Fragment>
        <p className="ask-for-geolocation-title">We will find the pickup point closer to you</p>
        <p className="ask-for-geolocation-subtitle">For that, we need to know your location</p>
        <div className="ask-for-geolocation-imageask">
          <GeolocationPin />
        </div>
        <div className="pv2">
          <Button
            onClick={() => this.handleOpenModal(true)}
          >
            USE MY CURRENT LOCATION
          </Button>
        </div>
        <div className="pv2">
          <Button
            variation="tertiary"
            onClick={() => this.handleOpenModal(false)}
          >
            INPUT ADDRESS
          </Button>
        </div>

      </Fragment>
    )
  }

  renderDeliveryPicked = () => {
    const { orderFormContext: { orderForm }, pickupPointQuery } = this.props
    const { shippingData: { address } } = orderForm

    const pickupName = path(['pickupPoint', 'friendlyName'], pickupPointQuery)

    return (
      <Fragment>
        {pickupName && (<p className="b">{pickupName}</p>)}
        <p>{`${address.street}, ${address.number}`}</p>
        <Button
          onClick={() => this.handleOpenModal(false)}
        >
          Choose other
        </Button>
      </Fragment>
    )
  }

  render() {
    const { orderFormContext: { orderForm }, pickupPointQuery } = this.props
    const { askForGeolocation, isFetching, isModalOpen } = this.state
    const { isCheckedIn, storePreferencesData } = orderForm
    const { countryCode } = storePreferencesData
    const isLoading = isFetching || (pickupPointQuery && pickupPointQuery.loading)
    const activePickupPoint = path(['pickupPoint'], pickupPointQuery)
    return (
      <AddressRules
        country={countryCode}
        shouldUseIOFetching
      >
        <div className="w-100 center flex flex-column justify-center items-center pa6">
          {isLoading ? <Spinner /> : isCheckedIn ? this.renderDeliveryPicked() : this.renderAskForModal()}
          <PickupModalContainer
            isModalOpen={isModalOpen}
            closePickupModal={this.onHandleCloseModal}
            storePreferencesData={storePreferencesData}
            askForGeolocation={askForGeolocation}
            handlePickedSLA={this.onHandlePickedSLA}
            activePickupPoint={activePickupPoint}
          />
        </div>
      </AddressRules>
    )
  }
}

PickupTab.propTypes = {
  orderFormContext: contextPropTypes,
  pickupPointQuery: PropTypes.object,
}

export default graphql(pickupPointQuery, {
  name: 'pickupPointQuery',
  skip: ({ orderFormContext: { orderForm: { isCheckedIn, checkedInPickupPointId } } }) =>
    !isCheckedIn || !checkedInPickupPointId,
  options: ({ orderFormContext: { orderForm: { checkedInPickupPointId } } }) => ({
    variables: {
      id: checkedInPickupPointId,
    },
  }),
})(PickupTab)
