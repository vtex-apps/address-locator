import React, { Component } from 'react'
import { intlShape } from 'react-intl'
import { withScriptjs } from 'react-google-maps'

import { StandaloneSearchBox } from 'react-google-maps/lib/components/places/StandaloneSearchBox'
import LocationInputIcon from './LocationInputIcon'
import Input from 'vtex.styleguide/Input'
import Button from 'vtex.styleguide/Button'

class AddressSearch extends Component {
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

  render() {
    const placeholder = this.context.intl.formatMessage({ id: 'address-locator.address-search-placeholder' })
    const label = this.context.intl.formatMessage({ id: 'address-locator.address-search-label' })
    const buttonText = this.context.intl.formatMessage({ id: 'address-locator.address-search-button' })

    return (
      <div className="w-100">
        <div className="input-wrapper input-wrapper--icon-right">
          <StandaloneSearchBox
            ref={this.handleSearchBoxMounted}
            onPlacesChanged={this.handlePlacesChanged}
          >
            <Input type="text" placeholder={placeholder} size="large" label={label} />
          </StandaloneSearchBox>
          <LocationInputIcon />
        </div>
        <Button>{buttonText}</Button>
      </div>
    )
  }
}

export default withScriptjs(AddressSearch)
