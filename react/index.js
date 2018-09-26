import React, { Fragment } from 'react';

import { compose, withProps, lifecycle } from 'recompose'
import { withScriptjs, withGoogleMap, GoogleMap, Marker } from "react-google-maps"
import { StandaloneSearchBox } from 'react-google-maps/lib/components/places/StandaloneSearchBox'

const PlacesWithStandaloneSearchBox = compose(
  withProps({
    googleMapURL: "https://maps.googleapis.com/maps/api/js?key=AIzaSyCUbzqhN6HZoty-UigCHG4bitF-Vl2GU7U&v=3.exp&libraries=geometry,drawing,places",
    loadingElement: <div style={{ height: `100%` }} />,
    containerElement: <div style={{ height: `400px` }} />,
  }),
  lifecycle({
    componentWillMount() {
      const refs = {}
      this.setState({
        places: [],
        onSearchBoxMounted: ref => {
          refs.searchBox = ref;
        },
        onPlacesChanged: () => {
          const places = refs.searchBox.getPlaces();
          this.setState({
            places,
          });
        },
      })
    },
  }),
  withScriptjs  
)(props =>  
    <div>
        <StandaloneSearchBox
        ref={props.onSearchBoxMounted}
        bounds={props.bounds}
        onPlacesChanged={props.onPlacesChanged}
        >
        <input
            type="text"
            placeholder="Enter"
        />
        </StandaloneSearchBox>
        <ol>
        {props.places.map(({ place_id, formatted_address, geometry: { location } }) =>
            <li key={place_id}>
            {formatted_address}
            {" at "}
            ({location.lat()}, {location.lng()})
            </li>
        )}
        </ol>
    </div>
);

export default PlacesWithStandaloneSearchBox