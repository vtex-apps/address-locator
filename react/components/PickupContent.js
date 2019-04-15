import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Spinner } from 'vtex.styleguide'
import { orderFormConsumer, contextPropTypes } from 'vtex.store-resources/OrderFormContext'

import { AddressRules } from 'vtex.address-form'
import PickupModalContainer from './PickupModalContainer'

class PickupContent extends Component {
  state = {
    isModalOpen: false,
    isFetching: false,
  }

  onHandlePickedSLA = async (pickupPoint) => {
    const { orderFormContext, onOrderFormUpdated, onConfirm } = this.props
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

    onConfirm && onConfirm()
  }

  render() {
    const { orderFormContext: { orderForm }, loading } = this.props
    const { isFetching } = this.state
    const { storePreferencesData } = orderForm
    const { countryCode } = storePreferencesData
    const isLoading = isFetching || loading
    return (
      <AddressRules
        country={countryCode}
        shouldUseIOFetching
      >
        <div className="w-100 center flex flex-column justify-center items-center pa6">
        {isLoading ? (
          <div className="w-100 h-100 flex items-center justify-center">
            <Spinner />
          </div>
        ) : (
          <PickupModalContainer
            storePreferencesData={storePreferencesData}
            handlePickedSLA={this.onHandlePickedSLA}
          />
        )}
        </div>
      </AddressRules>
    )
  }
}

PickupContent.propTypes = {
  loading: PropTypes.bool,
  orderFormContext: contextPropTypes,
  onConfirm: PropTypes.func.isRequired,
}

export default orderFormConsumer(PickupContent)
