import React from 'react'
import { useRuntime } from 'vtex.render-runtime'
import { ProfileRules } from 'vtex.profile-form'

const ProfileRulesWrapper = WrappedComponent => props => {
  const { culture } = useRuntime()
  return (
    <ProfileRules country={culture.country} shouldUseIOFetching>
      <WrappedComponent {...props} />
    </ProfileRules>
  )
}

export default ProfileRulesWrapper
