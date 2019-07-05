import React, { useMemo } from 'react'
import { graphql, compose } from 'react-apollo'
import { pick } from 'ramda'

import {
  updateOrderFormProfile,
  updateOrderFormShipping,
  updateOrderFormCheckin,
} from 'vtex.store-resources/Mutations'
import { address as addressQuery } from 'vtex.store-resources/Queries'

import AddressContext from './AddressContext'

const AddressOrderFormProvider = ({
  children,
  updateOrderFormProfile,
  updateOrderFormShipping,
  updateOrderFormCheckin,
  addressQuery,
}) => {
  const value = useMemo(() => {
    return {
      address: {
        ...pick(['orderForm', 'loading', 'refetch'], addressQuery),
        updateOrderFormProfile,
        updateOrderFormShipping,
        updateOrderFormCheckin,
      },
    }
  }, [addressQuery])
  return (
    <AddressContext.Provider value={value}>{children}</AddressContext.Provider>
  )
}

const optionsRefetch = {
  refetchQueries: [{ query: addressQuery }],
}

export default compose(
  graphql(addressQuery, { name: 'addressQuery' }),
  graphql(updateOrderFormProfile, {
    name: 'updateOrderFormProfile',
    options: optionsRefetch,
  }),
  graphql(updateOrderFormShipping, {
    name: 'updateOrderFormShipping',
    options: optionsRefetch,
  }),
  graphql(updateOrderFormCheckin, {
    name: 'updateOrderFormCheckin',
    options: optionsRefetch,
  })
)(AddressOrderFormProvider)
