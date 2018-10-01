import React, { Component } from 'react'
import { intlShape } from 'react-intl'
import Tabs from 'vtex.styleguide/Tabs'
import Tab from 'vtex.styleguide/Tab'
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
    const orderTitle = this.context.intl.formatMessage({ id: 'address-locator.order-title' })
    const addressSearchTab = this.context.intl.formatMessage({ id: 'address-locator.address-search-tab' })
    const addressRedeemTab = this.context.intl.formatMessage({ id: 'address-locator.address-redeem-tab' })

    return (
      <div className="vtex-address-locator w-100 flex flex-column justify-center items-center pa6">
        <span className="db b f1 mb7">{orderTitle}</span>
        <Tabs fullWidth>
          <Tab label={addressSearchTab} active={this.state.currentTab === 1} onClick={() => this.handleTabChange(1)}>
            <AddressSearch
              googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyCUbzqhN6HZoty-UigCHG4bitF-Vl2GU7U&v=3.exp&libraries=places"
              loadingElement={<div className="h-100" />}
            />
          </Tab>
          <Tab label={addressRedeemTab} active={this.state.currentTab === 2} onClick={() => this.handleTabChange(2)}>
            <AddressRedeem />
          </Tab>
        </Tabs>
      </div>
    )
  }
}

export default AddressLocator
