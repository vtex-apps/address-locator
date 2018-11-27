import React from 'react'
import ChangeAddressIcon from './ChangeAddressIcon'

const AddressBar = ({ children, onClick }) => (
  <div className="vtex-address-manager">
    <div
      className="vtex-address-manager__bar flex ph5 white pointer"
      onClick={onClick}
    >
      <p className="vtex-address-manager__address mr5 overflow-hidden nowrap">
        {children} &nbsp;
      </p>
      { onClick && (
        <div className="vtex-address-manager__icon">
          <ChangeAddressIcon />
        </div>
      )}
    </div>
  </div>
)

export default AddressBar