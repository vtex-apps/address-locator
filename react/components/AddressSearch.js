import React, { Component, Fragment } from 'react'
import { createPortal } from 'react-dom'
import { injectIntl, FormattedMessage } from 'react-intl'
import PropTypes from 'prop-types'
import { withScriptjs } from 'react-google-maps'
import { graphql } from 'react-apollo'
import { compose, branch, mapProps, renderComponent } from 'recompose'
import { path } from 'ramda'
import alpha2ToAlpha3 from 'country-iso-2-to-3'
import { Alert, Button, Input, Spinner } from 'vtex.styleguide'
import { contextPropTypes } from 'vtex.store-resources/OrderFormContext'

import Autocomplete from './Autocomplete'

import logisticsQuery from '../queries/logistics.gql'
import getCurrentPositionPromise from '../utils/getCurrentPositionPromise'

import styles from '../styles.css'

/**
 * Geolocation error codes. Can be found here:
 * https://developer.mozilla.org/en-US/docs/Web/API/PositionError
 */
const ERROR_POSITION_DENIED = 1
const ERROR_POSITION_UNAVAILABLE = 2
const ERROR_TIMEOUT = 3
const ERROR_ADDRESS_NOT_FOUND = 9 // custom ad hoc error code

/**
 * Component responsible for searching the user address in Google Maps API, when
 * inserting it or using navigator geolocation to get current position
 */
class AddressSearch extends Component {
  static propTypes = {
    /* Google Maps Geolocation API key */
    googleMapKey: PropTypes.string,
    /* Function that will be called after updating the orderform */
    onOrderFormUpdated: PropTypes.func,
    /* Context used to call address mutation and retrieve the orderForm */
    orderFormContext: contextPropTypes,
    /* Set to loading mode */
    loading: PropTypes.bool,
  }

  state = {
    address: null,
    formattedAddress: '',
    shouldDisplayNumberInput: false,
    shouldDisplayComplementInput: false,
    isLoading: false,
    inputError: null,
    inputAddressError: null,
    AlertMessage: false,
    shouldDisplayStreetInput: false,
    hasSearchedStreet: false,
  }

  constructor(props) {
    super(props)

    this.inputRefs = []
    this.form = React.createRef()
  }

  requestGoogleMapsApi = async (params) => {
    const { lat, long, address } = params
    const { googleMapKey } = this.props
    const baseUrl = `https://maps.googleapis.com/maps/api/geocode/json?key=${googleMapKey}&`
    let suffix = ''
    if (address) {
      suffix = `address=${address}`
    } else if (lat && long) {
      suffix = `latlng=${lat},${long}`
    }
    try {
      const response = await fetch(baseUrl + suffix)
      return await response.json()
    } catch (err) {
      return { results: [] }
    }
  }

  /* Use the navigator geolocation to get the user position and retrieve his address using Google Maps API */
  handleSetCurrentPosition = async () => {
    if (navigator.geolocation) {
      this.setState({ isLoading: true })
      try {
        const position = await getCurrentPositionPromise()
        const { latitude, longitude } = position.coords
        const parsedResponse = await this.requestGoogleMapsApi({ lat: latitude, long: longitude })

        if (!parsedResponse.results.length) {
          return this.setState({
            inputError: ERROR_ADDRESS_NOT_FOUND,
            isLoading: false,
          })
        }

        const place = parsedResponse.results[0]
        const newAddress = this.getParsedAddress(place)
        if (!newAddress.postalCode) {
          return this.setState({
            inputAddressError: ERROR_ADDRESS_NOT_FOUND,
            isLoading: false,
          })
        }
        this.setState({
          address: newAddress,
          shouldDisplayNumberInput: true,
          shouldDisplayComplementInput: true,
          isLoading: false,
          inputError: null,
          inputAddressError: null,
          AlertMessage: null,
          shouldDisplayStreetInput: true,
          hasSearchedStreet: true,
          formattedAddress: place.formatted_address,
        })
      } catch (error) {
        this.setState({ inputError: error, isLoading: false })
      }
    }
  }

  handleOnPlaceSelected = place => {
    const errorState = {
      AlertMessage: <FormattedMessage id="address-locator.address-search-invalid-address" />,
      address: null,
      shouldDisplayNumberInput: false,
      shouldDisplayComplementInput: false,
      isLoading: false,
      inputError: null,
      inputAddressError: null,
      shouldDisplayStreetInput: false,
      hasSearchedStreet: false,
    }
    if (!place.address_components) {
      return this.setState(errorState)
    }
    const address = this.getParsedAddress(place)

    if (!address.city) {
      return this.setState(errorState)
    }
    const isComplete = address.postalCode && address.street
    this.setState({
      address,
      formattedAddress: place.formatted_address,
      shouldDisplayNumberInput: true,
      shouldDisplayComplementInput: true,
      isLoading: false,
      inputError: null,
      inputAddressError: null,
      AlertMessage: null,
      shouldDisplayStreetInput: !isComplete,
      hasSearchedStreet: false,
    })
  }

