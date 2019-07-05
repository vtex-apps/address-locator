import React, { useState, useCallback, Fragment } from 'react'
import PropTypes from 'prop-types'
import { Button, Spinner, Modal } from 'vtex.styleguide'
import { AddressRules } from 'vtex.address-form'
import { useRuntime } from 'vtex.render-runtime'
import { createPortal } from 'react-dom'
import { FormattedMessage } from 'react-intl'

import { useAddress } from '../AddressContext'
import PickupModalContainer from './PickupModalContainer'
import transformAnimationStyle from '../../utils/transformAnimationStyle'

const PickupWrapper = ({ children, parentRef, closeModal }) => {
  if (!parentRef.current) {
    return (
      <Modal centered isOpen onClose={closeModal} showTopBar={false}>
        <div className="vw-90 vh-80">{children}</div>
      </Modal>
    )
  }

  return createPortal(children, parentRef.current)
}

const PickupSelector = ({
  loading,
  onConfirm,
  onFindPickupClick,
  isPickupOpen,
  parentRef,
  closeModal,
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

  if (!isPickupOpen) {
    return (
      <Fragment>
        <Button variation="tertiary" block onClick={onFindPickupClick}>
          <FormattedMessage id="address-locator.pickup-button" />
        </Button>
      </Fragment>
    )
  }
  const isLoading = isFetching || loading
  const animationStyle = !!parentRef.current
    ? {
        left: '100%',
        ...transformAnimationStyle('100%', isPickupOpen),
      }
    : {}

  return (
    <PickupWrapper parentRef={parentRef} closeModal={closeModal}>
      {
        <AddressRules country={country} shouldUseIOFetching>
          <div
            className="w-100 center flex flex-column justify-center items-center pa6"
            style={animationStyle}
          >
            {isLoading ? (
              <div className="w-100 h-100 flex items-center justify-center">
                <Spinner />
              </div>
            ) : (
              <PickupModalContainer handlePickedSLA={onHandlePickedSLA} />
            )}
          </div>
        </AddressRules>
      }
    </PickupWrapper>
  )
}

PickupSelector.propTypes = {
  loading: PropTypes.bool,
  onConfirm: PropTypes.func.isRequired,
  onFindPickupClick: PropTypes.func,
  isPickupOpen: PropTypes.bool,
  parentRef: PropTypes.shape({ current: PropTypes.instanceOf(PropTypes.any) }),
  closeModal: PropTypes.func,
}

export default PickupSelector
