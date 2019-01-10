import React from 'react'
import ChangeAddressIcon from './ChangeAddressIcon'

import { Container } from 'vtex.store-components'
const AddressBar = ({ children, onClick }) => (
  <div className="vtex-address-manager">
    <div
      className="vtex-address-manager__bar flex ph5 white pointer"
      onClick={onClick}
    >
      <Container className="flex justify-center w-100 left-0">
        <div className="vtex-address-manager__container w-100 mw9 flex">
          <p className="vtex-address-manager__address">
            {children} &nbsp;
          </p>
          {onClick && (
            <div className="vtex-address-manager__icon">
              <ChangeAddressIcon />
            </div>
          )}
        </div>
      </Container>
    </div>
  </div>
)

export default AddressBar