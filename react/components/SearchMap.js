import React, { Fragment } from 'react';
import { injectIntl, intlShape } from 'react-intl'
import Map from './Map';

import { compose, withProps, lifecycle } from 'recompose'
import { withScriptjs, withGoogleMap, GoogleMap, Marker } from "react-google-maps"
import { StandaloneSearchBox } from 'react-google-maps/lib/components/places/StandaloneSearchBox'

import InputSearch from 'vtex.styleguide/InputSearch'

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
        place: undefined,
        onSearchBoxMounted: ref => {
          refs.searchBox = ref;
        },
        onPlacesChanged: () => {
          const place = refs.searchBox.getPlaces()[0];
          this.setState({
            place,
          });
        },
      })
    },
  }),
  withScriptjs  
)(({place, onSearchBoxMounted, bounds, onPlacesChanged, intl}) =>  
  <div className="w-100">
      <StandaloneSearchBox
        ref={onSearchBoxMounted}
        bounds={bounds}
        onPlacesChanged={onPlacesChanged}
      >
        <InputSearch
            type="text"
            placeholder={intl.formatMessage({id:'address-locator.enter-address'})}
            size="x-large"
        />
      </StandaloneSearchBox>

    {place && (
      <Fragment>
        <p>
          {place.formatted_address}
        </p>

        <Map marker={{ lat: place.geometry.location.lat(), lng: place.geometry.location.lng() }} />
      </Fragment>
    )}

  </div>
);

SearchMap.propTypes = { intl: intlShape.isRequired }

export default injectIntl(SearchMap)