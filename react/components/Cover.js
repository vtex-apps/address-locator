import React, { Component } from 'react'
import PropTypes from 'prop-types'

class Cover extends Component {
  static propTypes = {
    children: PropTypes.node,
  }

  componentDidMount() {
    const htmlRoot = document && document.documentElement
    if (!htmlRoot) return

    htmlRoot.style.overflow = 'hidden'
    htmlRoot.style.position = 'fixed'
    htmlRoot.style.top = 0
    htmlRoot.style.width = 'calc(100% - 0px)'
  }

  componentWillUnmount() {
    const htmlRoot = document && document.documentElement
    if (!htmlRoot) return

    htmlRoot.style.overflow = ''
    htmlRoot.style.position = ''
    htmlRoot.style.top = ''
    htmlRoot.style.width = ''
  }

  render() {
    return (
      <div className="fixed top-0 bottom-0 left-0 right-0 z-999 bg-base">
        {this.props.children}
      </div>
    )
  }
}

export default Cover