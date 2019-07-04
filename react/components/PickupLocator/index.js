import React, { useState, useCallback, Fragment } from 'react'
import PropTypes from 'prop-types'
import { Button, Spinner } from 'vtex.styleguide'
import { AddressRules } from 'vtex.address-form'
import { useRuntime } from 'vtex.render-runtime'
import { createPortal } from 'react-dom'

import { useAddress } from '../AddressContext'
import PickupModalContainer from './PickupModalContainer'
import transformAnimationStyle from '../../utils/transformAnimationStyle'

const PickupLocator = ({
  loading,
  onConfirm,
  onFindPickupClick,
  isPickupOpen,
  parentRef,
}) => {
  const [isFetching, setFetching] = useState(false)
  const { address } = useAddress()
  const {
    culture: { country },
  } = useRuntime()

  const onHandlePickedSLA = useCallback(
    async pickupPoint => {
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
      onConfirm && onConfirm()
    },
    [setFetching, address, onConfirm]
  )
  console.log('teste OPAAA isPickupOpen', isPickupOpen)
  if (!isPickupOpen) {
    return (
      <Fragment>
        <Button variation="tertiary" block onClick={onFindPickupClick}>
          <span>FIND PICKUP</span>
          {/* <FormattedMessage id="address-locator.pickup-button" /> */}
        </Button>
      </Fragment>
    )
  }
  console.log('teste OI')
  const isLoading = isFetching || loading

  return createPortal(
    <AddressRules country={country} shouldUseIOFetching>
      <div className="absolute top-0 left-0 w-100 h-100 center flex flex-column justify-center items-center pa6 teste-portal">
        {isLoading ? (
          <div className="w-100 h-100 flex items-center justify-center">
            <Spinner />
          </div>
        ) : (
          <PickupModalContainer handlePickedSLA={onHandlePickedSLA} />
        )}
      </div>
    </AddressRules>,
    parentRef.current
  )

  return (
    <div
      className="absolute w-100 h-100 top-0 flex"
      style={{
        left: '100%',
        ...transformAnimationStyle('100%', isPickupOpen),
      }}
    >
      <AddressRules country={country} shouldUseIOFetching>
        <div className="w-100 center flex flex-column justify-center items-center pa6">
          {isLoading ? (
            <div className="w-100 h-100 flex items-center justify-center">
              <Spinner />
            </div>
          ) : (
            <PickupModalContainer handlePickedSLA={onHandlePickedSLA} />
          )}
        </div>
      </AddressRules>
    </div>
  )
}

{
  /* <div
        className="absolute w-100 h-100 top-0 flex"
        style={{
          left: '100%',
          ...transformAnimationStyle('100%', isPickupOpen),
        }}
      >
        {pickupPage}
      </div> */
}

PickupLocator.propTypes = {
  loading: PropTypes.bool,
  onConfirm: PropTypes.func.isRequired,
}

export default PickupLocator
