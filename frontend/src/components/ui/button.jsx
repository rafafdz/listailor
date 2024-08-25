export default function Button({ children = undefined, text = '', ...props }) {
  return (
    <button
      {...props}
      className='flex rounded-xl focus:outline-none items-center justify-center py-2 px-4 bg-primary text-white'
    >
      {children ? (
        children
      ) : (
        <span>
          {text}
        </span>
      )}
    </button>
  )
}


