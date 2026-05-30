import { forwardRef } from 'react'

const Input = forwardRef(({ label, error, className = '', ...props }, ref) => {
  return (
    <div className="space-y-1.5">
      {label && <label className="text-sm font-medium text-light-200">{label}</label>}
      <input
        ref={ref}
        className={`w-full px-4 py-2.5 bg-dark-700/30 border border-dark-600 rounded-xl text-light-100 placeholder:text-dark-500 focus:outline-none focus:border-primary/40 focus:ring-1 focus:ring-primary/20 transition-all ${error ? 'border-danger' : ''} ${className}`}
        {...props}
      />
      {error && <p className="text-sm text-danger">{error}</p>}
    </div>
  )
})

Input.displayName = 'Input'
export default Input
