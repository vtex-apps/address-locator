import React, { Component } from 'react'
import { intlShape } from 'react-intl'
import { withScriptjs } from 'react-google-maps'

import { StandaloneSearchBox } from 'react-google-maps/lib/components/places/StandaloneSearchBox'
import LocationInputIcon from './LocationInputIcon'
import Input from 'vtex.styleguide/Input'
import Button from 'vtex.styleguide/Button'
import {
  orderFormConsumer,
  contextPropTypes,
} from 'vtex.store/OrderFormContext'
import { alpha2ToAlpha3 } from 'i18n-iso-countries'

class AddressSearch extends Component {
  static propTypes = {
    /* Context used to call address mutation and retrieve the orderForm */
    orderFormContext: contextPropTypes,
  }

  static contextTypes = {
    intl: intlShape,
  }

  state = {
    address: undefined,
    shouldDisplayNumberInput: false,
  }

  handleSearchBoxMounted = ref => {
    this.searchBox = ref
  }

  handlePlacesChanged = () => {
    const place = this.searchBox.getPlaces()[0]
    const address = this.getParsedAddress(place)
    this.setState({
      address,
      shouldDisplayNumberInput: !address.number,
    })
  }

  handleSetCurrentPosition = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        (async () => {
          const { latitude, longitude } = position.coords
          /* @TODO: API key is hardcoded for now, it has to be defined dinamically according to the Geolocation API configuration */
          const rawResponse = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?key=AIzaSyDs38ci8GZYCA0VSaA4KGoEHV06g9gTSwk&latlng=${latitude},${longitude}`)
          const parsedResponse = await rawResponse.json()
          const address = this.getParsedAddress(parsedResponse.results[0])
          this.setState({ address })
        })()
      })
    }
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
      number: parsedAddressComponents.street_number,
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

  handleAddressValueChanged = (e, key) => {
    const { address } = this.state
    address[key] = e.target.value
    this.setState({ address })
  }

  render() {
    const { address, shouldDisplayNumberInput } = this.state
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
            <Input type="text" placeholder={addressInputPlaceholder} size="large" label={addressInputLabel} />
          </StandaloneSearchBox>
          <LocationInputIcon onClick={this.handleSetCurrentPosition} />
        </div>
        {(address && shouldDisplayNumberInput) && (
          <Input type="text" placeholder={numberInputPlaceholder} size="large" label={numberInputLabel} onChange={(e) => this.handleAddressValueChanged(e, 'number')} />
        )}
        {address && (
          <Input type="text" placeholder={complementInputPlaceholder} size="large" label={complementInputLabel} onChange={(e) => this.handleAddressValueChanged(e, 'complement')} />
        )}
        <Button disabled={!address || !address.number}>{buttonText}</Button>
      </div>
    )
  }
}

export default orderFormConsumer(withScriptjs(AddressSearch))
