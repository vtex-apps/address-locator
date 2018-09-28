import React from 'react'
import { injectIntl, intlShape } from 'react-intl'
import Input from 'vtex.styleguide/Input'
import Button from 'vtex.styleguide/Button'

const AddressRedeem = ({ intl }) => {
  const label = intl.formatMessage({ id: 'address-locator.address-redeem-label' })
  const buttonText = intl.formatMessage({ id: 'address-locator.address-redeem-button' })

  return (
    <div className="w-100">
      <Input type="text" size="large" label={label} />
      <Button>{buttonText}</Button>
    </div>
  )
}

AddressRedeem.propTypes = {
  intl: intlShape.isRequired,
}

export default injectIntl(AddressRedeem)
