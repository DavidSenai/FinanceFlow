export default function Card({ children, className = '', hover = true, ...props }) {
  return (
    <div
      className={`bg-dark-800 rounded-2xl p-5 border border-dark-700/50 shadow-card ${hover ? 'hover:border-primary/20 hover:shadow-[0_0_0_1px_rgba(59,130,246,0.08)] transition-all duration-300' : ''} animate-fade-in-up ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}
