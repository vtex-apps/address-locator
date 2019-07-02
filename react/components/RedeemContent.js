import React, { Fragment, memo, useCallback } from 'react'
import { FormattedMessage } from 'react-intl'
import { ProfileRules } from 'vtex.profile-form'
import { path } from 'ramda'

import { useAddress } from './AddressContext'
import Loader from './Loader'
import Redeem from './Redeem'

const getCountryCode = path([
  'orderForm',
  'storePreferencesData',
  'countryCode',
])

const LoaderView = () => (
  <div className="pv7 ph6 br2 bg-white">
    <Loader style={{ width: '100%', height: '100%' }} />
  </div>
)

const RedeemContent = () => {
  const { address } = useAddress()
  const handleOrderFormUpdated = useCallback(() => {}, [address])
  const isLoading = address.loading
  const country = getCountryCode(address)

  return (
    <Fragment>
      <h2 className="t-heading-2 mt0 mb4">
        <FormattedMessage id="address-locator.address-redeem-recurring" />
      </h2>
      <div className="vtex-address-modal__redeem">
        {isLoading ? (
          <LoaderView />
        ) : (
          <ProfileRules country={country} shouldUseIOFetching>
            <Redeem
              address={address}
              onOrderFormUpdated={handleOrderFormUpdated}
            />
          </ProfileRules>
        )}
      </div>
    </Fragment>
  )
}

export default memo(RedeemContent)
