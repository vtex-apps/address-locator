import React from 'react'
import { injectIntl, intlShape } from 'react-intl'
import { withScriptjs } from 'react-google-maps'
import { StandaloneSearchBox } from 'react-google-maps/lib/components/places/StandaloneSearchBox'
import Input from 'vtex.styleguide/Input'
import Button from 'vtex.styleguide/Button'

class AddressSearch extends React.Component {
  state = {
    selectedPlace: undefined,
  }

  handleSearchBoxMounted = (ref) => {
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
    const { intl } = this.props

    const placeholder = intl.formatMessage({ id: 'address-locator.enter-address' })
    const label = intl.formatMessage({ id: 'address-locator.address-label' })
    const buttonText = intl.formatMessage({ id: 'address-locator.tab-1-button' })

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

AddressSearch.propTypes = { intl: intlShape.isRequired }

export default injectIntl(withScriptjs(AddressSearch))
