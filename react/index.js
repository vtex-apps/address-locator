import React from 'react'

import AddressOrderFormProvider from './components/AddressOrderFormProvider'
import RedirectManager from './components/RedirectManager'

import './global.css'

const AddressManager = props => (
  <AddressOrderFormProvider>
    <RedirectManager { ...props } />
  </AddressOrderFormProvider>
)

AddressManager.schema = {
  title: 'address-locator.address-manager-title',
  description: 'address-locator.address-manager-description',
  type: 'object',
  properties: {
    logoUrl: {
      type: 'string',
      title: 'address-locator.address-manager.logo-title',
      widget: {
        'ui:widget': 'image-uploader'
      }
    },
  }
}

export default AddressManager
