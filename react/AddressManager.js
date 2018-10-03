import React, { Component } from 'react'
import { Adopt } from 'react-adopt'
import { FormattedMessage } from 'react-intl'
import { Query } from 'react-apollo'
import {
  orderFormConsumer,
  contextPropTypes,
} from 'vtex.store/OrderFormContext'
import logisticsQuery from './queries/logistics.gql'
import AddressSearch from './components/AddressSearch'
import Modal from 'vtex.styleguide/Modal'
import Spinner from 'vtex.styleguide/Spinner'
import ChangeAddressIcon from './components/ChangeAddressIcon'
import NewAddressIcon from './components/NewAddressIcon'
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

  componentDidMount() {
    const { orderFormContext } = this.props
    orderFormContext.refetch()
  }

  render() {
    const { shippingData } = this.props.orderFormContext.orderForm
    if (!shippingData) {
      return null
    }

    const { street, number } = shippingData.address
    const { isModalOpen } = this.state

    return (
      <div className="address-manager">
        <div className="address-manager__bar flex ph5 white" onClick={this.handleOpenModal}>
          <p className="address-manager__address mr5 overflow-hidden nowrap">
            {`${street}, ${number}`}
          </p>
          <ChangeAddressIcon />
        </div>
        <Modal
          isOpen={isModalOpen}
          onClose={this.handleCloseModal}
        >
          <Adopt mapper={{
            title: <FormattedMessage id="address-locator.address-manager-title" />,
          }}>
            {({ title }) => (
              <p className="f3 pa5 ma0 bb b--light-gray bw1 b dark-gray">{ title }</p>
            )}
          </Adopt>
          <NewAddressIcon />
          <Query query={logisticsQuery}>
            {({ loading, data }) => {
              if (loading) {
                return <Spinner />
              }

              const { googleMapsKey } = data.logistics

              return (
                <AddressSearch
                  googleMapURL={`https://maps.googleapis.com/maps/api/js?key=${googleMapsKey}&v=3.exp&libraries=places`}
                  googleMapKey={googleMapsKey}
                  loadingElement={<div className="h-100" />}
                  onOrderFormUpdated={this.handleCloseModal}
                />
              )
            }}
          </Query>
        </Modal>
      </div>
    )
  }
}

export default orderFormConsumer(AddressManager)
