import React, { Component } from 'react'
import { compose } from 'recompose'
import PropTypes from 'prop-types'
import { withRuntimeContext } from 'vtex.render-runtime'
import defaultRules from '@vtex/profile-form/lib/rules/default'

const ProfileRules = WrappedComponent =>
  class extends Component {
    static propTypes = {
      runtime: PropTypes.shape({
        culture: PropTypes.shape({ country: PropTypes.string.isRequired })
          .isRequired,
      }).isRequired,
    }

    state = { rules: defaultRules, loading: true }

    componentDidMount() {
      this.fetchRules()
    }

    fetchRules = async () => {
      const { country } = this.props.runtime.culture
      try {
        const ruleData = await import(`@vtex/profile-form/lib/rules/${country}`)
        const rules = ruleData.default || ruleData
        this.setState({ rules, loading: false })
      } catch (e) {
        if (process.env.NODE_ENV !== 'production')
          console.warn(
            `Couldn't load rules for country ${country}, using default rules instead`
          )
        this.setState({ rules: defaultRules, loading: false })
      }
    }

    render() {
      const { runtime, ...props } = this.props
      return <WrappedComponent ruleContext={this.state} {...props} />
    }
  }

export default compose(
  withRuntimeContext,
  ProfileRules
)
