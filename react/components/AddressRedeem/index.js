import React from 'react'
import { useRuntime } from 'vtex.render-runtime'
import { ProfileRules } from 'vtex.profile-form'

import AddressRedeem from './AddressRedeem'

/**
 * Component responsible for retrieving the user's address by his phone number
 */

const ProfileRulesWrapper = () => {
  const {
    culture: { country },
  } = useRuntime()
  return (
    <ProfileRules country={country} shouldUseIOFetching>
      <AddressRedeem />
    </ProfileRules>
  )
}

export default ProfileRulesWrapper
