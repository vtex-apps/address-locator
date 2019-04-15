import React, { Component } from 'react'
import { compose } from 'recompose'
import { withRuntimeContext } from 'vtex.render-runtime'
import PropTypes from 'prop-types'


import { orderFormConsumer, contextPropTypes } from 'vtex.store-resources/OrderFormContext'
import Card from './Card'
import AddressContent from './AddressContent'

import { Spinner } from 'vtex.styleguide'
import { Modal } from 'vtex.styleguide'

import PickupContent from './PickupContent'
import RedeemContent from './RedeemContent'

/**
 * Component that allows the user to locate his address, by inserting, searching, retrieving and
 * saving it into orderform.
 * Configure the key for Google Geolocation API, by inserting it on the admin logistics section.
 */
class AddressPage extends Component {
  static propTypes = {
    /* Context used to call address mutation and retrieve the orderForm */
    orderFormContext: contextPropTypes.isRequired,
    loading: PropTypes.bool,
    onSelectAddress: PropTypes.func,
  }

  static defaultProps = {
    onSelectAddress: () => {},
  }

  state = {
    isPickupOpen: false,
    isPickupSelected: false,
  }

  handlePickupClick = () => {
    this.setState({
      isPickupOpen: true,
    })
  }

  handlePickupConfirm = () => {
    this.setState({
      isPickupSelected: true,
    })
    this.handleOrderFormUpdated()
  }

  /* Function that will be called when updating the orderform */
  handleOrderFormUpdated = async () => {
    await this.props.orderFormContext.refetch()
    this.props.onSelectAddress()
  }

  handlePickupModalClose = () => {
    this.setState({
      isPickupOpen: false,
    })
  }

  render() {
    const { orderFormContext, loading } = this.props
    const { isPickupOpen, isPickupSelected } = this.state

    if (loading) {
      return (
        <div className="flex w-100 items-center justify-center"
          style={{
            height: 750,
          }}>
          <Spinner />
        </div>
      )
    }

    /** TODO: use a better method of mobile detection
     * @author lbebber */
    const isMobile = window.innerWidth < 640

    const pickupPage = isPickupOpen ? (
      <PickupContent
        loading={isPickupSelected}
        orderFormContext={orderFormContext}
        onConfirm={this.handlePickupConfirm}
        onUpdateOrderForm={this.handleOrderFormUpdated}
      />
    ) : <div/>

    return (
      <React.Fragment>
        <div className="vtex-address-modal__address-page" style={{
          transition: 'transform 300ms',
          transform: `translate3d(${isPickupOpen && isMobile ? '-100%' : '0'}, 0, 0)`
        }}>
          <Card>
            <AddressContent
              onPickupClick={this.handlePickupClick}
              onUpdateOrderForm={this.handleOrderFormUpdated}
            />
          </Card>
          <Card>
            <RedeemContent />
          </Card>
        </div>
        {isMobile ? (
          <div className="absolute w-100 h-100 top-0" style={{
            left: '100%',
            transition: 'transform 300ms',
            transform: `translate3d(${isPickupOpen && isMobile ? '-100%' : '0'}, 0, 0)`
          }}>
            {pickupPage}
          </div>
        ) : (
          <Modal 
            centered 
            isOpen={isPickupOpen}
            onClose={this.handlePickupModalClose}>
            <div className="vw-90 vh-80">
              {pickupPage}
            </div>
          </Modal>
        )}
      </React.Fragment>
    )
  }
}

export default compose(
  withRuntimeContext,
  orderFormConsumer
)(AddressPage)
