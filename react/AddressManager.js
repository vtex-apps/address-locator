import React from 'react'
import {
  orderFormConsumer,
  contextPropTypes,
} from 'vtex.store/OrderFormContext'
import ChangeAddressIcon from './components/ChangeAddressIcon'

const AddressManager = (props) => {
  if (!props.orderFormContext.orderForm.shippingData) {
    return null
  }
  const { street, number } = props.orderFormContext.orderForm.shippingData.address

  return (
    <div className="address-manager flex ph5 white">
      <p className="address-manager__title mr5 overflow-hidden nowrap">
        {`${street}, ${number}`}
      </p>
      <ChangeAddressIcon />
    </div>
  )
}

AddressManager.propTypes = {
  /* Context used to call address mutation and retrieve the orderForm */
  orderFormContext: contextPropTypes,
}

export default orderFormConsumer(AddressManager)
