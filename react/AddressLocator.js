import React, { Component } from "react";
import { injectIntl, intlShape } from "react-intl";
import SearchMap from './components/SearchMap'
import Tabs from 'vtex.styleguide/Tabs'
import Tab from 'vtex.styleguide/Tab'

class AddressLocator extends Component {
  state = {
    currentTab: 1
  }

  handleTabChange(tabIndex) {
    this.setState({
      currentTab: tabIndex,
    })
  }

  static propTypes = {
    intl: intlShape.isRequired
  };

  render() {
    const { intl } = this.props

    const message = intl.formatMessage({ id: 'address-locator.order-title' })
    const firstTabLabel = intl.formatMessage({ id: 'address-locator.tab-1-label' })
    const secondTabLabel = intl.formatMessage({ id: 'address-locator.tab-2-label' })

    return (
      <div className="vtex-address-locator w-100 flex flex-column justify-center items-center pa6">
        <span className="db b f1 mb4">{message}</span>
        <Tabs>
          <Tab label={firstTabLabel} active={this.state.currentTab === 1} onClick={() => this.handleTabChange(1)}>
            <SearchMap />
          </Tab>
          <Tab label={secondTabLabel} active={this.state.currentTab === 2} onClick={() => this.handleTabChange(2)}>
            <p>Content for tab 2</p>
          </Tab>
        </Tabs>
      </div>
    );
  }
}

export default injectIntl(AddressLocator);
