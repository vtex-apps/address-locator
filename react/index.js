import React, { Component } from 'react'
import { FormattedMessage } from 'react-intl'
import { Adopt } from 'react-adopt'
import { compose } from 'recompose'
import { withRuntimeContext } from 'render'
import PropTypes from 'prop-types'
import { orderFormConsumer, contextPropTypes } from 'vtex.store/OrderFormContext'
import { Tab, Tabs, Spinner } from 'vtex.styleguide'

import logisticsQuery from './queries/logistics.gql'
import AddressSearch from './components/AddressSearch'
import AddressRedeem from './components/AddressRedeem'
import './global.css'

/**
 * Component that allows the user to locate his address, by inserting, searching, retrieving and
 * saving it into orderform.
 * Configure the key for Google Geolocation API, by inserting it on the admin logistics section.
 */
class AddressLocator extends Component {
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

  handleTabChange = tabIndex => {
    this.setState({
      currentTab: tabIndex,
    })
  }

  static defaultProps = {
    pageToRedirect: 'store/order',
  }

  get orderPagePath() {
    const { runtime, pageToRedirect } = this.props
    return runtime.pages[pageToRedirect].path
  }

  get isOrderPage() {
    const { runtime } = this.props
    return !!runtime.pages[runtime.page].order
  }

  /* Function that will be called when updating the orderform */
  handleOrderFormUpdated = async () => {
    const { orderFormContext, runtime } = this.props

    await orderFormContext.refetch()
    if (!this.isOrderPage) {
      return runtime.navigate({
        fallbackToWindowLocation: false,
        to: this.orderPagePath,
      })
    }
  }

  render() {
    const { currentTab } = this.state
    const { orderFormContext, hideTabs, hideTitle } = this.props

    const addressSearchTab = <FormattedMessage id="address-locator.address-search-tab" />
    const addressRedeemTab = <FormattedMessage id="address-locator.address-redeem-tab" />
    const addressSearch = (
      <Query query={logisticsQuery}>
        {({ data, loading }) => {
          if (loading) {
            return <Spinner />
          }

          const { googleMapsKey } = data.logistics

          return (
            <AddressSearch
              googleMapURL={`https://maps.googleapis.com/maps/api/js?key=${googleMapsKey}&v=3.exp&libraries=places`}
              googleMapKey={googleMapsKey}
              loadingElement={<div className="h-100" />}
              orderFormContext={orderFormContext}
              onOrderFormUpdated={this.handleOrderFormUpdated}
            />
          )
        }}
      </Query>
    )

    const tabs = (
      <Tabs fullWidth>
        <Tab
          label={addressSearchTab}
          active={currentTab === 1}
          onClick={() => this.handleTabChange(1)}
        >
          {addressSearch}
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
    )

    return (
      <div className="vtex-address-locator w-100 w-50-m center flex flex-column justify-center items-center pa6">
        {!hideTitle && (
          <h1 className="db b f1 mb7 pa5 tl tc-m">
            <FormattedMessage id="address-locator.order-title" />
          </h1>
        )}
        {hideTabs ? addressSearch : tabs}
      </div>
    )
  }
}

export default compose(
  withRuntimeContext,
  orderFormConsumer
)(AddressLocator)
