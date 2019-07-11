import React, { useEffect, useMemo, useCallback, useReducer } from 'react'
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

function reducer(state, action) {
  const args = action.args || {}
  switch (action.type) {
    case 'SET_GEOLOCATION_PERMISSION': {
      return {
        ...state,
        hasGeolocationPermission: args.hasGeolocationPermission,
      }
    }
    case 'SAVE_NULL_PICKUP_POINTS': {
      return {
        ...state,
        pickupOptions: [],
        pickupPoints: [],
        isSearching: false,
      }
    }
    case 'SAVE_PICKUP_POINTS': {
      return {
        ...state,
        pickupOptions: args.pickupOptions,
        pickupPoints: args.pickupPoints,
        isSearching: false,
        selectedPickupPoint: args.selectedPickupPoint,
      }
    }
    case 'BEGIN_ADDRESS_SEARCH': {
      return {
        ...state,
        isSearching: true,
        searchAddress: args.searchAddress,
      }
    }
    case 'SELECT_PICKUP_POINT': {
      return {
        ...state,
        selectedPickupPoint: args.selectedPickupPoint,
      }
    }
    default:
      return state
  }
}

const initialState = {
  hasGeolocationPermission: undefined,
  pickupOptions: [],
  searchAddress: addValidation(newAddress({ addressType: 'search' })),
  selectedPickupPoint: null,
  pickupPoints: [],
  isSearching: true,
}

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
  const [state, dispatch] = useReducer(reducer, initialState)
  const {
    hasGeolocationPermission,
    pickupOptions,
    searchAddress,
    selectedPickupPoint,
    pickupPoints,
    isSearching,
  } = state

  const storePreferencesData = useMemo(
    () => ({
      countryCode: country,
      currencySymbol: currency,
    }),
    [country, currency]
  )

  const changeActivePickupDetails = useCallback(
    ({ pickupPoint }) =>
      dispatch({
        type: 'SELECT_PICKUP_POINT',
        args: { selectedPickupPoint: pickupPoint },
      }),
    [dispatch]
  )

  const changeActiveSLAOption = useCallback(
    () => handlePickedSLA(selectedPickupPoint),
    [handlePickedSLA, selectedPickupPoint]
  )

  const savePickupPoints = useCallback(
    pickupPoints => {
      if (!pickupPoints) {
        dispatch({ type: 'SAVE_NULL_PICKUP_POINTS' })
        return
      }
      const pickupOptions = pickupPoints.map(convertPickupPointToOption)
      const newSelectedPickupPoint = pickupOptions[0]
      dispatch({
        type: 'SAVE_PICKUP_POINTS',
        args: {
          pickupOptions,
          pickupPoints,
          selectedPickupPoint: newSelectedPickupPoint,
        },
      })
    },
    [dispatch]
  )

  const handleSearchAddressChange = useCallback(
    async address => {
      const cleanAddress = addValidation(newAddress(address))
      dispatch({
        type: 'BEGIN_ADDRESS_SEARCH',
        args: {
          searchAddress: cleanAddress,
        },
      })
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
    [dispatch, savePickupPoints, client]
  )

  const handlePickupConfirm = useCallback(
    options => {
      onConfirm && onConfirm(options)
    },
    [onConfirm]
  )

  useEffect(() => {
    getCurrentPositionPromise()
      .then(() =>
        dispatch({
          type: 'SET_GEOLOCATION_PERMISSION',
          args: { hasGeolocationPermission: true },
        })
      )
      .catch(() =>
        dispatch({
          type: 'SET_GEOLOCATION_PERMISSION',
          args: { hasGeolocationPermission: false },
        })
      )
  }, [dispatch])
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
