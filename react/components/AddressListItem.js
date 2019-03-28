import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { pick } from 'ramda'

export default class AddressListItem extends Component {
  static propTypes = {
    /* Address object from available addresses */
    address: PropTypes.object,
    /* Defines if it is the last address of the list */
    isLastAddress: PropTypes.bool,
    /* Function that will be called when selecting the address */
    onSelectAddress: PropTypes.func,
  }

  handleClick = () => {
    const { onSelectAddress, address } = this.props
    const addressFields = pick([
        'addressType',
        'city',
        'complement',
        'neighborhood',
        'number',
        'postalCode',
        'street',
        'state',
        'receiverName',
        'country',
        'geoCoordinates'
      ],
      address,
    )

    onSelectAddress && onSelectAddress(addressFields)
  }
  render() {
    const { isLastAddress, address } = this.props
    const { street, number, neighborhood, city } = address
    return (
      <div
        className={`${!isLastAddress && 'bb b--light-gray'} pv4 dim pointer`}
        onClick={this.handleClick}
      >
        <p className="ma0 t-body c-on-base">{`${street}, ${number}`}</p>
        <span className="f7 t-small c-muted-2">{`${neighborhood}, ${city}`}</span>
      </div>
    )
  }
}
