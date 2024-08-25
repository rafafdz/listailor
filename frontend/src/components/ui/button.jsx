export default function Button({ children = undefined, text = '', bgColor = 'bg-primary', loading = false, className = '', ...props }) {
  return (
    <button
      {...props}
      className={`flex rounded-xl focus:outline-none items-center justify-center py-2 px-4 ${bgColor} text-white ${className}`}
    >
      {children ? (
        children
      ) : (
        <div className='relative'>
          <span className='font-medium'>
            {text}
          </span>
        </div>
      )}
    </button>
  )
}


