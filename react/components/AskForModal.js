import React, { PureComponent, Fragment } from 'react'
import PropTypes from 'prop-types'
import { Button } from 'vtex.styleguide'
import { FormattedMessage } from 'react-intl'
import GeolocationPin from './GeolocationPin'

export default class AskForModal extends PureComponent {
  static propTypes = {
    handleOpenModal: PropTypes.func.isRequired,
  }

  render() {
    const { handleOpenModal } = this.props
    return (
      <Fragment>
        <p className="ask-for-geolocation-title"><FormattedMessage id="address-locator.pickup-tab-title" /></p>
        <p className="ask-for-geolocation-subtitle"><FormattedMessage id="address-locator.pickup-tab-subtitle" /></p>
        <div className="ask-for-geolocation-imageask">
          <GeolocationPin />
        </div>
        <div className="pv2 ttu">
          <Button
            onClick={() => handleOpenModal(true)}
          >
            <FormattedMessage id="address-locator.pickup-tab-use-my-geolocation" />
          </Button>
        </div>
        <div className="pv2 ttu">
          <Button
            variation="tertiary"
            onClick={() => handleOpenModal(false)}
          >
            <FormattedMessage id="address-locator.pickup-tab-input-address" />
          </Button>
        </div>
      </Fragment>
    )
  }
}
