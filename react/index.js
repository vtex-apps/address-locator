import React, { Component } from 'react'
import { FormattedMessage } from 'react-intl'
import { Adopt } from 'react-adopt'
import Tabs from 'vtex.styleguide/Tabs'
import Tab from 'vtex.styleguide/Tab'

import AddressSearch from './components/AddressSearch'
import AddressRedeem from './components/AddressRedeem'
import './global.css'

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

    return (
      <div>
        <Adopt mapper={{
          title: <FormattedMessage id="address-locator.order-title" />,
        }}>
          {({ title }) => (
            <span className="db b f1 mb7 tc">{title}</span>
          )}
        </Adopt>
        <div className="vtex-address-locator w-100 w-30-m center flex flex-column justify-center items-center pa5">
          <Adopt mapper={{
            addressSearchTab: <FormattedMessage id="address-locator.address-search-tab" />,
            addressRedeemTab: <FormattedMessage id="address-locator.address-redeem-tab" />,
          }}>
            {({ addressSearchTab, addressRedeemTab }) => (
              <Tabs fullWidth>
                <Tab label={addressSearchTab} active={currentTab === 1} onClick={() => this.handleTabChange(1)}>
                  <AddressSearch />
                </Tab>
                <Tab label={addressRedeemTab} active={currentTab === 2} onClick={() => this.handleTabChange(2)}>
                  <AddressRedeem />
                </Tab>
              </Tabs>
            )}
          </Adopt>
        </div>
      </div>
    )
  }
}

export default AddressLocator
