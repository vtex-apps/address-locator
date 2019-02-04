import React, { Component } from 'react'
import { compose } from 'recompose'
import { withRuntimeContext, ExtensionPoint } from 'vtex.render-runtime'
import PropTypes from 'prop-types'


import { orderFormConsumer, contextPropTypes } from 'vtex.store-resources/OrderFormContext'
import Cover from './Cover'
import Card from './Card'
import AddressContent from './AddressContent'

import { Spinner } from 'vtex.styleguide'
import { Modal } from 'vtex.styleguide'

import styles from './AddressModal.css'
import PickupTab from './PickupTab';
import RedeemContent from './RedeemContent';

/**
 * Component that allows the user to locate his address, by inserting, searching, retrieving and
 * saving it into orderform.
 * Configure the key for Google Geolocation API, by inserting it on the admin logistics section.
 */
class AddressModal extends Component {
  static propTypes = {
    /* Context used to call address mutation and retrieve the orderForm */
    orderFormContext: contextPropTypes,
    loading: PropTypes.bool,
  }

  state = {
    isOpen: true,
    isPickupOpen: false,
    isModalOpen: false,
  }

  needAddress() {
    const shippingData = this.props.orderFormContext.orderForm.shippingData
    return shippingData == null || shippingData.address == null
  }

  handleClose = () => this.setState({ isOpen: false })

  handlePickupClick = () => {
    this.setState({
      isPickupOpen: true,
    })
  }

  handlePickupConfirm = () => {
    this.setState({
      isPickupOpen: false,
    })
    this.handleOrderFormUpdated()
  }

  /* Function that will be called when updating the orderform */
  handleOrderFormUpdated = async () => await this.props.orderFormContext.refetch()

  render() {
    const { orderFormContext, loading } = this.props
    const { isPickupOpen } = this.state

    if (loading) {
      return (
        <Cover>
          <div className="flex w-100 h-100 items-center justify-center">
            <div className={styles.spinnerAppear}>
              <Spinner />
            </div>
          </div>
        </Cover>
      )
    }

    /** TODO: use a better method of mobile detection
     * @author lbebber */
    const isMobile = window.innerWidth < 640

    const pickupPage = isPickupOpen ? (
      <PickupTab
        orderFormContext={orderFormContext}
        onConfirm={this.handlePickupConfirm}
      />
    ) : <div/>

    return (
      <Cover>
        <div className="vtex-address-modal__address" style={{
          transition: 'transform 300ms',
          transform: `translate3d(${isPickupOpen && isMobile ? '-100%' : '0'}, 0, 0)`
        }}>
          <ExtensionPoint id="header" leanWhen=".*" />
          <Card>
            <AddressContent onPickup={this.handlePickupClick} />
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
            onClose={() => this.setState({ isPickupOpen: false })}>
            <div className="vw-90 vh-80">
              {pickupPage}
            </div>
          </Modal>
        )}
      </Cover>
    )
  }
}

export default compose(
  withRuntimeContext,
  orderFormConsumer
)(AddressModal)
