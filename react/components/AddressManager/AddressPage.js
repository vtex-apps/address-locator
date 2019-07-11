import React, { memo, useCallback, useState, useRef } from 'react'
import PropTypes from 'prop-types'
import { Spinner } from 'vtex.styleguide'
import { ExtensionPoint, useRuntime } from 'vtex.render-runtime'

import Card from '../Card'

import { useAddress } from '../AddressContext'

const transformAnimationStyle = (quantity, isPickupOpen) => ({
  transition: 'transform 300ms',
  transform: `translate3d(${isPickupOpen ? `-${quantity}` : '0'}, 0, 0)`,
})

/**
 * Component that allows the user to locate his address, by inserting, searching, retrieving and
 * saving it into orderform.
 * Configure the key for Google Geolocation API, by inserting it on the admin logistics section.
 */
const AddressPage = ({ onSelectAddress }) => {
  const { address } = useAddress()
  const {
    hints: { phone: isPhone },
  } = useRuntime()
  const [isPickupOpen, setPickupOpen] = useState(false)
  const wrapperRef = useRef(null)
  const handlePickupClick = useCallback(() => {
    setPickupOpen(true)
  }, [setPickupOpen])

  const handleOrderFormUpdated = useCallback(() => {
    onSelectAddress && onSelectAddress()
  }, [onSelectAddress])

  const closeModal = useCallback(() => {
    setPickupOpen(false)
  }, [setPickupOpen])

  if (address.loading) {
    return (
      <div
        className="flex flex-grow-1 items-center justify-center"
        style={{
          height: 750,
        }}
      >
        <Spinner />
      </div>
    )
  }

  return (
    <div ref={wrapperRef}>
      <div
        className="vtex-address-modal__address-page"
        style={transformAnimationStyle('110%', isPickupOpen && isPhone)}
      >
        <Card>
          <ExtensionPoint
            id="address-search"
            onUpdateOrderForm={handleOrderFormUpdated}
          />
          <ExtensionPoint
            id="pickup-selector"
            onConfirm={handleOrderFormUpdated}
            onFindPickupClick={handlePickupClick}
            isPickupOpen={isPickupOpen}
            parentRef={isPhone && wrapperRef}
            closeModal={closeModal}
          />
        </Card>
        <Card>
          <ExtensionPoint id="address-redeem" />
        </Card>
      </div>
    </div>
  )
}

AddressPage.propTypes = {
  onSelectAddress: PropTypes.func,
}

export default memo(AddressPage)
