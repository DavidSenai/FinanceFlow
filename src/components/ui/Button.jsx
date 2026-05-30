export default function Button({ children, variant = 'primary', className = '', ...props }) {
  const variants = {
    primary: 'bg-primary hover:bg-primary-hover text-white shadow-sm',
    secondary: 'bg-dark-700 hover:bg-dark-600 text-light-100 border border-dark-600',
    danger: 'bg-danger hover:bg-red-600 text-white',
    ghost: 'hover:bg-dark-700/50 text-light-200',
    outline: 'border border-dark-600 hover:border-primary/40 text-light-200',
    google: 'bg-white hover:bg-gray-100 text-dark-900 font-medium',
  }

  return (
    <button
      className={`px-4 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
