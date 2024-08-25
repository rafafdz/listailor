import { PencilIcon } from 'lucide-react';
import { toCurrency } from '@/lib/utils'

export default function CartProductCard({ product, onEdit }) {
  return(
    <div className='flex w-full flex-row items-center gap-x-4'>
      <div className='w-16 h-16 overflow-hidden shrink-0'>
        <img
          src={product.imageUrl}
          className='w-full h-auto object-cover'
        />
      </div>
      <div className='py-4 flex flex-col gap-y-2 justify-between'>
        <span className='text-sm text-left font-semibold text-gray-700'>
          {product.label}
        </span>
        <span className='text-sm text-left text-gray-500'>
          {toCurrency(product.price)}
        </span>
      </div>
      <button onClick={onEdit} className='ml-auto'>
        <PencilIcon className='w-4 h-4 text-primary' />
      </button>
    </div>
    )
}
