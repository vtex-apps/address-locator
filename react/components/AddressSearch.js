import React, { Component } from 'react'
import { FormattedMessage } from 'react-intl'
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
import { Adopt } from 'react-adopt'

class AddressSearch extends Component {
  static propTypes = {
    /* Context used to call address mutation and retrieve the orderForm */
    orderFormContext: contextPropTypes,
  }

  state = {
    address: null,
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
      shouldDisplayNumberInput: !address.number,
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
    const { address, formattedAddress, shouldDisplayNumberInput } = this.state

    return (
      <div className="w-100">
        <div className="input-wrapper input-wrapper--icon-right">
          <StandaloneSearchBox
            ref={this.handleSearchBoxMounted}
            onPlacesChanged={this.handlePlacesChanged}
          >
            <Adopt mapper={{
              placeholder: <FormattedMessage id="address-locator.address-search-placeholder" />,
              label: <FormattedMessage id="address-locator.address-search-label" />,
            }}>
              {({ placeholder, label }) => (
                <Input
                  type="text"
                  value={formattedAddress}
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
        {(address && shouldDisplayNumberInput) && (
          <Adopt mapper={{
            placeholder: <FormattedMessage id="address-locator.address-search-number-placeholder" />,
            label: <FormattedMessage id="address-locator.address-search-number-label" />,
          }}>
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
          <Adopt mapper={{
            placeholder: <FormattedMessage id="address-locator.address-search-complement-placeholder" />,
            label: <FormattedMessage id="address-locator.address-search-complement-label" />,
          }}>
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
        <Adopt mapper={{
          text: <FormattedMessage id="address-locator.address-search-button" />,
        }}>
          {({ text }) => (
            <Button disabled={!address || !address.number}>{text}</Button>
          )}
        </Adopt>
      </div>
    )
  }
}

export default orderFormConsumer(withScriptjs(AddressSearch))
