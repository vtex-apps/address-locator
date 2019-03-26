import PropTypes from 'prop-types'
import React, { Component } from 'react'

import { graphql } from 'react-apollo'
import { compose } from 'recompose'
import { withRuntimeContext } from 'vtex.render-runtime'
import { Spinner } from 'vtex.styleguide'
import { session } from 'vtex.store-resources/Queries'
import styles from './AddressChallenge.css'

const ADDRESS_PATH = '/address'

class AddressChallenge extends Component {
  static propTypes = {
    page: PropTypes.string,
    pages: PropTypes.object,
    runtime: PropTypes.shape({
      navigate: PropTypes.func,
    }),
    children: PropTypes.node,
    data: PropTypes.object.isRequired,
  }

  state = {
    isLoading: true,
    hasError: false,
    hasAddress: false,
  }

  componentDidMount() {
    this.handleUpdate()
  }

  componentDidUpdate(prevProps) {
    const oldData = prevProps.data || { loading: false }
    const data = this.props.data || { loading: false }
    if (oldData.loading !== data.loading) {
      this.handleUpdate()
    }
  }

  redirectToAddress() {
    const pathName = window.location.pathname.replace(/\/$/, '')
    if (this.props.page !== 'store.address' && pathName !== ADDRESS_PATH) {
      this.props.runtime.navigate({
        fallbackToWindowLocation: false,
        query: `returnUrl=${encodeURIComponent(pathName)}`,
        to: ADDRESS_PATH,
      })
    }
  }

  handleUpdate = () => {
    const { data } = this.props

    const isLoading = data.loading
    const hasError = data.error

    const session = !isLoading && data.getSession
    const address = session && session.address
    const hasAddress = !!address

    this.setState({
      isLoading,
      hasAddress,
      hasError,
    })

    if (!isLoading && !hasError && !hasAddress) {
      this.redirectToAddress()
    }
  }

  render() {
    const { isLoading, hasAddress } = this.state
    const { children } = this.props

    if (isLoading) {
      return (
        <div className="flex justify-center items-center absolute top-0 bottom-0 left-0 right-0 bg-base">
          <div className={styles.spinnerAppear}>
            <Spinner />
          </div>
        </div>
      )
    }

    if (hasAddress) {
      return children
    }

    return null
  }
}

export default compose(
  graphql(session, {
    options: () => ({
      ssr: false,
    })
  }),
  withRuntimeContext,
)(AddressChallenge)
