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
    selectedPlace: undefined,
  }

  handleSearchBoxMounted = ref => {
    this.searchBox = ref
  }

  handlePlacesChanged = () => {
    const place = this.searchBox.getPlaces()[0]
    const address = this.getParsedAddress(place)
    this.setState({ address })
  }

  handleSetCurrentPosition = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        const currentLatLng = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        }
        /* @TODO: API call to get address based on latlng */
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
      .then(res => {
        /* TODO */
      })
  }

  render() {
    const addressInputPlaceholder = this.context.intl.formatMessage({ id: 'address-locator.address-search-placeholder' })
    const addressInputLabel = this.context.intl.formatMessage({ id: 'address-locator.address-search-label' })
    const numberInputPlaceholder = this.context.intl.formatMessage({ id: 'address-locator.address-search-number-placeholder' })
    const numberInputLabel = this.context.intl.formatMessage({ id: 'address-locator.address-search-number-label' })
    const complementInputPlaceholder = this.context.intl.formatMessage({ id: 'address-locator.address-search-complement-placeholder' })
    const complementInputLabel = this.context.intl.formatMessage({ id: 'address-locator.address-search-complement-label' })
    const buttonText = this.context.intl.formatMessage({ id: 'address-locator.address-search-button' })

    return (
      <div className="w-100">
        <div className="input-wrapper input-wrapper--icon-right">
          <StandaloneSearchBox
            ref={this.handleSearchBoxMounted}
            onPlacesChanged={this.handlePlacesChanged}
          >
            <Input type="text" placeholder={addressInputPlaceholder} size="large" label={addressInputLabel} />
          </StandaloneSearchBox>
          <LocationInputIcon />
        </div>
        {(this.state.address && !this.state.address.number) && (
          <Input type="text" placeholder={numberInputPlaceholder} size="large" label={numberInputLabel} />
        )}
        {(this.state.address && !this.state.address.complement) && (
          <Input type="text" placeholder={complementInputPlaceholder} size="large" label={complementInputLabel} />
        )}
        <Button>{buttonText}</Button>
      </div>
    )
  }
}

export default orderFormConsumer(withScriptjs(AddressSearch))
