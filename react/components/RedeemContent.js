import React from 'react'
import { orderFormConsumer, contextPropTypes } from 'vtex.store-resources/OrderFormContext'
import { FormattedMessage } from 'react-intl'
import Redeem from './Redeem'

class RedeemContent extends React.Component {
  static propTypes = {
    orderFormContext: contextPropTypes.isRequired,
  }

  handleOrderFormUpdated = async () => await this.props.orderFormContext.refetch()

  render() {
    const {orderFormContext} = this.props

    return (
      <React.Fragment>
        <h2 className="t-heading-2 mt0 mb4">
          <FormattedMessage id="address-locator.address-redeem-recurring" />
        </h2>
        <div className="vtex-address-modal__redeem">
          <Redeem
            orderFormContext={orderFormContext}
            onOrderFormUpdated={this.handleOrderFormUpdated}
          />
        </div>
      </React.Fragment>
    )
  }
}

export default orderFormConsumer(RedeemContent)