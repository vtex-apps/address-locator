import React, { memo, useCallback, useState, useRef } from 'react'
import PropTypes from 'prop-types'
import { Spinner } from 'vtex.styleguide'

import Card from '../Card'
import AddressSearch from '../AddressSearch'
import PickupLocator from '../PickupLocator'
import AddressRedeem from '../AddressRedeem'

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

  /** TODO: use a better method of mobile detection
   * @author lbebber */
  const isMobile = window.innerWidth < 640

  return (
    <div ref={wrapperRef}>
      <div
        className="vtex-address-modal__address-page"
        style={transformAnimationStyle('110%', isPickupOpen && isMobile)}
      >
        <Card>
          <AddressSearch onUpdateOrderForm={handleOrderFormUpdated} />
          <PickupLocator
            onConfirm={handleOrderFormUpdated}
            onFindPickupClick={handlePickupClick}
            isPickupOpen={isPickupOpen}
            parentRef={isMobile && wrapperRef}
            closeModal={closeModal}
          />
        </Card>
        <Card>
          <AddressRedeem />
        </Card>
      </div>
    </div>
  )
}

AddressPage.propTypes = {
  onSelectAddress: PropTypes.func,
}

export default memo(AddressPage)
