import { X } from 'lucide-react'

export default function Modal({ isOpen, onClose, title, children, size = 'md' }) {
  const sizes = { sm: 'max-w-md', md: 'max-w-lg', lg: 'max-w-2xl', xl: 'max-w-4xl' }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in" onClick={onClose}>
      <div
        className={`bg-dark-800 rounded-2xl border border-dark-700/50 w-full ${sizes[size]} max-h-[90vh] overflow-y-auto shadow-2xl animate-scale-in`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-5 border-b border-dark-700/50">
          <h2 className="text-lg font-semibold text-light-100">{title}</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-dark-700/50 transition-colors">
            <X className="w-5 h-5 text-dark-500" />
          </button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  )
}
