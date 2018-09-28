import React from 'react'
import Input from 'vtex.styleguide/Input'
import Button from 'vtex.styleguide/Button'

const AddressRedeem = () => (
  <div className="w-100">
    <Input type="text" size="large" label="Insert your phone below" />
    <Button>Find address</Button>
  </div>
)

export default AddressRedeem
