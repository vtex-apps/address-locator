
import React, { useMemo } from 'react'
import { graphql, compose } from 'react-apollo'
import { pick, path } from 'ramda'

import {
  updateOrderFormProfile,
  updateOrderFormShipping,
  updateOrderFormCheckin,
} from 'vtex.store-resources/Mutations'

import orderForm from '../queries/orderForm.gql'

import AddressContext from './AddressContext'

const AddressOrderFormProvider = ({ children, updateOrderFormProfile, updateOrderFormShipping, updateOrderFormCheckin, orderFormQuery }) => {
  const orderFormId = path(['orderForm', 'cacheId'], orderFormQuery)
  const value = useMemo(() => {
    return {
      address: {
        ...pick(['orderForm', 'loading', 'refetch'], orderFormQuery),
        updateOrderFormProfile,
        updateOrderFormShipping,
        updateOrderFormCheckin,
      }
    }
  }, [orderFormId, orderFormQuery.loading])
  return <AddressContext.Provider value={value}>{children}</AddressContext.Provider>
}

export default compose(
  graphql(orderForm, { name: 'orderFormQuery', options: { ssr: false } }),
  graphql(updateOrderFormProfile, { name: 'updateOrderFormProfile' }),
  graphql(updateOrderFormShipping, { name: 'updateOrderFormShipping' }),
  graphql(updateOrderFormCheckin, { name: 'updateOrderFormCheckin' }),
)(AddressOrderFormProvider)
