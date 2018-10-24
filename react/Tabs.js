import React, { Component } from 'react'
import { FormattedMessage, intlShape } from 'react-intl'
import { compose } from 'recompose'
import { withRuntimeContext } from 'render'
import PropTypes from 'prop-types'
import { orderFormConsumer, contextPropTypes } from 'vtex.store/OrderFormContext'
import { Tab, Tabs } from 'vtex.styleguide'
import queryString from 'query-string'

import AddressSearch from './components/Search'
import AddressRedeem from './components/Redeem'
import './global.css'

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
  handleOrderFormUpdated = async () => {
    const {
      orderFormContext,
      pageToRedirect,
      runtime: { navigate, pages, history },
    } = this.props
    
    await orderFormContext.refetch()

    /** pageToRedirect is just a fallback, the url parameter returnUrl takes priority */
    const { returnUrl } = queryString.parse(history.location.search)
    console.log(returnUrl)
    const pathToRedirect = returnUrl ? decodeURIComponent(returnUrl) : pages[pageToRedirect].path

    navigate({
      fallbackToWindowLocation: false,
      to: pathToRedirect,
    })
  }

  render() {
    const { currentTab } = this.state
    const { orderFormContext } = this.props
    const { intl } = this.context

    /** The label HAS TO BE a string */
    const addressSearchTab = intl.formatMessage({ id: 'address-locator.address-search-tab' })
    const addressRedeemTab = intl.formatMessage({ id: 'address-locator.address-redeem-tab' })

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
              onOrderFormUpdated={this.handleOrderFormUpdated}
            />
          </Tab>
          <Tab
            label={addressRedeemTab}
            active={currentTab === 2}
            onClick={() => this.handleTabChange(2)}
          >
            <AddressRedeem
              orderFormContext={orderFormContext}
              onOrderFormUpdated={this.handleOrderFormUpdated}
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
