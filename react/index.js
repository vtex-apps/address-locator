import React, { useEffect } from 'react'
import queryString from 'query-string'
import { head, path } from 'ramda'

import { useAddress, withAddressProvider } from './components/AddressContext'
import AddressPage from './components/AddressPage'

import './global.css'

const redirectToReturnURL = () => {
  try {
    const parsedQueryString = queryString.parse(window.location.search)
    const returnURL = parsedQueryString && parsedQueryString.returnUrl  || ''
    const cleanUrl = head(returnURL) === '/' ? returnURL : `/${returnURL}`
    window.location.href = cleanUrl
  } catch (e) {
    // Unable to redirect
  }
}

const AddressManager = props => {
  const { address } = useAddress()

  const checkIfAddressIsSet = () => {
    if (!!path(['orderForm', 'shippingData', 'address'], address)) {
      redirectToReturnURL()
    }
  }

  useEffect(() => {
    checkIfAddressIsSet()
  }, [address])
  return (
    <AddressPage {...props} onSelectAddress={redirectToReturnURL} />
  )
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
        'ui:widget': 'image-uploader'
      }
    },
  }
}

export default withAddressProvider(AddressManager)
