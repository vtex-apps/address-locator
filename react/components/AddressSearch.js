import React, { Component } from 'react'
import { FormattedMessage } from 'react-intl'
import { withScriptjs } from 'react-google-maps'
import { StandaloneSearchBox } from 'react-google-maps/lib/components/places/StandaloneSearchBox'
import InputSearch from 'vtex.styleguide/InputSearch'
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
    return (
      <div className="w-100">
        <StandaloneSearchBox
          ref={this.handleSearchBoxMounted}
          onPlacesChanged={this.handlePlacesChanged}
        >
          <FormattedMessage id="address-locator.enter-address" tagName="div">
            {placeholder => (
              <InputSearch type="text" placeholder={placeholder} size="large" />
            )}
          </FormattedMessage>
        </StandaloneSearchBox>
        <Button onClick={this.handleSetCurrentPosition}>
          <FormattedMessage id="address-locator.current-location" />
        </Button>
        <Button onClick={this.handleSetAddress}>order on this address</Button>
      </div>
    )
  }
}

export default orderFormConsumer(withScriptjs(AddressSearch))
