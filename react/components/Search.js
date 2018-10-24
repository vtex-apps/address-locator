import React, { Component } from 'react'
import { FormattedMessage } from 'react-intl'
import PropTypes from 'prop-types'
import { withScriptjs } from 'react-google-maps'
import { Adopt } from 'react-adopt'
import { graphql } from 'react-apollo'
import { compose, branch, mapProps, renderComponent } from 'recompose'

import logisticsQuery from '../queries/logistics.gql'
import { StandaloneSearchBox } from 'react-google-maps/lib/components/places/StandaloneSearchBox'
import alpha2ToAlpha3 from 'country-iso-2-to-3'
import Input from 'vtex.styleguide/Input'
import Button from 'vtex.styleguide/Button'
import Spinner from 'vtex.styleguide/Spinner'
import { contextPropTypes } from 'vtex.store/OrderFormContext'
import LocationInputIcon from './LocationInputIcon'

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
  }

  state = {
    address: null,
    formattedAddress: '',
    shouldDisplayNumberInput: false,
    isLoading: false,
    errorMessage: null,
  }

  searchBox = React.createRef()

  handlePlacesChanged = () => {
    const place = this.searchBox.current.getPlaces()[0]
    this.setAddressProperties(place)
  }

  /* Use the navigator geolocation to get the user position and retrieve his address using Google Maps API */
  handleSetCurrentPosition = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async position => {
        const { latitude, longitude } = position.coords
        const rawResponse = await fetch(this.getApiUrlFromCoordinates(latitude, longitude))
        const parsedResponse = await rawResponse.json()

        if (!parsedResponse.results.length) {
          return this.setState({
            errorMessage: true,
          })
        }

        const place = parsedResponse.results[0]
        this.setAddressProperties(place)
      })
    }
  }

  /**
   * Returns Google Maps API geocode URL according to given latlng
   */
  getApiUrlFromCoordinates = (latitude, longitude) => {
    const { googleMapKey } = this.props

    return `https://maps.googleapis.com/maps/api/geocode/json?key=${googleMapKey}&latlng=${latitude},${longitude}`
  }

  setAddressProperties = place => {
    const address = this.getParsedAddress(place)
    this.setState({
      address,
      formattedAddress: place.formatted_address,
      shouldDisplayNumberInput: !address.number,
      errorMessage: null,
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
    }

    return address
  }

  handleFormSubmit = e => {
    e.preventDefault()

    this.setState({
      isLoading: true,
      errorMessage: null,
    })
    const { orderFormContext, onOrderFormUpdated } = this.props
    const { address } = this.state

    orderFormContext
      .updateOrderFormShipping({
        variables: {
          orderFormId: orderFormContext.orderForm.orderFormId,
          address,
        },
      })
      .then(async ({ data }) => {
        const { address } = data.updateOrderFormShipping.shippingData
        if (!this.getIsAddressValid(address)) {
          return this.setState({
            isLoading: false,
            errorMessage: true,
          })
        }

        if (onOrderFormUpdated) {
          await onOrderFormUpdated()
        }
      })
  }

  getIsAddressValid = address => address.city && address.street && address.number

  handleAddressKeyChanged = (e, key) => {
    const { address } = this.state
    address[key] = e.target.value
    this.setState({ address })
  }

  handleAddressChanged = e =>
    this.setState({
      address: undefined,
      formattedAddress: e.target.value,
    })

  render() {
    const {
      address,
      formattedAddress,
      shouldDisplayNumberInput,
      isLoading,
      errorMessage,
    } = this.state

    return (
      <form className="address-search w-100 pv7 ph6" onSubmit={this.handleFormSubmit}>
        <div className="relative input--icon-right">
          <StandaloneSearchBox ref={this.searchBox} onPlacesChanged={this.handlePlacesChanged}>
            <Adopt
              mapper={{
                placeholder: <FormattedMessage id="address-locator.address-search-placeholder" />,
                label: <FormattedMessage id="address-locator.address-search-label" />,
                errorMessageText: <FormattedMessage id="address-locator.address-search-error" />,
              }}
            >
              {({ placeholder, label, errorMessageText }) => (
                <Input
                  type="text"
                  value={formattedAddress}
                  errorMessage={errorMessage ? errorMessageText : ''}
                  placeholder={placeholder}
                  size="large"
                  label={label}
                  onChange={this.handleAddressChanged}
                />
              )}
            </Adopt>
          </StandaloneSearchBox>
          <span className="absolute bottom-0 pv4 right-1">
            <LocationInputIcon onClick={this.handleSetCurrentPosition} />
          </span>
        </div>
        {address &&
          shouldDisplayNumberInput && (
            <Adopt
              mapper={{
                placeholder: (
                  <FormattedMessage id="address-locator.address-search-number-placeholder" />
                ),
                label: <FormattedMessage id="address-locator.address-search-number-label" />,
              }}
            >
              {({ placeholder, label }) => (
                <Input
                  type="number"
                  value={address.number}
                  placeholder={placeholder}
                  size="large"
                  label={label}
                  onChange={e => this.handleAddressKeyChanged(e, 'number')}
                />
              )}
            </Adopt>
          )}
        {address && (
          <Adopt
            mapper={{
              placeholder: (
                <FormattedMessage id="address-locator.address-search-complement-placeholder" />
              ),
              label: <FormattedMessage id="address-locator.address-search-complement-label" />,
            }}
          >
            {({ placeholder, label }) => (
              <Input
                type="text"
                value={address.complement}
                placeholder={placeholder}
                size="large"
                label={label}
                onChange={e => this.handleAddressKeyChanged(e, 'complement')}
              />
            )}
          </Adopt>
        )}
        <Adopt
          mapper={{
            text: <FormattedMessage id="address-locator.address-search-button" />,
          }}
        >
          {({ text }) => (
            <Button
              className="w-100"
              type="submit"
              disabled={!address || !address.number}
              isLoading={isLoading}
              block
            >
              {text}
            </Button>
          )}
        </Adopt>
      </form>
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
          loadingElement: <div className="h-100" />,
          onOrderFormUpdated: onOrderFormUpdated,
          orderFormContext: orderFormContext,
        }
      }),
      withScriptjs
    ),
    renderComponent(Spinner)
  )
)(AddressSearch)
