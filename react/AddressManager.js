import React from 'react'
import {
  orderFormConsumer,
  contextPropTypes,
} from 'vtex.store/OrderFormContext'

const AddressManager = (props) => {
  const { street, number } = props.orderFormContext.orderForm.shippingData.address

  return (
    <div className="address-manager">
      <p>{`${street}, ${number}`}</p>
    </div>
  )
}

AddressManager.propTypes = {
  /* Context used to call address mutation and retrieve the orderForm */
  orderFormContext: contextPropTypes,
}

export default orderFormConsumer(AddressManager)
