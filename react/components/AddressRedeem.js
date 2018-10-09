import React from 'react'
import { injectIntl, intlShape } from 'react-intl'

import BrazilInputIcon from './BrazilInputIcon'
import Input from 'vtex.styleguide/Input'
import Button from 'vtex.styleguide/Button'

const AddressRedeem = ({ intl }) => {
  const label = intl.formatMessage({ id: 'address-locator.address-redeem-label' })
  const buttonText = intl.formatMessage({ id: 'address-locator.address-redeem-button' })

  return (
    <div className="w-100">
      <div className="relative vtex-input--icon-left">
        <Input type="text" size="large" placeholder="(99) 99999-9999" label={label} />
        <BrazilInputIcon />
      </div>
      <Button>{buttonText}</Button>
    </div>
  )
}

AddressRedeem.propTypes = {
  intl: intlShape.isRequired,
}

export default injectIntl(AddressRedeem)
