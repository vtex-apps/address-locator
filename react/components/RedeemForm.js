import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { find, propEq } from 'ramda'
import { FormattedMessage } from 'react-intl'
import Button from 'vtex.styleguide/Button'
import ProfileField from '@vtex/profile-form/lib/ProfileField'

import StyleguideInput from './StyleguideInput'
import TextWithImage from './TextWithImage'
import withImage from './withImage'

class AddressRedeemForm extends Component {
  static propTypes = {
    /* Query loading state */
    loading: PropTypes.bool.isRequired,
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
    onFieldUpdate: PropTypes.func.isRequired,
    /* Profile Form rules object for the store country */
    rules: PropTypes.shape({
      country: PropTypes.string,
      personalFields: PropTypes.arrayOf(
        PropTypes.shape({
          display: PropTypes.func,
          label: PropTypes.string,
          mask: PropTypes.func,
          maxLength: PropTypes.number,
          name: PropTypes.string,
          submit: PropTypes.func,
          validate: PropTypes.func,
        })
      ),
    }).isRequired,
    profile: PropTypes.shape({
      homePhone: PropTypes.shape({
        value: PropTypes.string,
        touched: PropTypes.bool,
        error: PropTypes.string,
      }),
    }).isRequired,
  }

  Icon = withImage(() => this.props.country.icon)(TextWithImage)

  render() {
    const {
      loading,
      country: { code },
      rules,
      profile,
      onFieldUpdate,
      onSubmit,
    } = this.props

    const homePhoneField = {
      ...find(propEq('name', 'homePhone'), rules.personalFields),
      required: true,
    }

    const profilePhone = profile[homePhoneField.name]

    return (
      <form
        className="vtex-address-locator__address-redeem w-100 pv7 ph6 br2 bg-white"
        onSubmit={onSubmit}
      >
        <div className="mb5 relative input--icon-left">
          <h2 className="vtex-address-modal__recurring-title f4 pb5 c-muted-2">
            <FormattedMessage id="address-locator.address-redeem-recurring" />
          </h2>
          <ProfileField
            key={homePhoneField.name}
            field={homePhoneField}
            data={profilePhone}
            onFieldUpdate={onFieldUpdate}
            options={{
              placeholder: '(99) 99999-9999',
              size: 'large',
              inputmode: 'numeric',
              type: 'tel',
              prefix: <this.Icon text={`+${code}`} />,
            }}
            Input={StyleguideInput}
          />
        </div>
        <Button
          type="submit"
          isLoading={loading}
          disabled={!profilePhone.touched || !!profilePhone.error}
        >
          <FormattedMessage id="address-locator.address-redeem-button" />
        </Button>
      </form>
    )
  }
}

export default AddressRedeemForm
