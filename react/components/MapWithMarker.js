import React from 'react'

import { injectIntl, intlShape } from 'react-intl'

import { withScriptjs, withGoogleMap, GoogleMap } from 'react-google-maps'
import { MarkerWithLabel } from 'react-google-maps/lib/components/addons/MarkerWithLabel'

import Popover from './Popover'

const MapWithMarker = withScriptjs(withGoogleMap(({ marker, intl }) => {
  const popoverTitle = intl.formatMessage({ id: 'address-locator.popover.title' })
  const popoverButton = intl.formatMessage({ id: 'address-locator.popover.button' })

  return (
    <GoogleMap
      defaultZoom={18}
      center={marker}
    >
      <MarkerWithLabel
        position={marker}
        labelAnchor={new google.maps.Point(128, 144)}
      >
        <Popover
          titleText={popoverTitle}
          buttonText={popoverButton}
        />
      </MarkerWithLabel>
    </GoogleMap>
  )
}
))

MapWithMarker.propTypes = { intl: intlShape.isRequired }

export default injectIntl(MapWithMarker)
