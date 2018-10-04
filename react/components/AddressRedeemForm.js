import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import Button from 'vtex.styleguide/Button'
import ProfileField from '@vtex/profile-form/lib/ProfileField'
import StyleguideInput from './StyleguideInput'

import PhoneInputIcon from './PhoneInputIcon'
import withImage from './withImage'

class AddressRedeemForm extends Component {
  static propTypes = {
    /* Query loading state */
    loading: PropTypes.bool.isRequired,
    /* Query documents data */
    data: PropTypes.shape({
      documents: PropTypes.arrayOf(
        PropTypes.shape({
          fields: PropTypes.arrayOf(
            PropTypes.shape({ key: PropTypes.string, value: PropTypes.string })
          ),
        })
      ),
    }),
    /* Submit event handler */
    onSubmit: PropTypes.func.isRequired,
    /* Input error message */
    errorMessage: PropTypes.string,
    /* Country info object to format the Input */
    country: PropTypes.shape({
      icon: PropTypes.string.isRequired,
      code: PropTypes.number.isRequired,
    }).isRequired,
    /* Input change event handler */
    onFieldUpdate: PropTypes.func.isRequired
  }

  Icon = withImage(() => this.props.country.icon)(PhoneInputIcon)

  handleSubmit = e => {
    e.preventDefault()
    this.props.onSubmit(this.props.data)
  }

  render() {
    const {
      loading,
      country: { code },
      rules,
      profile,
      onFieldUpdate,
    } = this.props

    const homePhoneField = {
      ...rules.personalFields.find(i => i.name === 'homePhone'),
      required: true,
    }

    const profilePhone = profile[homePhoneField.name]

    return (
      <form className="w-100" onSubmit={this.handleSubmit}>
        <div className="mb5 relative input--icon-left">
          <ProfileField
            key={homePhoneField.name}
            field={homePhoneField}
            data={profilePhone}
            onFieldUpdate={onFieldUpdate}
            options={{
              placeholder: '(99) 99999-9999',
              size: 'large',
            }}
            Input={StyleguideInput}
          />
          <this.Icon countryCode={code} />
        </div>
        <Button type="submit" isLoading={loading}>
          <FormattedMessage id="address-locator.address-redeem-button" />
        </Button>
      </form>
    )
  }
}

export default AddressRedeemForm
