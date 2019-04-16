import React from 'react'
import PropTypes from 'prop-types'
import { intlShape, injectIntl } from 'react-intl'
import Input from 'vtex.styleguide/Input'
import { ProfileFieldShape, RuleFieldShape } from 'vtex.profile-form'

import styles from '../styles.css'

const StyleguideInput = props => {
  const { field, data, options, inputRef, onChange, onBlur, intl } = props
  const cssClass = styles[`input-${field.name}`] || ''
  return (
    <div
      className={`${cssClass} ${
        field.hidden ? 'dn' : ''
      }`}
    >
      <Input
        name={field.name}
        label={intl.formatMessage({
          id: `profile-form.field.${field.label}`,
        })}
        value={data.value || ''}
        errorMessage={
          data.error &&
          intl.formatMessage({
            id: `profile-form.error.${data.error}`,
          })
        }
        placeholder={
          !field.required
            ? intl.formatMessage({ id: 'profile-form.optional' })
            : null
        }
        onChange={onChange}
        onBlur={onBlur}
        ref={inputRef}
        maxLength={field.maxLength}
        {...options}
      />
    </div>
  )
}

StyleguideInput.propTypes = {
  /** Rules for the field this input represents */
  field: RuleFieldShape.isRequired,
  /** Data this input will display */
  data: ProfileFieldShape.isRequired,
  /** Additional options to modify this input */
  options: PropTypes.object,
  /** Ref function to control this input from outside */
  inputRef: PropTypes.func,
  /** Function to be called when input changes */
  onChange: PropTypes.func.isRequired,
  /** Function to be called when input blurs */
  onBlur: PropTypes.func.isRequired,
  /** React-intl utility */
  intl: intlShape.isRequired,
}

export default injectIntl(StyleguideInput)
