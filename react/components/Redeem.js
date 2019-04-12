import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { find, head, path, prop, propEq } from 'ramda'
import { compose, withApollo } from 'react-apollo'
import { contextPropTypes } from 'vtex.store-resources/OrderFormContext'
import { modules } from 'vtex.profile-form'

import AddressRedeemForm from './RedeemForm'
import documentsQuery from '../queries/documents.gql'
import getCountryDialCode from '../utils/getCountryDialCode'

const { addValidation } = modules
const getCountryCode = path(['orderForm', 'storePreferencesData', 'countryCode'])

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
    profile: addValidation({ homePhone: '' }, this.props.rules),
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
      state: { profile },
      props: { client, orderFormContext, },
    } = this
    if (profile.homePhone.error) return

    this.setState({ queryLoading: true })

    const countryCode = getCountryCode(orderFormContext)

    try {
      const { data = { documents: [] } } = await client.query({
        query: documentsQuery,
        variables: {
          acronym: 'CL',
          fields: ['email'],
          where: `homePhone=+${getCountryDialCode(countryCode)}${profile.homePhone.value.replace(/\D/g, '')}`,
        },
      })
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

  render() {
    const { profile, queryLoading } = this.state
    const { rules, orderFormContext } = this.props
    return (
      <AddressRedeemForm
        {...{
          rules,
          profile,
          loading: queryLoading,
          country: getCountryCode(orderFormContext),
          onSubmit: this.handleSubmit,
          onFieldUpdate: this.handleFieldUpdate,
        }}
      />
    )
  }
}

export default compose(
  withApollo,
)(AddressRedeem)
