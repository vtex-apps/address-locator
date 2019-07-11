import React, { useCallback, useState, useRef } from 'react'
import Spinner from 'vtex.styleguide/Spinner'
import { useModal } from 'vtex.modal/ModalContext'
import { ExtensionPoint } from 'vtex.render-runtime'

import { useAddress, withAddressProvider } from '../AddressContext'

import AddressList from './AddressList'
import '../../global.css'
import transformAnimationStyle from '../../utils/transformAnimationStyle'

/**
 * Component responsible for displaying and managing user's address using address.
 */

const ChangeAddress = () => {
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
      className="overflow-hidden relative br2 flex items-center nh6 nh8-ns nb8 pa8 nt5 nt6-ns"
      style={{
        minHeight: isPickupOpen ? '75vh' : '50vh',
      }}
      ref={wrapperRef}
    >
      <div style={transformAnimationStyle('110%', isPickupOpen)}>
        <ExtensionPoint
          id="address-search"
          onUpdateOrderForm={handleOrderFormUpdated}
        />
        <ExtensionPoint
          id="pickup-selector"
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
