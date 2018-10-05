import React, { Component } from 'react'
import PropTypes from 'prop-types'

class AddressListItem extends Component {
  static propTypes = {
    address: PropTypes.object,
    isLastAddress: PropTypes.bool,
    onSelectAddress: PropTypes.func,
  }

  pick = (source, ...fields) => fields.reduce((prev, field) => ((prev[field] = source[field]), prev), {})
  handleClick = () => {
    const { onSelectAddress, address } = this.props

    const addressFields = this.pick(
      address,
      'addressType',
      'city',
      'complement',
      'country',
      'number',
      'postalCode',
      'receiverName',
      'state',
      'street'
    )

    onSelectAddress && onSelectAddress(addressFields)
  }
  render() {
    const { isLastAddress, address } = this.props
    const { street, number, neighborhood, city } = address
    return (
      <div className={`${!isLastAddress && 'bb b--light-gray'} pv4`} onClick={this.handleClick}>
        <p className="mb2 mt0">{`${street}, ${number}`}</p>
        <span className="f7 dark-gray">{`${neighborhood}, ${city}`}</span>
      </div>
    )
  }
}

export default AddressListItem
