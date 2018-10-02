import React, { Component } from 'react'
import { FormattedMessage } from 'react-intl'
import {
  templateParser,
  templateFormatter,
  parseDigit,
  ReactInput,
} from 'input-format'
import { adopt } from 'react-adopt'
import Phone from '@vtex/phone'
import PhoneBrazil from '@vtex/phone/countries/BRA'
import Input from 'vtex.styleguide/Input'
import Button from 'vtex.styleguide/Button'

import PhoneInputIcon from './PhoneInputIcon'
import withImage from './withImage'

const InputMessages = adopt({
  label: <FormattedMessage id="address-locator.address-redeem-label" />,
  errorMessage: <FormattedMessage id="address-locator.address-redeem-error" />,
})

const countries = {
  BRA: {
    icon: 'brazil.svg',
    code: 55,
    template: '(xx) xxxxx-xxxx',
  },
}

class AddressRedeem extends Component {
  state = {
    selectedCountry: countries.BRA,
    phone: '',
    error: false,
  }

  Icon = withImage(() => this.state.selectedCountry.icon)(PhoneInputIcon)

  handlePhoneChange = phone => this.setState({ phone, error: false })
  
  handleSubmit = e => {
    e.preventDefault()

    const {
      phone,
      selectedCountry: { code },
    } = this.state

    const national = Phone.validate(phone, code)
    if (!national) return this.setState({ error: true })

    this.setState({ error: false })
  }

  render() {
    const {
      selectedCountry: { code, template },
      phone,
      error,
    } = this.state

    return (
      <form className="w-100" onSubmit={this.handleSubmit}>
        <div className="input-wrapper input-wrapper--icon-left">
          <InputMessages>
            {({ label, errorMessage }) => (
              <ReactInput
                value={phone}
                onChange={phone => this.setState({ phone })}
                format={templateFormatter(template)}
                parse={templateParser(template, parseDigit)}
                inputComponent={Input}
                label={label}
                placeholder={template.replace(/x/g, '9')}
                size="large"
                type="text"
                name="phone"
                errorMessage={error ? errorMessage : null}
              />
            )}
          </InputMessages>
          <this.Icon countryCode={code} />
        </div>
        <Button type="submit">
          <FormattedMessage id="address-locator.address-redeem-button" />
        </Button>
      </form>
    )
  }
}

export default AddressRedeem
