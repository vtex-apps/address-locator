import React, { useCallback, useState } from 'react'
import Spinner from 'vtex.styleguide/Spinner'
import { useModal } from 'vtex.modal/ModalContext'

import { useAddress, withAddressProvider } from '../AddressContext'

import AddressList from '../AddressList'
import AddressContent from '../AddressContent'
import PickupContent from '../PickupContent'
import '../../global.css'

/**
 * Component responsible for displaying and managing user's address using address.
 */

const ChangeAddress = ({}) => {
  const { address } = useAddress()
  const { closeModal } = useModal()
  const [isPickupOpen, setPickupOpen] = useState(false)
  const [isLoading, setLoading] = useState(false)

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

  const pickupPage = isPickupOpen ? (
    <PickupContent
      onConfirm={handlePickupConfirm}
      onUpdateOrderForm={handleOrderFormUpdated}
    />
  ) : null

  return (
    <div
      className="overflow-hidden relative br2"
      style={{
        margin: '-3rem',
        padding: '3rem',
      }}
    >
      <div
        style={{
          transition: 'transform 300ms',
          transform: `translate3d(${isPickupOpen ? '-100%' : '0'}, 0, 0)`,
        }}
      >
        <AddressContent
          onPickupClick={handlePickupClick}
          onUpdateOrderForm={handleOrderFormUpdated}
        />
        {!isLoading ? (
          <AddressList onSelectAddress={handleSelectAddress} />
        ) : (
          <div className="flex flex-grow-1 justify-center items-center">
            <Spinner />
          </div>
        )}
      </div>
      <div
        className="absolute w-100 h-100 top-0"
        style={{
          left: '100%',
          transition: 'transform 300ms',
          transform: `translate3d(${isPickupOpen ? '-100%' : '0'}, 0, 0)`,
        }}
      >
        {pickupPage}
      </div>
    </div>
  )
}

export default withAddressProvider(ChangeAddress)
