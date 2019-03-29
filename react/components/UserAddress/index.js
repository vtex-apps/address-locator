import React  from 'react'
import PropTypes from 'prop-types'
import ChangeAddressModal from '../ChangeAddressModal'
import { orderFormConsumer, contextPropTypes } from 'vtex.store-resources/OrderFormContext'

import { UserAddress as UserAddressComponent } from 'vtex.store-components'


class UserAddress extends React.Component {
  static propTypes = {
    variation: PropTypes.oneOf(['inline', 'bar']).isRequired,
    orderFormContext: contextPropTypes,
  }

  state = {
    isModalOpen: false,
  }

  handleChange = () => {
    this.setState({
      isModalOpen: true,
    })
  }

  handleCloseModal = () => {
    this.setState({
      isModalOpen: false,
    })
  }

  render() {
    const { variation } = this.props
    const { isModalOpen } = this.state

    return (
      <React.Fragment>
        <UserAddressComponent
          variation={variation}
          onChange={this.handleChange}
        />
        <ChangeAddressModal
          isOpen={isModalOpen}
          onClose={this.handleCloseModal}
          orderFormContext={this.props.orderFormContext}
        />
      </React.Fragment>
    )
  }
}

export default orderFormConsumer(UserAddress)