import React, { useCallback, useState, useRef } from 'react'
import Spinner from 'vtex.styleguide/Spinner'
import { useModal } from 'vtex.modal/ModalContext'

import { useAddress, withAddressProvider } from '../AddressContext'

import AddressList from './AddressList'
import AddressSearch from '../AddressSearch'
import PickupLocator from '../PickupLocator'
import '../../global.css'
import transformAnimationStyle from '../../utils/transformAnimationStyle'

/**
 * Component responsible for displaying and managing user's address using address.
 */

const ChangeAddress = ({}) => {
  const { address } = useAddress()
  const { closeModal } = useModal()
  const [isPickupOpen, setPickupOpen] = useState(false)
  const [isLoading, setLoading] = useState(false)
  const wrapperRef = useRef(null)

  const handleSelectAddress = useCallback(
    async setAddress => {
      const { orderFormId } = address.orderForm
      setLoading(true)
      const orderForm = await address
        .updateOrderFormShipping({
          variables: {
            orderFormId,
            address: setAddress,
          },
        })
        .catch(() => null)
      setLoading(false)
      if (!orderForm) {
        // TODO: Display error
      }
      closeModal && closeModal()
    },
    [address, closeModal]
  )

  const handleOrderFormUpdated = useCallback(() => {
    closeModal && closeModal()
  }, [closeModal])

  const handlePickupConfirm = useCallback(() => {
    setPickupOpen(false)
    handleOrderFormUpdated()
  }, [handleOrderFormUpdated, setPickupOpen])

  const handlePickupClick = useCallback(() => {
    setPickupOpen(true)
  }, [setPickupOpen])
  return (
    <div
      className="overflow-hidden relative br2 flex items-center"
      style={{
        margin: '0 -3rem -3rem -3rem',
        padding: '3rem',
        minHeight: isPickupOpen ? '75vh' : '50vh',
      }}
      ref={wrapperRef}
    >
      <div style={transformAnimationStyle('110%', isPickupOpen)}>
        <AddressSearch
          onPickupClick={handlePickupClick}
          onUpdateOrderForm={handleOrderFormUpdated}
        />
        <PickupLocator
          loading={isLoading}
          onConfirm={handlePickupConfirm}
          onFindPickupClick={handlePickupClick}
          isPickupOpen={isPickupOpen}
          parentRef={wrapperRef}
        />
        {!isLoading ? (
          <AddressList onSelectAddress={handleSelectAddress} />
        ) : (
          <div className="flex flex-grow-1 justify-center items-center">
            <Spinner />
          </div>
        )}
      </div>
    </div>
  )
}

export default withAddressProvider(ChangeAddress)
