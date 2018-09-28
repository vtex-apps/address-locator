import React from 'react'
import { injectIntl, intlShape } from 'react-intl'
import AddressSearch from './components/AddressSearch'
import Tabs from 'vtex.styleguide/Tabs'
import Tab from 'vtex.styleguide/Tab'

class AddressLocator extends React.Component {
  state = {
    currentTab: 1,
  }

  handleTabChange = tabIndex => {
    this.setState({
      currentTab: tabIndex,
    })
  }

  static propTypes = {
    intl: intlShape.isRequired,
  };

  render() {
    const { intl } = this.props
    const title = intl.formatMessage({ id: 'address-locator.order-title' })
    const firstTabLabel = intl.formatMessage({ id: 'address-locator.tab-1-label' })
    const secondTabLabel = intl.formatMessage({ id: 'address-locator.tab-2-label' })

    return (
      <div className="vtex-address-locator w-100 flex flex-column justify-center items-center pa6">
        <span className="db b f1 mb4">{title}</span>
        <Tabs>
          <Tab label={firstTabLabel} active={this.state.currentTab === 1} onClick={() => this.handleTabChange(1)}>
            <AddressSearch
              googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyCUbzqhN6HZoty-UigCHG4bitF-Vl2GU7U&v=3.exp&libraries=places"
              loadingElement={<div className="h-100" />}
            />
          </Tab>
          <Tab label={secondTabLabel} active={this.state.currentTab === 2} onClick={() => this.handleTabChange(2)} />
        </Tabs>
      </div>
    )
  }
}

export default injectIntl(AddressLocator)
