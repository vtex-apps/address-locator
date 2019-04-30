import React, { createContext, useContext } from 'react'
import AddressOrderFormProvider from './AddressOrderFormProvider'

const AddressContext = createContext({})

export default AddressContext

export const withAddress = WrappedComponent => props => (
  <AddressContext.Consumer>
    {context => <WrappedComponent {...props} {...context} />}
  </AddressContext.Consumer>
)

export const useAddress = () => useContext(AddressContext)

export const withAddressProvider = WrappedComponent => props => (
  <AddressOrderFormProvider>
    <WrappedComponent { ...props} />
  </AddressOrderFormProvider>
)
