import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Query, compose } from 'react-apollo'
import { orderFormConsumer, contextPropTypes } from 'vtex.store/OrderFormContext'
import addValidation from '@vtex/profile-form/lib/modules/addValidation'

import ProfileRules from './ProfileRules'
import Loader from './Loader'
import AddressRedeemForm from './AddressRedeemForm'
import documentsQuery from '../queries/documents.gql'

const countries = {
  BRA: {
    icon: 'brazil.svg',
    code: 55,
  },
}

/**
 * Component responsible for retrieving the user's address by his phone number
 */
class AddressRedeem extends Component {
  static propTypes = {
    /* Context used to call address mutation and retrieve the orderForm */
    orderFormContext: contextPropTypes,
    /* Event handler for when the user is identified */
    onOrderFormUpdated: PropTypes.func,
    /* Context used to call address mutation and retrieve the orderForm */
    orderFormContext: contextPropTypes,
  }

  state = {
    selectedCountry: countries.BRA,
    profile: null,
    loading: true,
  }

  updateProfile = async ({ email }) => {
    const { orderFormContext, onOrderFormUpdated } = this.props

    orderFormContext.updateOrderFormProfile({
      variables: {
        orderFormId: orderFormContext.orderForm.orderFormId,
        fields: { email },
      },
    })

    onIdentified && onIdentified(data)
  }

  handleSubmit = async data => {
    const { profile } = this.state

    this.setState({ isLoading: true })

    const profileNotFoundError = {
      ...profile,
      homePhone: { ...profile.homePhone, error: 'NOT_FOUND' },
    }

    if (profile.homePhone.error) {
      return this.setState({
        profile: profileNotFoundError,
        isLoading: false,
      })
    }

    try {
      if (!data.documents) return this.setState({ errorMessage: profileNotFoundError })
      if (!data.documents[0]) throw new Error('Profile not found')

      const { value: email } = data.documents[0].fields.find(item => item.key === 'email')
      return await this.updateProfile({ email })
    } catch (e) {
      return this.setState({
        profile: profileNotFoundError,
        isLoading: false,
      })
    }
  }

  handleFieldUpdate = field => this.setState(state => ({ profile: { ...state.profile, ...field } }))

  getLoadingStatus = () => {
    const { orderFormContext, ruleContext } = this.props
    return orderFormContext.loading || ruleContext.loading
  }

  componentDidUpdate({ ruleContext }, { loading }) {
    if (loading && !this.getLoadingStatus())
      this.setState({
        profile: addValidation({ homePhone: '' }, ruleContext.rules),
        loading: false,
      })
  }

  render() {
    const { selectedCountry, profile, loading } = this.state
    const {
      ruleContext: { rules },
    } = this.props

    if (loading)
      return (
        <div className="pv7 ph6 br2 bg-white">
          <Loader style={{ width: '100%', height: '100%' }} />
        </div>
      )

    return (
      <Query
        query={documentsQuery}
        variables={{
          acronym: 'CL',
          fields: ['email'],
          where: `homePhone=+${selectedCountry.code}${profile.homePhone.value.replace(/\D/g, '')}`,
        }}
        skip={!profile.homePhone.touched || Boolean(profile.homePhone.error)}
      >
        {({ loading, data }) => (
          <AddressRedeemForm
            {...{
              rules,
              profile,
              data,
              loading,
              country: selectedCountry,
              onSubmit: this.handleSubmit,
              onFieldUpdate: this.handleFieldUpdate,
            }}
          />
        )}
      </Query>
    )
  }
}

export default compose(
  ProfileRules,
  orderFormConsumer
)(AddressRedeem)
