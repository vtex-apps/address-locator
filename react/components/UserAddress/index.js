import React  from 'react'
import PropTypes from 'prop-types'
import { orderFormConsumer, contextPropTypes } from 'vtex.store-resources/OrderFormContext'
import ChangeAddressIcon from './ChangeAddressIcon'

import { Container } from 'vtex.store-components'
import ChangeAddressModal from '../ChangeAddressModal'
import { FormattedMessage } from 'react-intl'

class UserAddress extends React.Component {
  static propTypes = {
    variation: PropTypes.oneOf(['inline', 'bar']).isRequired,
    orderFormContext: contextPropTypes,
  }

  state = {
    isModalOpen: false,
  }

  handleChange = () => {
    this.setState({
      isModalOpen: true,
    })
  }

  handleCloseModal = () => {
    this.setState({
      isModalOpen: false,
    })
  }

  renderAddressInfo = ({inverted, centered}) => {
    const { orderFormContext } = this.props
    const { shippingData } = orderFormContext.orderForm

    if (!shippingData || !shippingData.address) return

    const { street, number, complement, addressType } = shippingData.address

    const displayStreet = number ? `${street}, ${number}` : street

    const displayAddress = (complement && complement !== '')
      ? `${displayStreet} - ${complement}`
      : `${displayStreet}`

    /** TODO: get pickupPoint name instead of address, if it's pickup
     * @author lbebber */

    const isPickup = addressType === 'pickup'

    return (
      <div className={`flex ${centered ? 'items-center' : 'items-end'}`}>
        <div className="flex flex-auto">
          <div className={`vtex-address-manager__icon mr3 flex items-center ${inverted ? 'c-on-base--inverted' : 'c-muted-1'}`}>
            <ChangeAddressIcon />
          </div>
          <div className="vtex-address-manager__address flex flex-auto flex-column">
            <div className={`t-small ${inverted ? 'c-muted-5' : 'c-muted-1'}`}>
              {isPickup
              ? <FormattedMessage id="user-address.pickup" />
              : <FormattedMessage id="user-address.order" />
              }
            </div>
            <div className="truncate">
              {displayAddress}
            </div>
          </div>
        </div>
        <div className={`bl bw1 mh4 ${centered ? '' : 'nb2'} ${inverted ? 'b--on-base--inverted' : 'b--muted-5'}`} style={{
          height: '1.5rem',
        }}/>
        <div className="flex flex-auto items-center">
          <div
            className={`t-action pointer pv3 nv3 ph4 nh4 ${inverted ? 'c-on-base--inverted' : 'c-action-primary'}`}
            role="button"
            onClick={this.handleChange}>
            <FormattedMessage id="user-address.change" />
          </div>
        </div>
      </div>
    )
  }

  render() {
    const { variation, orderFormContext } = this.props

    const { shippingData } = orderFormContext.orderForm

    if (!shippingData || !shippingData.address) {
      return null
    }

    const isInline = variation === 'inline'
    const isInverted = !isInline
    const isCentered = !isInline

    const content = this.renderAddressInfo({inverted: isInverted, centered: isCentered})

    return (
      <React.Fragment>
        <div className="vtex-address-manager">
          {isInline ? (
            <div
              className="ph5"
              style={{
                maxWidth: '30rem',
              }}>
              {content}
            </div>
          ) : (
            <div
              className="bg-base--inverted c-on-base--inverted flex ph5 pointer pv3"
            >
              <Container className="flex justify-center w-100 left-0">
                <div className="vtex-address-manager__container w-100 mw9 flex">
                  {content}
                </div>
              </Container>
            </div>
          )}
        </div>
        <ChangeAddressModal
          isOpen={this.state.isModalOpen}
          onClose={this.handleCloseModal}
          orderFormContext={this.props.orderFormContext}
        />
      </React.Fragment>
    )
  }
}

export default orderFormConsumer(UserAddress)