  /**
   * The place object returned from Google Maps API has some extra informations about the address that won't be used when sending
   * to orderform. So, this function will reduce nested address information into a simpler consumable object.
   *
   * @param {Object} place The place object returned from Google Maps API
   * @returns {Object} The reduced address data with only necessary fields/information
   */
  getParsedAddress = place => {
    const parsedAddressComponents = place.address_components.reduce((accumulator, address) => {
      const parsedItem = address.types.reduce(
        (accumulator, type) => ({ ...accumulator, [type]: address.short_name }),
        {}
      )
      return { ...accumulator, ...parsedItem }
    }, {})

    const { lat, lng } = path(['geometry', 'location'], place) || {}
    // lat and lng may come as a function or a double
    const latitude = typeof lat === 'function' ? lat() : lat
    const longitude = typeof lng === 'function' ? lng() : lng

    const address = {
      addressType: 'residential',
      city: parsedAddressComponents.administrative_area_level_2 || parsedAddressComponents.locality,
      complement: '',
      /* Google Maps API returns Alpha-2 ISO codes, but checkout API requires Alpha-3 */
      country: alpha2ToAlpha3(parsedAddressComponents.country),
      neighborhood: parsedAddressComponents.sublocality_level_1,
      number: parsedAddressComponents.street_number || '',
      postalCode: parsedAddressComponents.postal_code,
      receiverName: '',
      state: parsedAddressComponents.administrative_area_level_1,
      street: parsedAddressComponents.route,
      geoCoordinates: latitude && longitude ? [longitude, latitude] : null,
    }

    return address
  }

  checkAddressWithGoogle = async () => {
    const { address } = this.state
    try {
      const parsedResponse = await this.requestGoogleMapsApi({ address: `${address.street} ${address.number}` })
      if (!parsedResponse.results.length) {
        return
      }

      const place = parsedResponse.results[0]
      const googleAddress = this.getParsedAddress(place)
      if (!googleAddress.postalCode) {
        return
      }

      if (googleAddress.postalCode !== address.postalCode) {
        //  TODO use sentry to log
      }
      if (address.geoCoordinates[0] !== googleAddress.geoCoordinates[0] || address.geoCoordinates[1] !== googleAddress.geoCoordinates[1]) {
        // TODO use sentry to log
      }
      return googleAddress.geoCoordinates
    } catch (err) {
      return null
    }
  }

  handleFormSubmit = async e => {
    e.preventDefault()

    const canSubmit = this.canSubmit()

    if (!canSubmit) {
      const formElement = this.form.current
      const inputs = Array.from(formElement ? formElement.querySelectorAll('input') : [])
      for (const input of inputs) {
        if (input.value === '') {
          input.focus()
          break
        }
      }
      return
    }

    this.setState({
      isLoading: true,
      inputError: null,
      AlertMessage: null,
    })
    const { orderFormContext, onOrderFormUpdated } = this.props
    const { address } = this.state

    try {
      const googleCoords = await this.checkAddressWithGoogle()

      const response = await orderFormContext.updateOrderFormShipping({
        variables: {
          orderFormId: orderFormContext.orderForm.orderFormId,
          address: {
            ...address,
            geoCoordinates: googleCoords || address.geoCoordinates,
          },
        },
      })

      const newAddress = path(['data', 'updateOrderFormShipping', 'shippingData', 'address'], response)

      if (!newAddress || !this.getIsAddressValid(newAddress)) {
        return this.setState({
          isLoading: false,
          inputError: ERROR_ADDRESS_NOT_FOUND,
        })
      }
      
      if (orderFormContext.orderForm.isCheckedIn) {
        await orderFormContext.updateOrderFormCheckin({
          variables: {
            orderFormId: orderFormContext.orderForm.orderFormId,
            checkin: { isCheckedIn: false },
          },
        })
      }

      if (onOrderFormUpdated) {
        onOrderFormUpdated()
      }
    } catch (e) {
      this.setState({
        isLoading: false,
        AlertMessage: <FormattedMessage id="address-locator.graphql-error" />,
      })
    }
  }

  getIsAddressValid = address => address.city && address.street && address.number

  handleAddressKeyChanged = (e, key) => {
    const { address } = this.state
    if (!address) return
    address[key] = e.target.value
    this.setState({ address })
  }

