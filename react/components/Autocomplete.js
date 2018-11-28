import React from 'react'
import PropTypes from 'prop-types'
import { Adopt } from 'react-adopt'
import { Input } from 'vtex.styleguide'
import { FormattedMessage } from 'react-intl'

import LocationInputIcon from './LocationInputIcon'

/*

Based on: https://github.com/ErrorPro/react-google-autocomplete/blob/master/src/index.js

*/

export default class ReactGoogleAutocomplete extends React.Component {
  static propTypes = {
    onPlaceSelected: PropTypes.func,
    types: PropTypes.arrayOf(PropTypes.string),
    componentRestrictions: PropTypes.shape({
      country: PropTypes.string,
    }),
    bounds: PropTypes.object,
    isLoading: PropTypes.bool,
    value: PropTypes.string,
    errorMessage: PropTypes.string,
    onChange: PropTypes.func,
    onSuffixPress: PropTypes.func,
  }

  constructor(props) {
    super(props)
    this.input = React.createRef()
    this.autocomplete = null
    this.event = null
  }

  setup = () => {
    const { types = ['(cities)'], componentRestrictions, bounds } = this.props
    const config = {
      types,
      bounds,
    }

    if (componentRestrictions) {
      config.componentRestrictions = componentRestrictions
    }

    this.disableAutofill()

    this.autocomplete = new google.maps.places.Autocomplete(this.input.current, config)

    this.event = this.autocomplete.addListener('place_changed', this.onSelected.bind(this))
  }

  componentDidUpdate(prevProps) {
    if (prevProps.isLoading && !this.props.isLoading) {
      this.setup()
    }
  }

  disableAutofill() {
    // Autofill workaround adapted from https://stackoverflow.com/questions/29931712/chrome-autofill-covers-autocomplete-for-google-maps-api-v3/49161445#49161445
    if (window.MutationObserver) {
      const observerHack = new MutationObserver(() => {
        observerHack.disconnect()
        if (this.input.current) {
          this.input.current.autocomplete = 'disable-autofill'
        }
      })
      observerHack.observe(this.input.current, {
        attributes: true,
        attributeFilter: ['autocomplete'],
      })
    }
  }

  componentWillUnmount() {
    this.event.remove()
  }

  onSelected() {
    if (this.props.onPlaceSelected) {
      this.props.onPlaceSelected(this.autocomplete.getPlace())
    }
  }

  render() {
    const { value, errorMessage, onChange, onSuffixPress } = this.props

    return (
      <Adopt
        mapper={{
          placeholder: <FormattedMessage id="address-locator.address-search-placeholder" />,
          label: <FormattedMessage id="address-locator.address-search-label" />,
        }}
      >
        {({ placeholder, label }) => (
          <Input
            ref={this.input}
            key="input"
            type="text"
            value={value}
            errorMessage={errorMessage}
            placeholder={placeholder}
            size="large"
            label={label}
            onChange={onChange}
            suffix={<LocationInputIcon onClick={onSuffixPress} />}
          />
        )}
      </Adopt>
    )
  }
}
