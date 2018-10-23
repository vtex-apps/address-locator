import React, { Component } from 'react'
import { FormattedMessage } from 'react-intl'
import { Query } from 'react-apollo'
import { Adopt } from 'react-adopt'
import { Tab, Tabs, Spinner } from 'vtex.styleguide'

import logisticsQuery from './queries/logistics.gql'
import AddressSearch from './components/AddressSearch'
import AddressRedeem from './components/AddressRedeem'
import './global.css'

/**
 * Component that allows the user to locate his address, by inserting, searching, managing and
 * saving it into orderform.
 * Configure the key for Google Geolocation API, by inserting it on the admin logistics section.
 */
class AddressLocator extends Component {
  state = {
    currentTab: 1,
  }

  handleTabChange = tabIndex => {
    this.setState({
      currentTab: tabIndex,
    })
  }

  render() {
    const { currentTab } = this.state
    const { hideTabs, hideTitle } = this.props

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
            />
          )
        }}
      </Query>
    )

    const tabs = (
      <Tabs fullWidth>
        <Tab label={addressSearchTab} active={currentTab === 1} onClick={() => this.handleTabChange(1)}>
          {addressSearch}
        </Tab>
        <Tab label={addressRedeemTab} active={currentTab === 2} onClick={() => this.handleTabChange(2)}>
          <AddressRedeem />
        </Tab>
      </Tabs>
    )

    return (
      <div className="vtex-address-locator w-100 w-50-m center flex flex-column justify-center items-center pa6">
        {!hideTitle && (
          <h1 className="db b f1 mb7 mt0">
            <FormattedMessage id="address-locator.order-title" />
          </h1>
        )}
        {hideTabs ? addressSearch : tabs}
      </div>
    )
  }
}

export default AddressLocator
