import React from 'react';
import { injectIntl, intlShape } from 'react-intl'

import { compose, withProps, lifecycle } from 'recompose'

import { withScriptjs } from "react-google-maps"
import { StandaloneSearchBox } from 'react-google-maps/lib/components/places/StandaloneSearchBox'

import MapWrapper from './MapWrapper';
import InputSearch from 'vtex.styleguide/InputSearch'
import Button from 'vtex.styleguide/Button'

const SearchMap = compose(
  withProps({
    googleMapURL: "https://maps.googleapis.com/maps/api/js?key=AIzaSyCUbzqhN6HZoty-UigCHG4bitF-Vl2GU7U&v=3.exp&libraries=geometry,drawing,places",
    loadingElement: <div style={{ height: `100%` }} />,
    containerElement: <div style={{ height: `400px` }} />,
  }),
  lifecycle({
    componentWillMount() {
      const refs = {}
      this.setState({
        selectedPlace: undefined,

        onSearchBoxMounted: ref => {
          refs.searchBox = ref;
        },

        onPlacesChanged: () => {
          const place = refs.searchBox.getPlaces()[0];
          this.setState({
            selectedPlace: {
              lat: place.geometry.location.lat(),
              lng: place.geometry.location.lng()
            },
          });
        },

        setCurrentPosition: () => {
          if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
              this.setState({
                selectedPlace: {
                  lat: position.coords.latitude,
                  lng: position.coords.longitude
                }
              })
            })
          }
        }
      })
    }
  }),
  withScriptjs
)(({ selectedPlace, onSearchBoxMounted, bounds, onPlacesChanged, setCurrentPosition, intl }) => {
  const placeholder = intl.formatMessage({ id: "address-locator.enter-address" });
  const buttonText = intl.formatMessage({ id: 'address-locator.current-location' })

  return (
    <div className="w-100">
      <StandaloneSearchBox
        ref={onSearchBoxMounted}
        bounds={bounds}
        onPlacesChanged={onPlacesChanged}
      >
        <InputSearch type="text" placeholder={placeholder} size="x-large" />
      </StandaloneSearchBox>
      <Button onClick={setCurrentPosition}>{buttonText}</Button>
    </div>
  )
})

SearchMap.propTypes = { intl: intlShape.isRequired }

export default injectIntl(SearchMap)