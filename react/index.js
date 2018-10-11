import React, { Component } from 'react'
import { FormattedMessage } from 'react-intl'
import { Adopt } from 'react-adopt'
import Tabs from 'vtex.styleguide/Tabs'
import Tab from 'vtex.styleguide/Tab'

import { orderFormConsumer, contextPropTypes } from 'vtex.store/OrderFormContext'
import AddressSearch from './components/AddressSearch'
import AddressRedeem from './components/AddressRedeem'
import './global.css'

/**
 * Component that allows the user to locate his address, by inserting, searching, managing and
 * saving it into orderform.
 * Configure the key for Google Geolocation API, by inserting it on the admin logistics section.
 */
class AddressLocator extends Component {
  static propTypes = {
    /* Context used to call address mutation and retrieve the orderForm */
    orderFormContext: contextPropTypes,
  }
  state = {
    currentTab: 1,
  }

  handleTabChange = tabIndex => {
    this.setState({
      currentTab: tabIndex,
    })
  }

  handleOrderFormUpdated = () => {
    if (window.location.pathname !== '/order') {
      return window.location.assign('/order')
    }
    const { orderFormContext } = this.props

    orderFormContext.refetch()
  }

  render() {
    const { currentTab } = this.state
    const { orderFormContext } = this.props

    return (
      <div>
        <Adopt
          mapper={{
            title: <FormattedMessage id="address-locator.order-title" />,
          }}
        >
          {({ title }) => <span className="db b f1 pa5 tl tc-m">{title}</span>}
        </Adopt>
        <div className="vtex-address-locator w-100 w-60-m w-40-l center flex flex-column justify-center items-center pa5">
          <Adopt
            mapper={{
              addressSearchTab: <FormattedMessage id="address-locator.address-search-tab" />,
              addressRedeemTab: <FormattedMessage id="address-locator.address-redeem-tab" />,
            }}
          >
            {({ addressSearchTab, addressRedeemTab }) => (
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
            )}
          </Adopt>
        </div>
      </div>
    )
  }
}

export default orderFormConsumer(AddressLocator)
