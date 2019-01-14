import React, { Component } from 'react'
import { FormattedMessage, intlShape } from 'react-intl'
import { compose } from 'recompose'
import { withRuntimeContext } from 'render'
import PropTypes from 'prop-types'
import { orderFormConsumer, contextPropTypes } from 'vtex.store-resources/OrderFormContext'
import { Tab, Tabs } from 'vtex.styleguide'

import AddressSearch from './Search'
import PickupTab from './PickupTab'
import '../global.css'

/**
 * Component that allows the user to locate his address, by inserting, searching, retrieving and
 * saving it into orderform.
 * Configure the key for Google Geolocation API, by inserting it on the admin logistics section.
 */
class AddressLocatorTabs extends Component {
  static propTypes = {
    /* Context used to call address mutation and retrieve the orderForm */
    orderFormContext: contextPropTypes,
    pageToRedirect: PropTypes.string,
    runtime: PropTypes.shape({
      page: PropTypes.string.isRequired,
      pages: PropTypes.object.isRequired,
    }).isRequired,
  }
  state = {
    currentTab: 1,
  }

  static defaultProps = { pageToRedirect: 'store/order' }

  static contextTypes = { intl: intlShape }

  handleTabChange = tabIndex => this.setState({ currentTab: tabIndex })

  /* Function that will be called when updating the orderform */

  render() {
    const { currentTab } = this.state
    const { orderFormContext, onOrderFormUpdated } = this.props
    const { intl } = this.context

    /** The label HAS TO BE a string */
    const addressSearchTab = intl.formatMessage({ id: 'address-locator.address-search-tab' })
    const pickupTab = intl.formatMessage({ id: 'address-locator.pickup-tab' })

    return (
      <div className="vtex-address-locator w-100 w-50-m center flex flex-column justify-center items-center pa6">
        <h1 className="db b f1 mb7 mt0 pa5 tl tc-m">
          <FormattedMessage id="address-locator.order-title" />
        </h1>
        <Tabs fullWidth>
          <Tab
            label={addressSearchTab}
            active={currentTab === 1}
            onClick={() => this.handleTabChange(1)}
          >
            <AddressSearch
              orderFormContext={orderFormContext}
              onOrderFormUpdated={onOrderFormUpdated}
            />
          </Tab>
          <Tab
            label={pickupTab}
            active={currentTab === 2}
            onClick={() => this.handleTabChange(2)}
          >
            <PickupTab
              orderFormContext={orderFormContext}
              onOrderFormUpdated={onOrderFormUpdated}
            />
          </Tab>
        </Tabs>
      </div>
    )
  }
}

export default compose(
  withRuntimeContext,
  orderFormConsumer
)(AddressLocatorTabs)
