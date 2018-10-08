import React, { Component } from 'react'
import { Adopt } from 'react-adopt'
import { FormattedMessage } from 'react-intl'
import { orderFormConsumer, contextPropTypes } from 'vtex.store/OrderFormContext'
import Modal from 'vtex.styleguide/Modal'
import Button from 'vtex.styleguide/Button'
import ChangeAddressIcon from './components/ChangeAddressIcon'
import NewAddressIcon from './components/NewAddressIcon'
import AddressList from './components/AddressList'
import './global.css'

class AddressManager extends Component {
  static propTypes = {
    /* Context used to call address mutation and retrieve the orderForm */
    orderFormContext: contextPropTypes,
  }

  state = {
    isModalOpen: false,
  }

  handleOpenModal = () => {
    this.setState({ isModalOpen: true })
  }

  handleCloseModal = () => {
    this.setState({ isModalOpen: false })
  }

  render() {
    const { shippingData } = this.props.orderFormContext.orderForm

    /* If there is no address, it means that the user isn't identified */
    if (!shippingData || !shippingData.address) {
      return null
    }

    const { street, number } = shippingData.address
    const { isModalOpen } = this.state

    return (
      <div className="address-manager">
        <div className="address-manager__bar flex ph5 white pointer" onClick={this.handleOpenModal}>
          <p className="address-manager__address mr5 overflow-hidden nowrap">
            {`${street}, ${number}`}
          </p>
          <ChangeAddressIcon />
        </div>
        <Modal isOpen={isModalOpen} onClose={this.handleCloseModal}>
          <Adopt
            mapper={{
              title: <FormattedMessage id="address-locator.address-manager-title" />,
            }}
          >
            {({ title }) => <p className="f4 pa5 ma0 bb b--light-gray bw1 b near-black">{title}</p>}
          </Adopt>
          <NewAddressIcon />
          <div className="pa5 mb5">
            <Adopt
              mapper={{
                text: <FormattedMessage id="address-locator.address-manager-button" />,
              }}
            >
              {({ text }) => <Button block>{text}</Button>}
            </Adopt>
          </div>
          <AddressList
            availableAddresses={shippingData.availableAddresses}
            onOrderFormUpdated={this.handleCloseModal}
          />
        </Modal>
      </div>
    )
  }
}

export default orderFormConsumer(AddressManager)
