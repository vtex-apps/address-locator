import React, { Component, Fragment } from 'react'
import { createPortal } from 'react-dom'
import { FormattedMessage } from 'react-intl'
import PropTypes from 'prop-types'
import { withScriptjs } from 'react-google-maps'
import { Adopt } from 'react-adopt'
import { graphql } from 'react-apollo'
import { compose, branch, mapProps, renderComponent } from 'recompose'
import { path } from 'ramda'

import logisticsQuery from '../queries/logistics.gql'
import { StandaloneSearchBox } from 'react-google-maps/lib/components/places/StandaloneSearchBox'
import alpha2ToAlpha3 from 'country-iso-2-to-3'
import { Alert, Button, Input, Spinner } from 'vtex.styleguide'
import { contextPropTypes } from 'vtex.store/OrderFormContext'
import LocationInputIcon from './LocationInputIcon'

/**
 * Geolocation error codes. Can be found here:
 * https://developer.mozilla.org/en-US/docs/Web/API/PositionError
 */
const ERROR_POSITION_DENIED = 1
const ERROR_POSITION_UNAVAILABLE = 2
const ERROR_TIMEOUT = 3
const ERROR_ADDRESS_NOT_FOUND = 9 // custom ad hoc error code

const GEOLOCATION_TIMEOUT = 30*1000

