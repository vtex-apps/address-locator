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
      </div>
    )
  }
}

export default orderFormConsumer(withScriptjs(AddressSearch))
