import React, { Fragment, PureComponent } from 'react'
import PropTypes from 'prop-types'
import { Button } from 'vtex.styleguide'
import { FormattedMessage } from 'react-intl'

export default class PickupPointChosen extends PureComponent {
  static propTypes = {
    handleOpenModal: PropTypes.func.isRequired,
    number: PropTypes.string.isRequired,
    name: PropTypes.string,
    street: PropTypes.string.isRequired,
  }

  render() {
    const { name, street, number, handleOpenModal } = this.props
    return (
      <Fragment>
        {name && (<p className="b">{name}</p>)}
        <p>{`${street}, ${number}`}</p>
        <div className="ttu">
          <Button onClick={() => handleOpenModal(false)} >
            <FormattedMessage id="address-locator.pickup-tab-see-all" />
          </Button>
        </div>
      </Fragment>
    )
  }
}
