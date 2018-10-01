import React, { Component } from 'react'
import { intlShape } from 'react-intl'
import { Query } from 'react-apollo'
import Tabs from 'vtex.styleguide/Tabs'
import Tab from 'vtex.styleguide/Tab'

import logisticsQuery from './queries/logistics.gql'
import AddressSearch from './components/AddressSearch'
import AddressRedeem from './components/AddressRedeem'
import './global.css'

class AddressLocator extends Component {
  static contextTypes = {
    intl: intlShape,
  }

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
    const { intl } = this.context
    const orderTitle = intl.formatMessage({ id: 'address-locator.order-title' })
    const addressSearchTab = intl.formatMessage({ id: 'address-locator.address-search-tab' })
    const addressRedeemTab = intl.formatMessage({ id: 'address-locator.address-redeem-tab' })

    return (
      <div className="vtex-address-locator w-100 flex flex-column justify-center items-center pa6">
        <span className="db b f1 mb7">{orderTitle}</span>
        <Tabs fullWidth>
          <Tab label={addressSearchTab} active={currentTab === 1} onClick={() => this.handleTabChange(1)}>
            <Query query={logisticsQuery}>
              {({ data }) => (
                <AddressSearch
                  googleMapURL={`https://maps.googleapis.com/maps/api/js?key=${data.logistics.googleMapsKey}&v=3.exp&libraries=places`}
                  loadingElement={<div className="h-100" />}
                />
              )}
            </Query>
          </Tab>
          <Tab label={addressRedeemTab} active={currentTab === 2} onClick={() => this.handleTabChange(2)}>
            <AddressRedeem />
          </Tab>
        </Tabs>
      </div>
    )
  }
}

export default AddressLocator
