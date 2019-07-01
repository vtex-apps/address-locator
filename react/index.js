import React, { useEffect, useCallback } from 'react'
import { orderFormConsumer } from 'vtex.store-resources/OrderFormContext'
import AddressPage from './components/AddressPage'
import hoistNonReactStatics from 'hoist-non-react-statics'
import { head, path } from 'ramda'
import queryString from 'query-string'
import { useRuntime } from 'vtex.render-runtime'

import './global.css'

const redirectToReturnURL = navigate => {
  try {
    const parsedQueryString = queryString.parse(window.location.search)
    const returnURL = (parsedQueryString && parsedQueryString.returnUrl) || ''
    const cleanUrl = head(returnURL) === '/' ? returnURL : `/${returnURL}`
    navigate({
      to: cleanUrl,
    })
  } catch (e) {
    // Unable to redirect
  }
}

const AddressManager = ({ orderFormContext }) => {
  const { navigate } = useRuntime()

  const orderFormLoading = path(['orderForm', 'loading'], orderFormContext)
  const shippingData = path(['orderForm', 'shippingData'], orderFormContext)

  const handleSelectAddress = useCallback(() => {
    redirectToReturnURL(navigate)
  }, [navigate])

  useEffect(() => {
    if (shippingData && shippingData.address) {
      redirectToReturnURL(navigate)
    }
  }, [shippingData, navigate])

  if (orderFormLoading) {
    return <AddressPage loading />
  }

  if (!shippingData || !shippingData.address) {
    return <AddressPage onSelectAddress={handleSelectAddress} />
  }

  return null
}

AddressManager.schema = {
  title: 'address-locator.address-manager-title',
  description: 'address-locator.address-manager-description',
  type: 'object',
  properties: {
    logoUrl: {
      type: 'string',
      title: 'address-locator.address-manager.logo-title',
      widget: {
        'ui:widget': 'image-uploader',
      },
    },
  },
}

export default hoistNonReactStatics(
  orderFormConsumer(AddressManager),
  AddressManager
)
