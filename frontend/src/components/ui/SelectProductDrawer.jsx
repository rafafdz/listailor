import { useState, useEffect, useRef } from 'react';
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
} from "@/components/ui/drawer"
import Button from './button'
import { MinusIcon, PlusIcon } from 'lucide-react';
import { toCurrency } from '@/lib/utils';
import ScoreBadge from './ScoreBadge';
import { useLists } from '@/contexts/ListsContext';

function QuantityButton({ icon, onClick }) {
  return (
    <button
      onClick={onClick}
      className='w-8 h-8 rounded-full flex items-center justify-center bg-gray-100'
    >
      {icon}
    </button>
  )
}

export default function SelectProductDrawer({ open, product, onConfirm, onClose }) {
  const { selectedList } = useLists()
  const [quantity, setQuantity] = useState(0)
  const drawerRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (drawerRef.current && !drawerRef.current.contains(event.target)) {
        onClose();
      }
    }

    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open, onClose]);

  useEffect(() => {
    const quantity = selectedList.items.find(item => item.id === product?.id)?.quantity || 0

    setQuantity(quantity)
  }, [open, product])

  return(
    <Drawer open={open}>
        <DrawerContent ref={drawerRef}>
          <DrawerHeader>
            <div className='flex flex-col items-center gap-y-12 py-4'>
              <div className='flex flex-row gap-x-4'>
                <div className='w-24 h-24 shrink-0'>
                  <img
                    src={product?.imageUrl}
                    className='w-full h-auto object-cover'
                  />
                </div>
                <div className='flex flex-col justify-between'>
                  <span className='text-lg font-bold'>
                    {product?.label}
                  </span>
                  <div className='flex flex-row items-center justify-between'>
                    <span className='text-lg font-semibold text-gray-700'>
                      {toCurrency(product?.price)}
                    </span>
                    <div className='flex flex-row items-center gap-x-4'>
                      <QuantityButton
                        onClick={() => setQuantity((prev) => {
                          if (prev > 0) {
                            return prev - 1;
                          }

                          return prev;
                        })}
                        icon={<MinusIcon className='w-4 h-4 text-gray-500' />}
                      />
                      <span className='font-semibold text-primary'>{quantity}</span>
                      <QuantityButton
                        onClick={() => setQuantity((prev) => prev + 1)}
                        icon={<PlusIcon className='w-4 h-4 text-gray-500' />}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <ScoreBadge score={product?.score} size="xl" />
              <p className='text-center text-gray-400 mx-12 text-sm'>
                Mientras más alto sea el puntaje, más sustentable es el producto
              </p>
            </div>
          </DrawerHeader>
          <DrawerFooter>
            <Button
              text="Escoger"
              onClick={() => onConfirm(product, quantity)}
            />
          </DrawerFooter>
        </DrawerContent>
    </Drawer>
  )
}
