import React from 'react'
import PropTypes from 'prop-types'
import Button from 'vtex.styleguide/Button'
import style from './popover.module.css'
import classnames from 'classnames'

const Popover = ({ titleText, descriptionText, buttonText, onClick }) => (
  <div className="relative w5 mb5">
    <div className="shadow-1 tc pa2 pb4 bg-white z-1 relative">
      <p className="b">{titleText}</p>
      {descriptionText && <p>{descriptionText}</p>}
      <Button size="small">{buttonText}</Button>
    </div>
    <div
      className={classnames('w1 h1 shadow-1 bg-white absolute', style.popover)}
      onClick={onClick}
    />
  </div>
)

Popover.propTypes = {
  buttonText: PropTypes.string.isRequired,
  descriptionText: PropTypes.string,
  titleText: PropTypes.string.isRequired,
}

export default Popover