  handleAddressChanged = e =>
    this.setState({
      address: undefined,
      formattedAddress: e.target.value,
    })

  handleCloseAlert = () => this.setState({ AlertMessage: null })

  canUsePortal = () => Boolean(document && document.body)

  getErrorMessage = errorCode => {
    switch (errorCode) {
      case ERROR_ADDRESS_NOT_FOUND:
        return <FormattedMessage id="address-locator.address-search-not-found-error" />
      case ERROR_TIMEOUT:
        return <FormattedMessage id="address-locator.address-search-timeout-error" />
      case ERROR_POSITION_UNAVAILABLE:
        return <FormattedMessage id="address-locator.address-search-position-unavailable-error" />
      case ERROR_POSITION_DENIED:
        return <FormattedMessage id="address-locator.address-search-position-denied-error" />
      default:
        return null
    }
  }

  renderExtraDataInput = (field, type) => {
    const { intl: { formatMessage } } = this.props
    const { address } = this.state
    if (!address) return null

    return (
      <div className="mb4">
            <Input
              type={type}
              value={address[field]}
              placeholder={formatMessage({ id: `address-locator.address-search-${field}-placeholder`})}
              size="large"
              label={formatMessage({ id: `address-locator.address-search-${field}-label`})}
              onChange={e => this.handleAddressKeyChanged(e, field)}
            />
          </div>
    )
  }

  canSubmit = () => {
    const { address } = this.state
    return address && address.number && address.street
  }

  render() {
    const {
      formattedAddress,
      isLoading,
      inputError,
      AlertMessage,
      shouldDisplayStreetInput,
      hasSearchedStreet,
      shouldDisplayNumberInput,
      shouldDisplayComplementInput,
    } = this.state

    const isDisabled = this.props.loading
    const countryCode = path(['orderForm', 'storePreferencesData', 'countryCode'], this.props.orderFormContext) || 'BRA'

    return (
      <Fragment>
        {AlertMessage &&
          this.canUsePortal() &&
          createPortal(
            <div className="fixed top-0 z-max">
              <Alert type="warning" onClose={this.handleCloseAlert}>
                {AlertMessage}
              </Alert>
            </div>,
            document.body
          )}
        <form className={`${styles.addressSearchForm} w-100`} ref={this.form} onSubmit={this.handleFormSubmit}>
          <div className="mb4">
            {!hasSearchedStreet && (
              <div className="mb4 relative">
                <Autocomplete
                  isLoading={isDisabled}
                  onPlaceSelected={this.handleOnPlaceSelected}
                  types={['address']}
                  componentRestrictions={{ country: countryCode }}
                  value={formattedAddress}
                  errorMessage={this.getErrorMessage(inputError)}
                  onChange={this.handleAddressChanged}
                  onSuffixPress={this.handleSetCurrentPosition}
                  hideLabel
                />
              </div>)
            }

            {shouldDisplayStreetInput && hasSearchedStreet && this.renderExtraDataInput('street', 'text')}
            {shouldDisplayStreetInput && hasSearchedStreet && this.renderExtraDataInput('neighborhood', 'text')}
            {shouldDisplayStreetInput && hasSearchedStreet && this.renderExtraDataInput('postalCode', 'text')}
            {shouldDisplayNumberInput && this.renderExtraDataInput('number', 'number')}
            {shouldDisplayComplementInput && this.renderExtraDataInput('complement', 'text')}

          </div>
          <Button
            className="w-100"
            type="submit"
            isLoading={isLoading}
            block
          >
            <FormattedMessage id="address-locator.address-search-button" />
          </Button>
        </form>
      </Fragment>
    )
  }
}

const LoadingSpinner = () => (
  <div className="flex flex-grow-1 justify-center items-center">
    <Spinner />
  </div>
)

export default compose(
  injectIntl,
  graphql(logisticsQuery, {
    name: 'logisticsQuery',
  }),
  branch(
    props => !props.logisticsQuery.loading,
    compose(
      mapProps(ownerProps => {
        const { googleMapsKey } = ownerProps.logisticsQuery.logistics
        const { onOrderFormUpdated, orderFormContext, updateOrderFormMutation, intl } = ownerProps

        return {
          intl,
          googleMapKey: googleMapsKey,
          googleMapURL: `https://maps.googleapis.com/maps/api/js?key=${googleMapsKey}&v=3.exp&libraries=places`,
          loadingElement: <AddressSearch loading />,
          onOrderFormUpdated: onOrderFormUpdated,
          orderFormContext: orderFormContext,
          updateOrderFormMutation,
        }
      }),
      withScriptjs
    ),
    renderComponent(LoadingSpinner)
  )
)(AddressSearch)
