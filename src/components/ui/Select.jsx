import { forwardRef } from 'react'

const Select = forwardRef(({ label, error, options = [], className = '', placeholder, ...props }, ref) => {
  return (
    <div className="space-y-1.5">
      {label && <label className="text-sm font-medium text-light-200">{label}</label>}
      <select
        ref={ref}
        className={`w-full px-4 py-2.5 bg-dark-700/30 border border-dark-600 rounded-xl text-light-100 focus:outline-none focus:border-primary/40 focus:ring-1 focus:ring-primary/20 transition-all ${error ? 'border-danger' : ''} ${className}`}
        {...props}
      >
        {placeholder && <option value="" style={{ color: '#71717A', background: '#18181B' }}>{placeholder}</option>}
        {options.map((opt) => {
          const label = typeof opt === 'string' ? opt : opt.label
          const value = typeof opt === 'string' ? opt : opt.value
          return <option key={value} value={value} style={{ color: '#FAFAFA', background: '#18181B' }}>{label}</option>
        })}
      </select>
      {error && <p className="text-sm text-danger">{error}</p>}
    </div>
  )
})

Select.displayName = 'Select'
export default Select
