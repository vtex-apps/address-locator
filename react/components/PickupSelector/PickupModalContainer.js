import React, { useState, useEffect, useMemo, useCallback } from 'react'
import PropTypes from 'prop-types'
import { injectIntl } from 'react-intl'
import { graphql, withApollo } from 'react-apollo'
import { compose } from 'recompose'
import { path } from 'ramda'
import { PickupPointsSelector } from 'vtex.pickup-points-selector'
import { helpers } from 'vtex.address-form'
import { useRuntime } from 'vtex.render-runtime'

import nearPickupPointsQuery from '../../queries/nearPickupPoints.gql'
import logisticsQuery from '../../queries/logistics.gql'
import { newAddress } from '../../utils/newAddress'
import getCurrentPositionPromise from '../../utils/getCurrentPositionPromise'

const { injectRules, addValidation } = helpers

const convertPickupPointToOption = pickupPoint => {
  if (!pickupPoint) return pickupPoint
  return {
    id: pickupPoint.id,
    shippingEstimate: '40m',
    deliveryChannel: 'pickup-in-point',
    shippingEstimateDate: null,
    lockTTL: null,
    availableDeliveryWindows: [],
    deliveryWindow: null,
    listPrice: 0,
    tax: 0,
    price: 0,
    pickupStoreInfo: {
      isPickupStore: true,
      ...pickupPoint,
    },
  }
}

const PickupModalContainer = ({
  handlePickedSLA,
  logisticsQuery,
  intl,
  rules,
  client,
  onConfirm,
}) => {
  const {
    culture: { country, currency },
  } = useRuntime()
  const [hasGeolocationPermission, updateGeolocationPermission] = useState(
    undefined
  )
  const [pickupOptions, updatePickupOptions] = useState([])
  const [searchAddress, updateSearchAddress] = useState(
    addValidation(newAddress({ addressType: 'search' }))
  )
  const [selectedPickupPoint, updateSelectedPickupPoint] = useState(null)
  const [pickupPoints, updatePickupPoints] = useState([])
  const [isSearching, updateSearching] = useState(true)

  const storePreferencesData = useMemo(
    () => ({
      countryCode: country,
      currencySymbol: currency,
    }),
    [country, currency]
  )

  const changeActivePickupDetails = useCallback(
    ({ pickupPoint }) => updateSelectedPickupPoint(pickupPoint),
    [updateSelectedPickupPoint]
  )

  const changeActiveSLAOption = useCallback(
    () => handlePickedSLA(selectedPickupPoint),
    [handlePickedSLA, selectedPickupPoint]
  )

  const savePickupPoints = useCallback(
    pickupPoints => {
      if (!pickupPoints) {
        updatePickupOptions([])
        updatePickupPoints([])
        updateSearching(false)
        return
      }
      const pickupOptions = pickupPoints.map(convertPickupPointToOption)
      const newSelectedPickupPoint = pickupOptions[0]
      updatePickupOptions(pickupOptions)
      updatePickupPoints(pickupPoints)
      updateSearching(false)
      updateSelectedPickupPoint(newSelectedPickupPoint)
    },
    [
      updatePickupOptions,
      updatePickupPoints,
      updateSearching,
      updateSelectedPickupPoint,
    ]
  )

  const handleSearchAddressChange = useCallback(
    async address => {
      const cleanAddress = addValidation(newAddress(address))
      updateSearching(true)
      updateSearchAddress(cleanAddress)
      if (cleanAddress.geoCoordinates.value.length < 2) {
        savePickupPoints(null)
      }

      const [long, lat] = cleanAddress.geoCoordinates.value
      try {
        const response = await client.query({
          query: nearPickupPointsQuery,
          variables: { lat: lat.toString(), long: long.toString() },
        })
        const pickupPoints = path(
          ['data', 'nearPickupPoints', 'items'],
          response
        )
        savePickupPoints(pickupPoints)
      } catch (err) {
        savePickupPoints(null)
      }
    },
    [updateSearching, updateSearchAddress, savePickupPoints, client]
  )

  const handlePickupConfirm = useCallback(
    options => {
      onConfirm && onConfirm(options)
    },
    [onConfirm]
  )

  useEffect(() => {
    getCurrentPositionPromise()
      .then(() => updateGeolocationPermission(true))
      .catch(() => updateGeolocationPermission(false))
  }, [])
  if (logisticsQuery.loading || hasGeolocationPermission === undefined) {
    return null
  }

  return (
    <PickupPointsSelector
      askForGeolocation={hasGeolocationPermission}
      changeActivePickupDetails={changeActivePickupDetails}
      changeActiveSLAOption={changeActiveSLAOption}
      googleMapsKey={logisticsQuery.logistics.googleMapsKey}
      intl={intl}
      isPickupDetailsActive={false}
      items={[]}
      logisticsInfo={[]}
      onAddressChange={handleSearchAddressChange}
      pickupOptions={pickupOptions}
      rules={rules}
      searchAddress={searchAddress}
      selectedPickupPoint={selectedPickupPoint}
      storePreferencesData={storePreferencesData}
      pickupPoints={pickupPoints}
      isSearching={isSearching}
      height="100%"
      onConfirm={handlePickupConfirm}
    />
  )
}

PickupModalContainer.propTypes = {
  client: PropTypes.object,
  handlePickedSLA: PropTypes.func,
  intl: PropTypes.object,
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
  injectIntl
)(PickupModalContainer)
