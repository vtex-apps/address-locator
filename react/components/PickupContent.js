import React, { memo, useState } from 'react'
import PropTypes from 'prop-types'
import { Spinner } from 'vtex.styleguide'
import { AddressRules } from 'vtex.address-form'

import { useAddress } from './AddressContext'
import PickupModalContainer from './PickupModalContainer'

const PickupContent = ({ loading, onOrderFormUpdated, onConfirm }) => {
  const [isFetching, setFetching] = useState(false)
  const { address } = useAddress()

  const onHandlePickedSLA = async (pickupPoint) => {
    setFetching(true)
    try {
      await address.updateOrderFormCheckin({
        variables: {
          orderFormId: address.orderForm.orderFormId,
          checkin: { isCheckedIn: true, pickupPointId: pickupPoint.id },
        },
      })
    } catch (err) {
      // Show user that pickup point choice failed?
    }

    setFetching(false)
    if (onOrderFormUpdated) {
      onOrderFormUpdated()
    }

    onConfirm && onConfirm()
  }

  const { storePreferencesData } = address.orderForm
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
          handlePickedSLA={onHandlePickedSLA}
        />
      )}
      </div>
    </AddressRules>
  )
}

PickupContent.propTypes = {
  loading: PropTypes.bool,
  onConfirm: PropTypes.func.isRequired,
  onOrderFormUpdated: PropTypes.func,
}

export default memo(PickupContent)
