import React, { Component } from 'react'
import PropTypes from 'prop-types'

export default class AddressListItem extends Component {
  static propTypes = {
    /* Address object from available addresses */
    address: PropTypes.object,
    /* Defines if it is the last address of the list */
    isLastAddress: PropTypes.bool,
    /* Function that will be called when selecting the address */
    onSelectAddress: PropTypes.func,
  }

  /* Picks selected fields from a source object */
  pick = (source, ...fields) =>
    fields.reduce((prev, field) => ((prev[field] = source[field]), prev), {})
  handleClick = () => {
    const { onSelectAddress, address } = this.props
    const addressFields = this.pick(
      address,
      'addressType',
      'city',
      'complement',
      'neighborhood',
      'number',
      'postalCode',
      'street'
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
        <p className="ma0">{`${street}, ${number}`}</p>
        <span className="f7 mid-gray">{`${neighborhood}, ${city}`}</span>
      </div>
    )
  }
}
