import React, { Component } from 'react'
import { intlShape } from 'react-intl'
import { withScriptjs } from 'react-google-maps'
import { StandaloneSearchBox } from 'react-google-maps/lib/components/places/StandaloneSearchBox'
import { alpha2ToAlpha3 } from 'i18n-iso-countries'
import Input from 'vtex.styleguide/Input'
import Button from 'vtex.styleguide/Button'
import {
  orderFormConsumer,
  contextPropTypes,
} from 'vtex.store/OrderFormContext'

import LocationInputIcon from './LocationInputIcon'

class AddressSearch extends Component {
  static propTypes = {
    /* Context used to call address mutation and retrieve the orderForm */
    orderFormContext: contextPropTypes,
  }

  static contextTypes = {
    intl: intlShape,
  }

  state = {
    address: {
      number: '',
      complement: '',
    },
    formattedAddress: '',
    shouldDisplayNumberInput: false,
  }

  handleSearchBoxMounted = ref => {
    this.searchBox = ref
  }

  handlePlacesChanged = () => {
    const place = this.searchBox.getPlaces()[0]
    this.setAddressProperties(place)
  }

  handleSetCurrentPosition = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        (async () => {
          const { latitude, longitude } = position.coords
          /* @TODO: API key is hardcoded for now, it has to be defined dinamically according to the Geolocation API configuration */
          const rawResponse = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?key=AIzaSyDs38ci8GZYCA0VSaA4KGoEHV06g9gTSwk&latlng=${latitude},${longitude}`)
          const parsedResponse = await rawResponse.json()
          const place = parsedResponse.results[0]
          this.setAddressProperties(place)
        })()
      })
    }
  }

  setAddressProperties = place => {
    const address = this.getParsedAddress(place)
    this.setState({
      address,
      formattedAddress: place.formatted_address,
      shouldDisplayNumberInput: !address.number
    })
  }

  /**
   * Reduces Google Maps API of array address components into a simpler consumable object
   */
  getParsedAddress = place => {
    const parsedAddressComponents = place.address_components.reduce(
      (prev, curr) => {
        const parsedItem = curr.types.reduce(
          (prev, type) => ({ ...prev, [type]: curr.short_name }),
          {}
        )
        return { ...prev, ...parsedItem }
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

  handleSetAddress = () => {
    const { orderFormContext } = this.props
    const { address } = this.state

    orderFormContext
      .updateOrderFormShipping({
        variables: {
          orderFormId: orderFormContext.orderForm.orderFormId,
          address,
        },
      })
      .then(() => {
        /* TODO */
      })
  }

  handleAddressKeyChanged = (key, e) => {
    const { address } = this.state
    address[key] = e.target.value
    this.setState({ address })
  }

  handleAddressChanged = e => {
    this.setState({
      address: undefined,
      formattedAddress: e.target.value
    })
  }

  render() {
    const { address, formattedAddress, shouldDisplayNumberInput } = this.state
    const { intl } = this.context
    const addressInputPlaceholder = intl.formatMessage({ id: 'address-locator.address-search-placeholder' })
    const addressInputLabel = intl.formatMessage({ id: 'address-locator.address-search-label' })
    const numberInputPlaceholder = intl.formatMessage({ id: 'address-locator.address-search-number-placeholder' })
    const numberInputLabel = intl.formatMessage({ id: 'address-locator.address-search-number-label' })
    const complementInputPlaceholder = intl.formatMessage({ id: 'address-locator.address-search-complement-placeholder' })
    const complementInputLabel = intl.formatMessage({ id: 'address-locator.address-search-complement-label' })
    const buttonText = intl.formatMessage({ id: 'address-locator.address-search-button' })

    return (
      <div className="w-100">
        <div className="input-wrapper input-wrapper--icon-right">
          <StandaloneSearchBox
            ref={this.handleSearchBoxMounted}
            onPlacesChanged={this.handlePlacesChanged}
          >
            <Input type="text" value={formattedAddress} placeholder={addressInputPlaceholder} size="large" label={addressInputLabel} onChange={this.handleAddressChanged} />
          </StandaloneSearchBox>
          <LocationInputIcon onClick={this.handleSetCurrentPosition} />
        </div>
        {(address && shouldDisplayNumberInput) && (
          <Input type="text" value={address.number} placeholder={numberInputPlaceholder} size="large" label={numberInputLabel} onChange={this.handleAddressKeyChanged.bind(this, 'number')} />
        )}
        {address && (
          <Input type="text" value={address.complement} placeholder={complementInputPlaceholder} size="large" label={complementInputLabel} onChange={this.handleAddressKeyChanged.bind(this,'complement')} />
        )}
        <Button disabled={!address || !address.number}>{buttonText}</Button>
      </div>
    )
  }
}

export default orderFormConsumer(withScriptjs(AddressSearch))
