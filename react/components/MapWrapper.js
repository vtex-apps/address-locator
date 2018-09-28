import React from 'react'

import MapWithMarker from './MapWithMarker'

const MapWrapper = ({ marker }) => (
  <div>
    <MapWithMarker
      googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyCUbzqhN6HZoty-UigCHG4bitF-Vl2GU7U&v=3.exp&libraries=geometry,drawing,places"
      loadingElement={<div style={{ height: '100%' }} />}
      containerElement={<div style={{ height: '600px' }} />}
      mapElement={<div style={{ height: '100%' }} />}
      marker={marker}
      isMarkerShown
    />
  </div>
)

export default MapWrapper
