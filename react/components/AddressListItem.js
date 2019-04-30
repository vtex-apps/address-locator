import React from 'react'
import PropTypes from 'prop-types'
import { pick } from 'ramda'

const AddressListItem = ({ address, onSelectAddress, isLastAddress }) => {
  const handleClick = () => {
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

  const { street, number, neighborhood, city } = address
  return (
    <div
      className={`${!isLastAddress && 'bb b--muted-4'} pv4 dim pointer`}
      onClick={handleClick}
    >
      <p className="ma0 t-body c-on-base">{`${street}, ${number}`}</p>
      <span className="f7 t-small c-muted-2">{!neighborhood ? city : `${neighborhood}, ${city}` }</span>
    </div>
  )
}

AddressListItem.propTypes = {
  address: PropTypes.object.isRequired,
  onSelectAddress: PropTypes.func,
  isLastAddress: PropTypes.bool,
}

export default AddressListItem