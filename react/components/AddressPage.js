import React, { memo, useCallback, useState } from 'react'
import PropTypes from 'prop-types'

import Card from './Card'
import AddressContent from './AddressContent'

import { Spinner } from 'vtex.styleguide'
import { Modal } from 'vtex.styleguide'

import PickupContent from './PickupContent'
import RedeemContent from './RedeemContent'

import { useAddress } from './AddressContext'

/**
 * Component that allows the user to locate his address, by inserting, searching, retrieving and
 * saving it into orderform.
 * Configure the key for Google Geolocation API, by inserting it on the admin logistics section.
 */
const AddressPage = ({ onSelectAddress }) => {
  const { address } = useAddress()
  const [isPickupOpen, setPickupOpen] = useState(false)
  const [isPickupSelected, setPickupSelected] = useState(false)
  const handlePickupClick = useCallback(() => {
    setPickupOpen(true)
  }, [setPickupOpen])

  const handleOrderFormUpdated = useCallback(async () => {
    onSelectAddress && onSelectAddress()
  }, [onSelectAddress])

  const handlePickupModalClose = useCallback(() => {
    setPickupOpen(false)
  }, [setPickupOpen])

  const handlePickupConfirm = useCallback(() => {
    setPickupSelected(true)
    handleOrderFormUpdated()
  }, [setPickupSelected, handleOrderFormUpdated])

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

  const pickupPage = isPickupOpen ? (
    <PickupContent
      loading={isPickupSelected}
      onConfirm={handlePickupConfirm}
      onUpdateOrderForm={handleOrderFormUpdated}
    />
  ) : null

  return (
    <React.Fragment>
      <div
        className="vtex-address-modal__address-page"
        style={{
          transition: 'transform 300ms',
          transform: `translate3d(${
            isPickupOpen && isMobile ? '-100%' : '0'
          }, 0, 0)`,
        }}
      >
        <Card>
          <AddressContent
            onPickupClick={handlePickupClick}
            onUpdateOrderForm={handleOrderFormUpdated}
          />
        </Card>
        <Card>
          <RedeemContent />
        </Card>
      </div>
      {isMobile ? (
        <div
          className="absolute w-100 h-100 top-0"
          style={{
            left: '100%',
            transition: 'transform 300ms',
            transform: `translate3d(${
              isPickupOpen && isMobile ? '-100%' : '0'
            }, 0, 0)`,
          }}
        >
          {pickupPage}
        </div>
      ) : (
        <Modal centered isOpen={isPickupOpen} onClose={handlePickupModalClose}>
          <div className="vw-90 vh-80">{pickupPage}</div>
        </Modal>
      )}
    </React.Fragment>
  )
}

AddressPage.propTypes = {
  onSelectAddress: PropTypes.func,
}

export default memo(AddressPage)
