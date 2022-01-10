import { FieldProps } from '@/types/fields'
import React, { HTMLInputTypeAttribute } from 'react'
import { FieldRenderProps } from 'react-final-form'
import Label from './Label'

const isDateSupported = function () {
  var input = document.createElement('input')
  var value = 'a'
  input.setAttribute('type', 'date')
  input.setAttribute('value', value)
  return input.value !== value
}

const Input = <FieldValue extends unknown>(
  props: FieldRenderProps<FieldValue> &
    FieldProps & { inputType: HTMLInputTypeAttribute; id?: string },
) => {
  const {
    meta,
    inputType,
    input,
    className = '',
    id,
    label,
    wrapperClass = '',
  } = props
  const hasError = meta.touched && (meta.error || meta.submitError)
  let dateSupported = true
  if (inputType === 'date') {
    dateSupported = isDateSupported()
  }

  return (
    <div className={wrapperClass}>
      <Label htmlFor={id}>{label}</Label>
      <input
        type={inputType}
        id={id}
        {...props}
        {...input}
        className={`${className} ${
          hasError ? 'border-red-500' : ''
        } w-full block`}
        pattern={
          !dateSupported && inputType === 'date' ? '\\d{4}-\\d{2}-\\d{2}' : null
        }
      />
      {meta.touched && (meta.error || meta.submitError) && (
        <small className="text-red-500">{meta.error || meta.submitError}</small>
      )}
    </div>
  )
}

export default Input
