import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { templateParser, templateFormatter, parseDigit, ReactInput } from 'input-format'
import Input from 'vtex.styleguide/Input'

import PhoneInputIcon from './PhoneInputIcon'
import withImage from './withImage'

class PhoneInput extends Component {
  static propTypes = {
    label: PropTypes.string.isRequired,
    errorMessage: PropTypes.string,
    country: PropTypes.shape({
      icon: PropTypes.string.isRequired,
      code: PropTypes.number.isRequired,
      template: PropTypes.string.isRequired,
    }).isRequired,
    onChange: PropTypes.func.isRequired,
    value: PropTypes.string.isRequired,
  }

  Icon = withImage(() => this.props.country.icon)(PhoneInputIcon)

  render() {
    const {
      country: { code, template },
      onChange,
      value,
      errorMessage,
      label,
    } = this.props

    return (
      <div className="input-wrapper input-wrapper--icon-left mb5">
        <ReactInput
          format={templateFormatter(template)}
          parse={templateParser(template, parseDigit)}
          inputComponent={Input}
          placeholder={template.replace(/x/g, '9')}
          size="large"
          type="text"
          name="phone"
          {...{ onChange, value, errorMessage, label }}
        />
        <this.Icon countryCode={code} />
      </div>
    )
  }
}

export default PhoneInput
