import { useState } from 'react';
import CartProductCard from '@/components/ui/CartProductCard';
import SelectProductDrawer from '@/components/ui/SelectProductDrawer';
import { useLists } from '@/contexts/ListsContext'
import { ArrowLongLeftIcon } from '@heroicons/react/24/solid';
import Link from 'next/link';
import { PostHogProvider } from '@/components/PostHogProvider';

export default function Cart() {
  const { selectedList, addItemToList, removeItemFromList } = useLists();
  const [productDrawerOpen, setProductDrawerOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  function handleAddProduct(product, quantity) {
    if (quantity > 0) {
      addItemToList({ ...product, quantity });
    } else {
      removeItemFromList(product.id)
    }

    setProductDrawerOpen(false);
  }

  function handleEdit(product) {
    setSelectedProduct(product);
    setProductDrawerOpen(true);
  }

  return(
    <PostHogProvider>
      <div className='relative flex grow flex-col items-center w-full mt-16 mb-24'>
        <div className='relative flex w-full flex-row items-center justify-center'>
          <Link
            href="/"
            className='p-2 absolute left-4'
          >
            <ArrowLongLeftIcon className='w-6 h-auto text-primary' />
          </Link>
          <span className='text-lg'>🛒</span>
          <h1 className='ml-4 text-lg font-bold text-center text-gray-700'>
            Tu carrito
          </h1>
        </div>
        <div className='flex flex-col space-y-6 w-full mt-10 pl-4 pr-8 overflow-y-scroll lg:h-[600px]'>
          {selectedList.items.map(item => (
            <CartProductCard
              key={item.id}
              onEdit={() => handleEdit(item)}
              product={item}
            />
          ))}
        </div>
        <div className='fixed bottom-0 lg:relative g-white p-6 w-full shadow border-t border-gray-50'>
          <Link
            href="/checkout"
            className='w-full bg-primary py-2 w-full flex items-center justify-center rounded-xl'
          >
            <span className='text-white font-medium'>
              Continuar
            </span>
          </Link>
        </div>
        <SelectProductDrawer
          open={productDrawerOpen && selectedProduct}
          product={selectedProduct}
          onConfirm={handleAddProduct}
          onClose={() => setProductDrawerOpen(false)}
        />
      </div>
    </PostHogProvider>
  )
}
