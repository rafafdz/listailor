import ScoreBadge from './ScoreBadge'
import { toCurrency } from '@/lib/utils'

export default function ProductCard({ product, onClick, className, ...props }){
  return(
    <button
      onClick={onClick}
      className={`flex pr-4 flex-row rounded-2xl overflow-hidden items-center w-full ${className}`}
      {...props}
    >
      <div className='w-16 h-16 overflow-hidden shrink-0'>
        <img
          src={product.imageUrl}
          className='w-full h-auto object-cover'
        />
      </div>
      <div className='mx-4 py-4 flex flex-col gap-y-2 justify-between'>
        <span className='text-sm text-left font-semibold text-gray-700'>
          {product.label}
        </span>
        <span className='text-sm text-left text-gray-500'>
          {toCurrency(product.price)}
        </span>
      </div>
      <div className='ml-auto'>
        <ScoreBadge score={product.score} />
      </div>
    </button>
    )
}
