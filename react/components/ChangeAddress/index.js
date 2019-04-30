import React, { useCallback, useState } from 'react'
import { graphql } from 'react-apollo'
import { compose } from 'ramda'
import gql from 'graphql-tag'
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

const ChangeAddress = ({ updateOrderFormShipping, updateOrderForm }) => {
  const { address } = useAddress()
  const { closeModal } = useModal()
  const [isPickupOpen, setPickupOpen] = useState(false)
  const [isLoading, setLoading] = useState(false)

  const handleSelectAddress = useCallback(async (setAddress) => {
    const { orderFormId } = address.orderForm

    setLoading(true)
    const orderForm = await updateOrderFormShipping(orderFormId, setAddress).catch(() => null)
    setLoading(false)
    if (!orderForm) {
      // TODO: Display error
    }
    closeModal && closeModal()
  }, [address])

  const handleOrderFormUpdated = useCallback(async () => {
    const orderFormResp = await address.refetch().catch(() => null)
    orderFormResp && updateOrderForm(orderFormResp.data.orderForm)
    closeModal && closeModal()
  }, [address])

  const handlePickupConfirm = useCallback(() => {
    setPickupOpen(false)
    handleOrderFormUpdated()
  }, [address])

  const handlePickupClick = useCallback(() => { setPickupOpen(true) }, [])

  const pickupPage = isPickupOpen ? (
    <PickupContent
      onConfirm={handlePickupConfirm}
      onUpdateOrderForm={handleOrderFormUpdated}
    />
  ) : null

  return (
    <div className="overflow-hidden relative br2"
      style={{
        margin: '-3rem',
        padding: '3rem',
      }}>
      <div
        style={{
          transition: 'transform 300ms',
          transform: `translate3d(${isPickupOpen ? '-100%' : '0'}, 0, 0)`
        }}>
        <AddressContent
          onPickupClick={handlePickupClick}
          onUpdateOrderForm={handleOrderFormUpdated} />
        {!isLoading ? (
          <AddressList onSelectAddress={handleSelectAddress} />
        ) : (
          <div className="flex flex-grow-1 justify-center items-center">
            <Spinner />
          </div>
        )}
      </div>
      <div className="absolute w-100 h-100 top-0" style={{
        left: '100%',
        transition: 'transform 300ms',
        transform: `translate3d(${isPickupOpen ? '-100%' : '0'}, 0, 0)`
      }}>
        {pickupPage}
      </div>
    </div>
  )

}

const withMutationShipping = graphql(
  gql`
    mutation updateOrderFormShipping($orderFormId: String, $address: Address) {
      updateOrderFormShipping(orderFormId: $orderFormId, address: $address) @client
    }
  `,
  {
    props: ({ mutate }) => ({
      updateOrderFormShipping: (orderFormId, address) => mutate({ variables: {orderFormId, address} }),
    }),
  }
)

const withMutationOrderFormUpdate = graphql(
  gql`
    mutation updateOrderForm($orderForm: [OrderForm]) {
      updateOrderForm(orderForm: $orderForm) @client
    }
  `,
  {
    name: 'updateOrderForm',
    props: ({ updateOrderForm }) => ({
      updateOrderForm: (orderForm) => updateOrderForm({ variables: {orderForm} }),
    }),
  }
)

const enhanced = compose(
  withAddressProvider,
  withMutationOrderFormUpdate,
  withMutationShipping,
)

export default enhanced(ChangeAddress)
