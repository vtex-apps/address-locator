import React, { Component } from 'react'
import { intlShape } from 'react-intl'
import { withScriptjs } from 'react-google-maps'
import { StandaloneSearchBox } from 'react-google-maps/lib/components/places/StandaloneSearchBox'
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
    selectedPlace: undefined,
  }

  handleSearchBoxMounted = ref => {
    this.searchBox = ref
  }

  handlePlacesChanged = () => {
    const place = this.searchBox.getPlaces()[0]
    this.setState({
      selectedPlace: {
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
      },
    })
  }

  handleSetCurrentPosition = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        this.setState({
          selectedPlace: {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          },
        })
      })
    }
  }

  handleSetAddress = () => {
    const { orderFormContext } = this.props
    const place = this.searchBox.getPlaces()[0]

    /* Reduces Google Maps API of array address components into a simpler consumable object */
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

  render() {
    const placeholder = this.context.intl.formatMessage({ id: 'address-locator.address-search-placeholder' })
    const label = this.context.intl.formatMessage({ id: 'address-locator.address-search-label' })
    const buttonText = this.context.intl.formatMessage({ id: 'address-locator.address-search-button' })

    return (
      <div className="w-100">
        <StandaloneSearchBox
          ref={this.handleSearchBoxMounted}
          onPlacesChanged={this.handlePlacesChanged}
        >
          <Input type="text" placeholder={placeholder} size="large" label={label} />
        </StandaloneSearchBox>
        <Button>{buttonText}</Button>
      </div>
    )
  }
}

export default orderFormConsumer(withScriptjs(AddressSearch))
