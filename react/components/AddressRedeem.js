import React, { Component, createElement } from 'react'
import { Query } from 'react-apollo'
import { orderFormConsumer, contextPropTypes } from 'vtex.store/OrderFormContext'
import ProfileRules from '@vtex/profile-form/lib/ProfileRules'
import addValidation from '@vtex/profile-form/lib/modules/addValidation'
import RuleShape from '@vtex/profile-form/lib/RuleShape'

import AddressRedeemForm from './AddressRedeemForm'
import documentsQuery from '../queries/documents.gql'

const countries = {
  BRA: {
    icon: 'brazil.svg',
    code: 55,
  },
}

class AddressRedeem extends Component {
  static propTypes = {
    /* Context used to call address mutation and retrieve the orderForm */
    orderFormContext: contextPropTypes,
    /* Profile field rules */
    rules: RuleShape,
  }

  state = {
    selectedCountry: countries.BRA,
    profile: addValidation({ homePhone: '' }, this.props.rules),
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

  handleSubmit = async data => {
    const { profile } = this.state

    const profileNotFoundError = {
      ...profile,
      homePhone: { ...profile.homePhone, error: 'NOT_FOUND' },
    }

    if (Boolean(profile.homePhone.error)) return this.setState({ profile: profileNotFoundError })

    try {
      if (!data.documents) return this.setState({ errorMessage: profileNotFoundError })
      if (!data.documents[0]) throw new Error('Profile not found')

      const { value: email } = data.documents[0].fields.find(item => item.key === 'email')
      return await this.updateProfile({ email })
    } catch (e) {
      console.error(e)
      return this.setState({ profile: profileNotFoundError })
    }

    this.setState({ errorMessage: '' })
  }

  handleFieldUpdate = field => {
    field.homePhone.touched = true
    this.setState(prevState => ({
      profile: { ...prevState.profile, ...field },
    }))
  }

  render() {
    const { selectedCountry, profile } = this.state
    const { orderFormContext, rules } = this.props

    return (
      <Query
        query={documentsQuery}
        variables={{
          acronym: 'CL',
          fields: ['email'],
          where: `homePhone=+${selectedCountry.code}${profile.homePhone.value.replace(/\D/g, '')}`,
        }}
        skip={!Boolean(profile.homePhone.touched) || Boolean(profile.homePhone.error)}
      >
        {({ loading: documentLoading, data }) => (
          <AddressRedeemForm
            {...{
              rules,
              profile,
              data,
              country: selectedCountry,
              onSubmit: this.handleSubmit,
              onFieldUpdate: this.handleFieldUpdate,
              loading: documentLoading || orderFormContext.loading,
            }}
          />
        )}
      </Query>
    )
  }
}

/* NOTE: Couldn't use compose here because ProfileRules is not a HOC and does not play nicely with HOC's */
const ComposedAddressRedeem = () => (
  <ProfileRules country={global.__RUNTIME__.culture.country} shouldUseIOFetching>
    {createElement(orderFormConsumer(AddressRedeem))}
  </ProfileRules>
)

export default ComposedAddressRedeem
