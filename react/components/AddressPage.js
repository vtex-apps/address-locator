import React, { Component, Fragment } from 'react'
import { compose } from 'recompose'
import { withRuntimeContext } from 'vtex.render-runtime'
import PropTypes from 'prop-types'
import { orderFormConsumer, contextPropTypes } from 'vtex.store-resources/OrderFormContext'
import { Modal, Spinner } from 'vtex.styleguide'
import { isMobileOnly } from 'react-device-detect'

import Card from './Card'
import AddressContent from './AddressContent'
import PickupContent from './PickupContent'
import RedeemContent from './RedeemContent'

import styles from '../styles.css'

/**
 * Component that allows the user to locate his address, by inserting, searching, retrieving and
 * saving it into orderform.
 * Configure the key for Google Geolocation API, by inserting it on the admin logistics section.
 */
class AddressPage extends Component {
  static propTypes = {
    /* Context used to call address mutation and retrieve the orderForm */
    orderFormContext: contextPropTypes,
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

    const pickupPage = isPickupOpen ? (
      <PickupContent
        loading={isPickupSelected}
        orderFormContext={orderFormContext}
        onConfirm={this.handlePickupConfirm}
        onUpdateOrderForm={this.handleOrderFormUpdated}
      />
    ) : null

    return (
      <Fragment>
        <div className={styles.addressPage} style={{
          transition: 'transform 300ms',
          transform: `translate3d(${isPickupOpen && isMobileOnly ? '-100%' : '0'}, 0, 0)`
        }}>
          <Card cardClass={styles.addressContainer}>
            <AddressContent
              onPickupClick={this.handlePickupClick}
              onUpdateOrderForm={this.handleOrderFormUpdated}
            />
          </Card>
          <Card cardClass={styles.redeemContainer}>
            <RedeemContent />
          </Card>
        </div>
        {isMobileOnly ? (
          <div className="absolute w-100 h-100 top-0" style={{
            left: '100%',
            transition: 'transform 300ms',
            transform: `translate3d(${isPickupOpen && isMobileOnly ? '-100%' : '0'}, 0, 0)`
          }}>
            {pickupPage}
          </div>
        ) : (
          <Modal 
            centered 
            isOpen={isPickupOpen}
            onClose={this.handlePickupModalClose}
          >
            <div className="vw-90" style={{ height: '80vh'}}>
              {pickupPage}
            </div>
          </Modal>
        )}
      </Fragment>
    )
  }
}

export default compose(
  withRuntimeContext,
  orderFormConsumer
)(AddressPage)
