import React, { useState } from 'react'
import { find, head, prop, propEq, path } from 'ramda'
import { withApollo } from 'react-apollo'
import { modules } from 'vtex.profile-form'
import { useRuntime } from 'vtex.render-runtime'

import AddressRedeemForm from './AddressRedeemForm'
import documentsQuery from '../../queries/documents.gql'
import getCountryDialCode from '../../utils/getCountryDialCode'
import { useAddress } from '../AddressContext'

const { addValidation } = modules

/**
 * Component responsible for retrieving the user's address by his phone number
 */

const AddressRedeemQueryWrapper = ({ rules, client }) => {
  const {
    culture: { country },
  } = useRuntime()
  const { address } = useAddress()
  const [queryLoading, updateQueryLoading] = useState(false)
  const [profile, updateProfile] = useState(() =>
    addValidation({ homePhone: '' }, rules)
  )

  const handleFieldUpdate = field =>
    updateProfile(oldProfile => ({ ...oldProfile, ...field }))

  const updateAddressProfile = async ({ email }) => {
    let hasError = false
    try {
      const response = await address.updateOrderFormProfile({
        variables: {
          orderFormId: address.orderForm.orderFormId,
          fields: { email },
        },
      })
      hasError = Boolean(
        path(['data', 'updateOrderFormProfile', 'orderForm'], response)
      )
    } catch (e) {
      hasError = true
    }
    if (hasError) {
      // Show error to user
    }
  }

  const handleSubmit = async e => {
    e.preventDefault()
    if (profile.homePhone.error) {
      return
    }
    updateQueryLoading(true)

    try {
      const { data = { documents: [] } } = await client.query({
        query: documentsQuery,
        variables: {
          acronym: 'CL',
          fields: ['email'],
          where: `homePhone=+${getCountryDialCode(
            country
          )}${profile.homePhone.value.replace(/\D/g, '')}`,
        },
      })
      const fields = prop('fields', head(data.documents))
      if (!fields) throw new Error('Profile not found')

      const { value: email } = find(propEq('key', 'email'), fields)
      await updateAddressProfile({ email })
    } catch (e) {
      updateProfile(oldProfile => ({
        ...oldProfile,
        homePhone: { ...oldProfile.homePhone, error: 'NOT_FOUND' },
      }))
    }
    updateQueryLoading(false)
  }

  return (
    <AddressRedeemForm
      rules={rules}
      profile={profile}
      loading={queryLoading}
      country={country}
      onSubmit={handleSubmit}
      onFieldUpdate={handleFieldUpdate}
    />
  )
}

export default withApollo(AddressRedeemQueryWrapper)
