import React, { Component, Fragment } from 'react'
import { withApollo, compose, graphql } from 'react-apollo'
import { FormattedMessage, intlShape } from 'react-intl'
import Phone from '@vtex/phone'
import PhoneBrazil from '@vtex/phone/countries/BRA' //eslint-disable-line
import Button from 'vtex.styleguide/Button'
import { orderFormConsumer, contextPropTypes } from 'vtex.store/OrderFormContext'

import PhoneInput from './PhoneInput'
import documentsQuery from '../queries/documents.gql'

const countries = {
  BRA: {
    icon: 'brazil.svg',
    code: 55,
    template: '(xx) xxxxx-xxxx',
  },
}

class AddressRedeem extends Component {
  static propTypes = {
    /* Apollo client instance */
    client: PropTypes.object.isRequired,
    /* Context used to call address mutation and retrieve the orderForm */
    orderFormContext: contextPropTypes
  }

  static contextTypes = {
    intl: intlShape,
  }

  state = {
    selectedCountry: countries.BRA,
    phone: '',
    errorMessage: '',
  }

  updateProfile = async ({ email }) => {
    const { orderFormContext } = this.props

    const { data } = await orderFormContext.updateOrderFormProfile({
      variables: {
        orderFormId: orderFormContext.orderForm.orderFormId,
        fields: { email },
      },
    })

    /* TODO: user redirection */
  }

  handlePhoneChange = phone => this.setState({ phone, errorMessage: '' })

  handleSubmit = async e => {
    e.preventDefault()

    const {
      state: {
        phone,
        selectedCountry: { code },
      },
      props: { client, orderFormContext },
      context: { intl },
    } = this

    const invalidPhoneError = intl.formatMessage({
      id: 'address-locator.address-redeem-invalid-phone',
    })
    const profileNotFoundError = intl.formatMessage({
      id: 'address-locator.address-redeem-profile-not-found',
    })

    const valid = Phone.validate(phone, code)

    if (!valid)
      return this.setState({
        errorMessage: invalidPhoneError,
      })

    try {
      const { data } = await client.query({
        query: documentsQuery,
        variables: { acronym: 'CL', fields: ['email'], where: `homePhone=+${code}${phone}` },
      })

      if (!data.documents) return this.setState({ errorMessage: profileNotFoundError })

      const { email } = data.documents

      return await this.updateProfile({ email })
    } catch (e) {
      console.error(e)
      return this.setState({ errorMessage: profileNotFoundError })
    }

    this.setState({ errorMessage: '' })
  }

  render() {
    const { selectedCountry, phone, errorMessage } = this.state

    return (
      <form className="w-100" onSubmit={this.handleSubmit}>
        <FormattedMessage id="address-locator.address-redeem-label">
          {label => (
            <PhoneInput
              value={phone}
              country={selectedCountry}
              label={label}
              errorMessage={errorMessage}
              onChange={this.handlePhoneChange}
            />
          )}
        </FormattedMessage>
        <Button type="submit">
          <FormattedMessage id="address-locator.address-redeem-button" />
        </Button>
      </form>
    )
  }
}

export default compose(
  orderFormConsumer,
  withApollo
)(AddressRedeem)
