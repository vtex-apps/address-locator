import React, { Fragment, useCallback } from 'react'
import { orderFormConsumer, contextPropTypes } from 'vtex.store-resources/OrderFormContext'
import { FormattedMessage } from 'react-intl'
import { ProfileRules } from 'vtex.profile-form'
import { path } from 'ramda'

import Loader from './Loader'
import Redeem from './Redeem'

const getCountryCode = path(['orderForm', 'storePreferencesData', 'countryCode'])

const LoaderView = () => (
  (
    <div className="pv7 ph6 br2 bg-white">
      <Loader style={{ width: '100%', height: '100%' }} />
    </div>
  )
)

const RedeemContent = ({ orderFormContext }) => {
  const handleOrderFormUpdated = useCallback(() => orderFormContext.refetch(), [])
  const isLoading = orderFormContext.loading
  const country = getCountryCode(orderFormContext)

  return (
    <Fragment>
      <h2 className="t-heading-2 mt0 mb4">
        <FormattedMessage id="address-locator.address-redeem-recurring" />
      </h2>
      <div className="vtex-address-modal__redeem">
      {isLoading ? 
        <LoaderView /> : (
        <ProfileRules country={country} shouldUseIOFetching>
          <Redeem
            orderFormContext={orderFormContext}
            onOrderFormUpdated={handleOrderFormUpdated}
          />
        </ProfileRules>
      )}
      </div>
    </Fragment>
  )
}

RedeemContent.propTypes = {
  orderFormContext: contextPropTypes,
}

export default orderFormConsumer(RedeemContent)
