import React, { useMemo } from 'react'
import PropTypes from 'prop-types'
import { find, propEq } from 'ramda'
import { FormattedMessage } from 'react-intl'
import Button from 'vtex.styleguide/Button'
import { ProfileField } from 'vtex.profile-form'
import convertIso3To2 from 'country-iso-3-to-2'
import examples from 'libphonenumber-js/examples.mobile.json'
import { getExampleNumber } from 'libphonenumber-js'
import { useRuntime } from 'vtex.render-runtime'

import StyleguideInput from '../StyleguideInput'
import CountryIcon from './CountryIcon'

const isDisabled = profilePhone =>
  !profilePhone.value || !profilePhone.value.length

const AddressRedeemForm = ({
  loading,
  rules,
  profile,
  onFieldUpdate,
  onSubmit,
}) => {
  const {
    culture: { country },
  } = useRuntime()
  const countryIso2 = convertIso3To2(country)
  const phonePlaceholder = useMemo(
    () => getExampleNumber(countryIso2, examples).formatNational(),
    [country]
  )
  const homePhoneField = {
    ...find(propEq('name', 'homePhone'), rules.personalFields),
    required: true,
  }

  const profilePhone = profile[homePhoneField.name]
  return (
    <form
      className="vtex-address-locator__address-redeem w-100"
      onSubmit={onSubmit}
    >
      <div className="mb5 relative input--icon-left">
        <ProfileField
          field={homePhoneField}
          data={profilePhone}
          onFieldUpdate={onFieldUpdate}
          options={{
            placeholder: phonePlaceholder,
            size: 'large',
            inputmode: 'numeric',
            type: 'tel',
            prefix: <CountryIcon country={countryIso2} size={20} />,
          }}
          Input={StyleguideInput}
        />
      </div>
      <Button
        type="submit"
        isLoading={loading}
        disabled={isDisabled(profilePhone)}
        block
      >
        <FormattedMessage id="store/address-locator.address-redeem-button" />
      </Button>
    </form>
  )
}

AddressRedeemForm.propTypes = {
  /* Query loading state */
  loading: PropTypes.bool.isRequired,
  /* Submit event handler */
  onSubmit: PropTypes.func.isRequired,
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

export default AddressRedeemForm
