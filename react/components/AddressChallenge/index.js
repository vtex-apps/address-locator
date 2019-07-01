import React, { useEffect, useState } from 'react'

import { graphql } from 'react-apollo'
import { useRuntime } from 'vtex.render-runtime'
import { Spinner } from 'vtex.styleguide'
import addressQuery from '../../queries/address.gql'
import styles from './AddressChallenge.css'

const ADDRESS_PATH = '/address'

const redirectToAddress = (page, navigate) => {
  const pathName = window.location.pathname.replace(/\/$/, '')
  // console.log("teste pathName: ", pathName);
  // console.log("teste this.props: ", this.props);
  if (page !== 'store.address' && pathName !== ADDRESS_PATH) {
    // console.log('teste )
    console.log('teste NAVIGATING!')
    // console.log('teste page: ', page)
    // console.log('teste pathName: ', pathName)
    navigate({
      fallbackToWindowLocation: false,
      query: `returnUrl=${encodeURIComponent(pathName)}`,
      page: 'store.address',
    })
  }
}

const AddressChallenge = ({ data, children }) => {
  const { navigate, page } = useRuntime()
  const [hasAddress, updateHasAddress] = useState(false)
  const [isLoading, updateLoading] = useState(true)
  const { loading, orderForm = {}, error } = data
  useEffect(() => {
    updateLoading(loading)
  }, [loading])
  const { shippingData } = orderForm
  useEffect(() => {
    if (!loading) {
      const hasError = !!error
      const gotAddress = !!(shippingData && shippingData.address)
      updateHasAddress(gotAddress)
      if (!hasError && !gotAddress) {
        redirectToAddress(page, navigate)
      }
    }
  }, [loading, shippingData, page, navigate])

  if (isLoading) {
    return (
      <div className="flex justify-center items-center absolute top-0 bottom-0 left-0 right-0 bg-base">
        <div className={styles.spinnerAppear}>
          <Spinner />
        </div>
      </div>
    )
  }
  if (hasAddress) {
    return children
  }
  return null
}

export default graphql(addressQuery, {
  options: () => ({ ssr: false }),
})(AddressChallenge)
