import React from 'react';
import { withScriptjs, withGoogleMap, GoogleMap, Marker } from "react-google-maps"

const MapWithMarker = withScriptjs(withGoogleMap((props) =>
  <GoogleMap
    defaultZoom={18}
    center={props.marker}
  >
    <Marker
      position={props.marker}
      title="Click to zoom"
    />
  </GoogleMap>
))

export default class Map extends React.Component {
  render() {
    return (
      <div>
        <MapWithMarker
          googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyCUbzqhN6HZoty-UigCHG4bitF-Vl2GU7U&v=3.exp&libraries=geometry,drawing,places"
          loadingElement={<div style={{ height: `100%` }} />}
          containerElement={<div style={{ height: `400px` }} />}
          mapElement={<div style={{ height: `100%` }} />}
          marker={this.props.marker}
          isMarkerShown
        />
      </div>
    )
  }
}