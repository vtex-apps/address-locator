import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { injectIntl } from 'react-intl'
import { graphql, withApollo } from 'react-apollo'
import { compose } from 'recompose'
import { path } from 'ramda'

import nearPickupPointsQuery from '../queries/nearPickupPoints.gql'
import logisticsQuery from '../queries/logistics.gql'
import { newAddress } from '../utils/newAddress'
import { PickupPointsSelector } from 'vtex.pickup-points-selector'
import { helpers } from 'vtex.address-form'
const { injectRules, addValidation } = helpers

class PickupModalContainer extends Component {
  state = {
    selectedPickupPoint: null,
    pickupPoints: [],
    pickupOptions: [],
    activePickupPoint: null,
    searchAddress: addValidation(newAddress({ addressType: 'search' })),
    isSearching: true,
  }

  componentDidMount() {
    const { activePickupPoint } = this.state
    if (activePickupPoint && activePickupPoint.pickupStoreInfo.address) {
      this.handleSearchAddressChange(activePickupPoint.pickupStoreInfo.address)
    }
  }

  convertPickupPointToOption = (pickupPoint) => {
    if (!pickupPoint) return pickupPoint
    return {
      id: pickupPoint.id,
      shippingEstimate: '40m',
      deliveryChannel: 'pickup-in-point',
      shippingEstimateDate: null,
      lockTTL: null,
      availableDeliveryWindows: [],
      deliveryWindow: null,
      listPrice: 359,
      tax: 0,
      price: 0,
      pickupStoreInfo: {
        isPickupStore: true,
        ...pickupPoint,
      },
    }
  }

  changeActiveSLAOption = () => this.props.handlePickedSLA(this.state.selectedPickupPoint)

  changeActivePickupDetails = ({ pickupPoint }) => this.setState({ selectedPickupPoint: pickupPoint })

  savePickupPoints = (pickupPoints) => {
    const { activePickupPoint } = this.state
    if (!pickupPoints) {
      return this.setState({ pickupPoints: [], pickupOptions: [], isSearching: false })
    }
    const pickupOptions = pickupPoints.map(item => this.convertPickupPointToOption(item))
    const selectedPickupPoint = activePickupPoint || pickupOptions[0]
    this.setState({ pickupPoints, pickupOptions, isSearching: false, selectedPickupPoint })
  }

  handleSearchAddressChange = async (address) => {
    const cleanAddress = addValidation(newAddress(address))
    this.setState({ isSearching: true, searchAddress: cleanAddress })
    if (cleanAddress.geoCoordinates.value.length < 2) {
      this.savePickupPoints(null)
    }

    const [long, lat] = cleanAddress.geoCoordinates.value
    try {
      const response = await this.props.client.query({
        query: nearPickupPointsQuery,
        variables: { lat: lat.toString(), long: long.toString() },
      })
      const pickupPoints = path(['data', 'nearPickupPoints', 'items'], response)
      this.savePickupPoints(pickupPoints)
    } catch (err) {
      this.savePickupPoints(null)
    }
  }

  handlePickupConfirm = (options) => {
    this.props.onConfirm && this.props.onConfirm(options)
  }

  render() {
    const { isModalOpen, storePreferencesData, logisticsQuery } = this.props
    if (!isModalOpen || logisticsQuery.loading) return null

    return (
      <div className="absolute top-0 bottom-0 left-0 right-0">
        <PickupPointsSelector
          activePickupPoint={this.state.activePickupPoint}
          askForGeolocation={true}
          changeActivePickupDetails={this.changeActivePickupDetails}
          changeActiveSLAOption={this.changeActiveSLAOption}
          closePickupPointsModal={this.props.closePickupModal}
          googleMapsKey={logisticsQuery.logistics.googleMapsKey}
          intl={this.props.intl}
          isPickupDetailsActive={false}
          items={[]}
          logisticsInfo={[]}
          onAddressChange={this.handleSearchAddressChange}
          pickupOptions={this.state.pickupOptions}
          rules={this.props.rules}
          searchAddress={this.state.searchAddress}
          selectedPickupPoint={this.state.selectedPickupPoint}
          storePreferencesData={storePreferencesData}
          pickupPoints={this.state.pickupPoints}
          isSearching={this.state.isSearching}
          height='100%'
          onConfirm={this.handlePickupConfirm}
        />
      </div>
    )
  }
}

PickupModalContainer.propTypes = {
  activePickupPoint: PropTypes.object,
  askForGeolocation: PropTypes.bool,
  client: PropTypes.object,
  closePickupModal: PropTypes.func,
  handlePickedSLA: PropTypes.func,
  intl: PropTypes.object,
  isModalOpen: PropTypes.bool,
  logisticsQuery: PropTypes.object,
  rules: PropTypes.object,
  storePreferencesData: PropTypes.object,
  onConfirm: PropTypes.func,
}

export default compose(
  withApollo,
  graphql(logisticsQuery, {
    name: 'logisticsQuery',
  }),
  injectRules,
  injectIntl,
)(PickupModalContainer)
