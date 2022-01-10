import { FieldProps } from '@/types/fields'
import React from 'react'
import { FieldRenderProps } from 'react-final-form'
import Label from './Label'

const TextArea = <FieldValue extends unknown>(
  props: FieldRenderProps<FieldValue> & FieldProps & { id?: string },
) => {
  const { meta, input, className = '', id, label, wrapperClass = '' } = props
  const hasError = meta.touched && (meta.error || meta.submitError)

  return (
    <div className={wrapperClass}>
      <Label htmlFor={id}>{label}</Label>
      <textarea
        id={id}
        {...input}
        className={`${className} ${
          hasError ? 'border-red-500' : ''
        } w-full block`}
      />
      {meta.touched && (meta.error || meta.submitError) && (
        <small className="text-red-500">{meta.error || meta.submitError}</small>
      )}
    </div>
  )
}

export default TextArea
