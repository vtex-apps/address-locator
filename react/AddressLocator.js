import React, { Component } from 'react'
import { injectIntl, intlShape } from 'react-intl'
import PropTypes from 'prop-types'
import SearchMap from './components/SearchMap'

class AddressLocator extends Component {
  static propTypes = {
    logoUrl: PropTypes.string,
    logoTitle: PropTypes.string,
    intl: intlShape.isRequired,
  };

  render() {
    const { logoUrl, logoTitle, intl } = this.props

    const message = intl.formatMessage({ id: 'address-locator.where-to-deliver' })

    return (
      <div className="vtex-address-locator w-100 flex flex-column justify-center items-center pa6">
        {logoUrl && <img src={logoUrl} alt={logoTitle} />}
        <span className="db b f3 mb4">{message}</span>
        <SearchMap />
      </div>
    )
  }
}

export default injectIntl(AddressLocator)
