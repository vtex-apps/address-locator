import React, { Fragment } from 'react';
import Map from './Map';

import { compose, withProps, lifecycle } from 'recompose'
import { withScriptjs, withGoogleMap, GoogleMap, Marker } from "react-google-maps"
import { StandaloneSearchBox } from 'react-google-maps/lib/components/places/StandaloneSearchBox'

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
)(props =>
  <div className="w-100">
    <StandaloneSearchBox
      ref={props.onSearchBoxMounted}
      bounds={props.bounds}
      onPlacesChanged={props.onPlacesChanged}
    >
      <input
        type="text"
        placeholder="Enter your address"
      />
    </StandaloneSearchBox>

    {typeof props.place !== typeof undefined && (
      <Fragment>
        <p>
          {props.place.formatted_address}
        </p>

        <Map marker={{ lat: props.place.geometry.location.lat(), lng: props.place.geometry.location.lng() }} />
      </Fragment>
    )}

  </div>
);

export default SearchMap