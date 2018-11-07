import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { find, head, prop, propEq } from 'ramda'
import { compose, withApollo } from 'react-apollo'
import { contextPropTypes } from 'vtex.store/OrderFormContext'
import addValidation from '@vtex/profile-form/lib/modules/addValidation'

import ProfileRules from './ProfileRules'
import Loader from './Loader'
import AddressRedeemForm from './RedeemForm'
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
    contextLoading: true,
    queryLoading: false,
  }

  updateProfile = async ({ email }) => {
    const { orderFormContext, onOrderFormUpdated } = this.props

    const data = await orderFormContext.updateOrderFormProfile({
      variables: {
        orderFormId: orderFormContext.orderForm.orderFormId,
        fields: { email },
      },
    })

    onOrderFormUpdated && onOrderFormUpdated(data)
  }

  handleSubmit = async e => {
    e.preventDefault()

    const {
      state: { profile, selectedCountry },
      props: { client },
    } = this
    if (profile.homePhone.error) return

    this.setState({ queryLoading: true })

    const { data = { documents: [] } } = await client.query({
      query: documentsQuery,
      variables: {
        acronym: 'CL',
        fields: ['email'],
        where: `homePhone=+${selectedCountry.code}${profile.homePhone.value.replace(/\D/g, '')}`,
      },
    })

    try {
      const fields = prop('fields', head(data.documents))
      if (!fields) throw new Error('Profile not found')

      const { value: email } = find(propEq('key', 'email'), fields)
      await this.updateProfile({ email })
      this.setState({ queryLoading: false })
    } catch (e) {
      this.setState({
        profile: {
          ...profile,
          homePhone: { ...profile.homePhone, error: 'NOT_FOUND' },
        },
        queryLoading: false,
      })
    }
  }

  handleFieldUpdate = field => this.setState(state => ({ profile: { ...state.profile, ...field } }))

  getContextLoadingStatus = () => {
    const { orderFormContext, ruleContext } = this.props
    return orderFormContext.loading || ruleContext.loading
  }

  componentDidUpdate({ ruleContext }, { contextLoading }) {
    if (contextLoading && !this.getContextLoadingStatus())
      this.setState({
        profile: addValidation({ homePhone: '' }, ruleContext.rules),
        contextLoading: false,
      })
  }

  render() {
    const { selectedCountry, profile, contextLoading, queryLoading } = this.state
    const { ruleContext: { rules } } = this.props

    if (contextLoading)
      return (
        <div className="pv7 ph6 br2 bg-white">
          <Loader style={{ width: '100%', height: '100%' }} />
        </div>
      )

    return (
      <div>
        <AddressRedeemForm
          {...{
            rules,
            profile,
            loading: queryLoading,
            country: selectedCountry,
            onSubmit: this.handleSubmit,
            onFieldUpdate: this.handleFieldUpdate,
          }}
        />
      </div>
    )
  }
}

export default compose(
  ProfileRules,
  withApollo
)(AddressRedeem)
