import React, { memo, useEffect } from 'react'
import AddressPage from './AddressPage'
import { head, path } from 'ramda'
import queryString from 'query-string'
import { useAddress } from './AddressContext'
import '../global.css'

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

const RedirectManager = () => {
  const { address } = useAddress()

  const checkIfAddressIsSet = () => {
    if (!!path(['orderForm', 'shippingData', 'address'], address)) {
      redirectToReturnURL()
    }
  }

  useEffect(() => {
    checkIfAddressIsSet()
  })

  return <AddressPage onSelectAddress={redirectToReturnURL} />
}

export default memo(RedirectManager)
