import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { orderFormConsumer, contextPropTypes } from 'vtex.store-resources/OrderFormContext'
import AddressSearch from './AddressSearch'
import Button from 'vtex.styleguide/Button'
import { FormattedMessage } from 'react-intl'

import styles from '../styles.css'

class AddressContent extends Component {
  static propTypes = {
    orderFormContext: contextPropTypes,
    onUpdateOrderForm: PropTypes.func.isRequired,
    onPickupClick: PropTypes.func.isRequired,
  }

  render() {
    const { orderFormContext, onPickupClick, onUpdateOrderForm } = this.props

    return (
      <div className={styles.addressContent}>
        <h1 className="t-heading-1 mt0 mb4 mb7-ns">
          <FormattedMessage id="address-locator.address-page-title" />
        </h1>
        <AddressSearch
          orderFormContext={orderFormContext}
          onOrderFormUpdated={onUpdateOrderForm}
        />
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

export default orderFormConsumer(AddressContent)