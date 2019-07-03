import React from 'react'
import PropTypes from 'prop-types'
import { Button } from 'vtex.styleguide'
import { FormattedMessage } from 'react-intl'
import { useRuntime } from 'vtex.render-runtime'

import SearchForm from './SearchForm'

const AddressSearch = ({ onPickupClick, onUpdateOrderForm }) => {
  const {
    culture: { country },
  } = useRuntime()

  return (
    <div className="vtex-address-modal__address">
      <h1 className="t-heading-1 mt0 mb4 mb7-ns">
        <FormattedMessage id="address-locator.address-page-title" />
      </h1>
      <SearchForm onOrderFormUpdated={onUpdateOrderForm} country={country} />
      <hr className="mv5 mv6-ns bg-muted-3 bn" style={{ height: 1 }} />
      <div>
        <Button variation="tertiary" block onClick={onPickupClick}>
          <FormattedMessage id="address-locator.pickup-button" />
        </Button>
      </div>
    </div>
  )
}

AddressSearch.propTypes = {
  onUpdateOrderForm: PropTypes.func.isRequired,
  onPickupClick: PropTypes.func.isRequired,
}

export default AddressSearch
