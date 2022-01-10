import React from 'react'

const Label: React.FC<{ htmlFor: string }> = ({ children, htmlFor }) => {
  return (
    <label
      htmlFor={htmlFor}
      className="block text-sm font-medium text-gray-700">
      {children}
    </label>
  )
}

export default Label