const getCurrentPosition = () => {
  const geolocationOptions = {
    enableHighAccuracy: true,
    timeout: GEOLOCATION_TIMEOUT,
    maximumAge: 0,
  }
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(position => {
      resolve(position)
    }, error => reject(error.code), geolocationOptions)
  })
}
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
    isLoading: false,
    inputError: null,
    inputAddressError: null,
    AlertMessage: false,
    shouldDisplayStreetInput: false,
    hasSearchedStreet: false,
  }

  searchBox = React.createRef()

  handlePlacesChanged = () => {
    const place = this.searchBox.current.getPlaces()[0]
    this.setAddressProperties(place)
  }

  requestGooleMapsApi = async (params) => {
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
        const position = await getCurrentPosition()
        const { latitude, longitude } = position.coords
        const parsedResponse = await this.requestGooleMapsApi({ lat: latitude, long: longitude })

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

  setAddressProperties = place => {
    const address = this.getParsedAddress(place)

    if (!address.city) {
      return this.setState({
        AlertMessage: <FormattedMessage id="address-locator.address-search-invalid-address" />,
        address: null,
        formattedAddress: '',
        shouldDisplayNumberInput: false,
        isLoading: false,
        inputError: null,
        inputAddressError: null,
        shouldDisplayStreetInput: false,
        hasSearchedStreet: false,
      })
    }

    this.setState({
      address,
      formattedAddress: place.formatted_address,
      shouldDisplayNumberInput: address.postalCode ? !address.number : false,
      isLoading: false,
      inputError: null,
      inputAddressError: null,
      AlertMessage: null,
      shouldDisplayStreetInput: !address.postalCode,
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

    const { lat, lng } = path(['geometry', 'location'], place) || {};
    const address = {
      addressType: 'residential',
      city: parsedAddressComponents.administrative_area_level_2,
      complement: '',
      /* Google Maps API returns Alpha-2 ISO codes, but checkout API requires Alpha-3 */
      country: alpha2ToAlpha3(parsedAddressComponents.country),
      neighborhood: parsedAddressComponents.sublocality_level_1,
      number: parsedAddressComponents.street_number || '',
      postalCode: parsedAddressComponents.postal_code,
      receiverName: '',
      state: parsedAddressComponents.administrative_area_level_1,
      street: parsedAddressComponents.route,
      geoCoordinates: lat && lng ? [lat, lng] : null,
    }

    return address
  }

  checkAddressWithGoogle = async () => {
    const { address } = this.state
    try {
      const parsedResponse = await this.requestGooleMapsApi({ address: `${address.street} ${address.number}` })
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
    } catch(err) {
      return null
    }
  }

  handleFormSubmit = async e => {
    e.preventDefault()

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

      const { shippingData } = response.data.updateOrderFormShipping
      const [ selectedAddress ] = shippingData.selectedAddresses

      if (!selectedAddress || !this.getIsAddressValid(selectedAddress)) {
        return this.setState({
          isLoading: false,
          inputError: ERROR_ADDRESS_NOT_FOUND,
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
    const { address } = this.state
    if (!address) return null

    return (
      <Adopt
        mapper={{
          placeholder: (
            <FormattedMessage id={`address-locator.address-search-${field}-placeholder`} />
          ),
          label: <FormattedMessage id={`address-locator.address-search-${field}-label`} />,
        }}
      >
        {({ placeholder, label }) => (
          <Input
            type={type}
            value={address[field]}
            placeholder={placeholder}
            size="large"
            label={label}
            onChange={e => this.handleAddressKeyChanged(e, field)}
          />
        )}
      </Adopt>
    )
  }

  canSubmit = () => {
    const { address } = this.state
    return address && address.number && address.street && address.postalCode
  }

  validatePostalCode = async () => {
    const { address } = this.state
    try {
      const parsedResponse = await this.requestGooleMapsApi({ address: address.street })
      if (!parsedResponse.results.length) {
        return this.setState({
          inputAddressError: ERROR_ADDRESS_NOT_FOUND,
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
        isLoading: false,
        inputError: null,
        inputAddressError: null,
        AlertMessage: null,
        shouldDisplayStreetInput: true,
        hasSearchedStreet: true,
        formattedAddress: place.formatted_address,
      })
    } catch(err) {
      return this.setState({
        inputAddressError: ERROR_ADDRESS_NOT_FOUND,
        isLoading: false,
      })
    }
  }

  onStreetKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.stopPropagation();
      this.validatePostalCode()
    }
  }

  renderStreetInput = () => {
    const { shouldDisplayStreetInput, inputAddressError, address } = this.state
    if (!shouldDisplayStreetInput || !address) return null
    return (
      <Adopt
        mapper={{
          placeholder: (
            <FormattedMessage id={`address-locator.address-search-street-placeholder`} />
          ),
          label: <FormattedMessage id={`address-locator.address-search-street-label`} />,
        }}
      >
        {({ placeholder, label }) => (
          <Input
            type="text"
            value={address.street}
            errorMessage={this.getErrorMessage(inputAddressError)}
            placeholder={placeholder}
            size="large"
            label={label}
            onChange={e => this.handleAddressKeyChanged(e, 'street')}
            suffix={<LocationInputIcon onClick={this.validatePostalCode} />}
            onKeyPress={this.onStreetKeyPress}
          />
        )}
      </Adopt>
    )
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
    } = this.state

    const isDisabled = this.props.loading

    const searchInput = (
      <Adopt
        mapper={{
          placeholder: <FormattedMessage id="address-locator.address-search-placeholder" />,
          label: <FormattedMessage id="address-locator.address-search-label" />,
        }}
      >
        {({ placeholder, label }) => (
          <Input
            key="input"
            type="text"
            value={formattedAddress}
            errorMessage={this.getErrorMessage(inputError)}
            placeholder={placeholder}
            size="large"
            label={label}
            onChange={this.handleAddressChanged}
            suffix={<LocationInputIcon onClick={this.handleSetCurrentPosition} />}
          />
        )}
      </Adopt>
    )

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
        <form className="address-search w-100 pv7 ph6" onSubmit={this.handleFormSubmit}>
          <div className="relative input--icon-right">
            { isDisabled 
              ? searchInput
              : (
                <StandaloneSearchBox ref={this.searchBox} onPlacesChanged={this.handlePlacesChanged}>
                  {searchInput}
                </StandaloneSearchBox>
              )
            }
          </div>
          {this.renderStreetInput()}
          {shouldDisplayStreetInput && hasSearchedStreet && this.renderExtraDataInput('neighborhood', 'text')}
          {shouldDisplayStreetInput && hasSearchedStreet && this.renderExtraDataInput('postalCode', 'text')}
          {shouldDisplayNumberInput && this.renderExtraDataInput('number', 'number')}
          {(!shouldDisplayStreetInput || hasSearchedStreet) && this.renderExtraDataInput('complement', 'text')}
          <Button
            className="w-100"
            type="submit"
            disabled={!this.canSubmit() || isDisabled}
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

export default compose(
  graphql(logisticsQuery, {
    name: 'logisticsQuery',
  }),
  branch(
    props => !props.logisticsQuery.loading,
    compose(
      mapProps(ownerProps => {
        const { googleMapsKey } = ownerProps.logisticsQuery.logistics
        const { onOrderFormUpdated, orderFormContext } = ownerProps

        return {
          googleMapKey: googleMapsKey,
          googleMapURL: `https://maps.googleapis.com/maps/api/js?key=${googleMapsKey}&v=3.exp&libraries=places`,
          loadingElement: <AddressSearch loading />,
          onOrderFormUpdated: onOrderFormUpdated,
          orderFormContext: orderFormContext,
        }
      }),
      withScriptjs
    ),
    renderComponent(Spinner)
  )
)(AddressSearch)
