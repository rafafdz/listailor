import { useState, useEffect, useRef } from 'react';
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
} from "@/components/ui/drawer";
import Button from './button';
import { useProductSuggestionsQuery } from '@/api/useProductSuggestions';
import ProductCard from './ProductCard';
import LoadingSpinner from './LoadingSpinner';

export default function ProductSuggestionsDrawer({ open, product, onConfirm, onClose }) {
  const suggestionsQ = useProductSuggestionsQuery(product?.id, { enabled: Boolean(product) });
  const [selectedSuggestion, setSelectedSuggestion] = useState(null);
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

  return (
    <Drawer open={open}>
      <DrawerContent ref={drawerRef}>
        <DrawerHeader>
          <div className='flex flex-col items-center gap-y-12 py-4'>
            {product && (<ProductCard product={product} />)}
          </div>
          <div className='flex flex-row items-center gap-x-10'>
            <span className='flex-1 h-[1px] bg-gray-50' />
            <span>Cambiar por</span>
            <span className='flex-1 h-[1px] bg-gray-50' />
          </div>
          {suggestionsQ.isLoading ? (
            <LoadingSpinner />
          ) : (
            <div className='flex flex-col gap-y-4'>
              {suggestionsQ.data.map(suggestion => (
                <button
                  key={suggestion.id}
                  onClick={() => setSelectedSuggestion(suggestion)}
                  className={`
                    border
                    ${selectedSuggestion?.id === suggestion.id ? 'border-primary' : 'border-transparent'}
                  `}
                >
                  <ProductCard product={suggestion} />
                </button>
              ))}
            </div>
          )}
        </DrawerHeader>
        <DrawerFooter>
          <Button
            text="Escoger"
            onClick={() => onConfirm(selectedSuggestion || product)}
          />
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

