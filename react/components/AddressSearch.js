import React, { Component } from 'react'
import { FormattedMessage } from 'react-intl'
import PropTypes from 'prop-types'
import { withScriptjs } from 'react-google-maps'
import { Adopt } from 'react-adopt'
import { StandaloneSearchBox } from 'react-google-maps/lib/components/places/StandaloneSearchBox'
import alpha2ToAlpha3 from 'country-iso-2-to-3'
import Input from 'vtex.styleguide/Input'
import Button from 'vtex.styleguide/Button'
import { orderFormConsumer, contextPropTypes } from 'vtex.store/OrderFormContext'
import LocationInputIcon from './LocationInputIcon'

class AddressSearch extends Component {
  static propTypes = {
    /* Context used to call address mutation and retrieve the orderForm */
    orderFormContext: contextPropTypes,
    /* Google Maps Geolocation API key */
    googleMapKey: PropTypes.string,
    /* Function that will be called after updating the orderform */
    onOrderFormUpdated: PropTypes.func,
  }

  state = {
    address: null,
    formattedAddress: '',
    shouldDisplayNumberInput: false,
    errorMessage: false,
    isLoading: false,
  }

  searchBox = React.createRef()

  handlePlacesChanged = () => {
    const place = this.searchBox.current.getPlaces()[0]
    this.setAddressProperties(place)
  }

  handleSetCurrentPosition = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
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
      errorMessage: false,
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
    const parsedAddressComponents = place.address_components.reduce(
      (accumulator, address) => {
        const parsedItem = address.types.reduce(
          (accumulator, type) => ({ ...accumulator, [type]: address.short_name }),
          {}
        )
        return { ...accumulator, ...parsedItem }
      },
      {}
    )

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
      .then(() => {
        if (onOrderFormUpdated) {
          onOrderFormUpdated()
        }
        orderFormContext.refetch()
        this.setState({
          isLoading: false,
        })
      })
  }

  handleAddressKeyChanged = (e, key) => {
    const { address } = this.state
    address[key] = e.target.value
    this.setState({ address })
  }

  handleAddressChanged = e => {
    this.setState({
      address: undefined,
      formattedAddress: e.target.value,
    })
  }

  render() {
    const { address, formattedAddress, shouldDisplayNumberInput, errorMessage, isLoading } = this.state

    return (
      <div className="vtex-address-search w-100 pv7 ph6 br2 bg-white">
        <form onSubmit={this.handleFormSubmit}>
          <div className="relative vtex-input--icon-right">
            <StandaloneSearchBox
              ref={this.searchBox}
              onPlacesChanged={this.handlePlacesChanged}
            >
              <Adopt mapper={{
                placeholder: <FormattedMessage id="address-locator.address-search-placeholder" />,
                label: <FormattedMessage id="address-locator.address-search-label" />,
                errorMessageText: <FormattedMessage id="address-locator.address-search-error" />,
              }}>
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
            <LocationInputIcon onClick={this.handleSetCurrentPosition} />
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
                  type="text"
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
                <div className="mb5">
                  <Input
                    type="text"
                    value={address.complement}
                    placeholder={placeholder}
                    size="large"
                    label={label}
                    onChange={e => this.handleAddressKeyChanged(e, 'complement')}
                  />
                </div>
              )}
            </Adopt>
          )}
          <Adopt
            mapper={{
              text: <FormattedMessage id="address-locator.address-search-button" />,
            }}
          >
            {({ text }) => (
              <Button type="submit" disabled={!address || !address.number} isLoading={isLoading}>{text}</Button>
            )}
          </Adopt>
        </form>
      </div>
    )
  }
}

export default orderFormConsumer(withScriptjs(AddressSearch))
