import { useProductSuggestionsQuery } from '@/api/useProductSuggestions'
import Switch from '@/components/svgs/Switch'
import { toCurrency } from '@/lib/utils'

export default function CartProductCard({ product }) {
  console.log(product);
  const suggestionsQ = useProductSuggestionsQuery(product.id)

  return(
    <div className='flex flex-row items-center gap-x-4'>
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
      <button className='ml-auto'>
        <Switch />
      </button>
    </div>
    )
}
