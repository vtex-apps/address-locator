import React, { Fragment } from 'react'
import { FormattedMessage } from 'react-intl'

import { useAddress } from '../AddressContext'
import Loader from '../Loader'
import AddressRedeemQueryWrapper from './AddressRedeemQueryWrapper'

const LoaderView = () => (
  <div className="pv7 ph6 br2 bg-white">
    <Loader style={{ width: '100%', height: '100%' }} />
  </div>
)

const AddressRedeem = ({ rules }) => {
  const {
    address: { loading: isLoading },
  } = useAddress()

  return (
    <Fragment>
      <h2 className="t-heading-2 mt0 mb4">
        <FormattedMessage id="address-locator.address-redeem-recurring" />
      </h2>
      <div className="vtex-address-modal__redeem">
        {isLoading ? (
          <LoaderView />
        ) : (
          <AddressRedeemQueryWrapper rules={rules} />
        )}
      </div>
    </Fragment>
  )
}

export default AddressRedeem
