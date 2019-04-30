import React, { Component } from 'react'
import PropTypes from 'prop-types'
import AddressSearch from './AddressSearch'
import Button from 'vtex.styleguide/Button'
import { FormattedMessage } from 'react-intl'

class AddressContent extends Component {
  static propTypes = {
    onUpdateOrderForm: PropTypes.func.isRequired,
    onPickupClick: PropTypes.func.isRequired,
  }

  render() {
    const { onPickupClick, onUpdateOrderForm } = this.props

    return (
      <div className="vtex-address-modal__address">
        <h1 className="t-heading-1 mt0 mb4 mb7-ns">
          <FormattedMessage id="address-locator.address-page-title" />
        </h1>
        <AddressSearch onOrderFormUpdated={onUpdateOrderForm} />
        <hr className="mv5 mv6-ns bg-muted-3 bn" style={{ height: 1 }} />
        <div>
          <Button variation="tertiary" block onClick={onPickupClick}>
            <FormattedMessage id="address-locator.pickup-button" />
          </Button>
        </div>
      </div>
    )
  }
}

export default AddressContent
