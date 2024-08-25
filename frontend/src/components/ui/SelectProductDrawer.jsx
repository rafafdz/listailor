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
import ProductCard from './ProductCard';
import LoadingSpinner from './LoadingSpinner';
import { useLists } from '@/contexts/ListsContext';
import { ArrowLongLeftIcon } from '@heroicons/react/24/solid';
import { useSearchQuery } from '@/api/search';

const STEPS = {
  suggestions: 1,
  quantity: 2,
  information: 3,
}

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
  const suggestionsQ = useSearchQuery(product?.label, 5, { enabled: Boolean(product) });
  const bestSuggestions = product
    ? (suggestionsQ.data || [])
        .filter(s => s.id !== product?.id && s.score > product?.score)
        .sort((a, b) => b.score - a.score)
        .slice(0, 3)
    : [];

  const { selectedList } = useLists()
  const [quantity, setQuantity] = useState(0)
  const [selectedSuggestion, setSelectedSuggestion] = useState(null)
  const [step, setStep] = useState(STEPS.suggestions)
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
    const quantity = selectedList.items.find(item => item.id === selectedSuggestion?.id)?.quantity || 0

    setQuantity(quantity)
  }, [open, selectedSuggestion])

  useEffect(() => {
    if (product) {
      setSelectedSuggestion(product)
    }
  }, [product, open])

  useEffect(() => {
    setTimeout(() => {
      setStep(STEPS.suggestions)
    }, 500)
  }, [open])

  function handleNextStep() {
    if (step === STEPS.suggestions) {
      return setStep(STEPS.quantity)
    }

    onConfirm(selectedSuggestion, quantity)
  }

  return (
    <Drawer open={open}>
      <DrawerContent ref={drawerRef}>
        <DrawerHeader className='flex flex-col pb-10 pt-8'>
          {step === STEPS.suggestions && (
            <>
              <ProductCard
                product={product}
                className={`
                  border
                  ${selectedSuggestion?.id === product?.id ? 'border-primary' : 'border-transparent'}
                `}
              />
              <div className='flex flex-row items-center gap-x-6 my-4 mx-6'>
                <span className='w-full h-[1px] bg-gray-300 rounded-full' />
                <span className='text-sm text-gray-300 shrink-0'>Alternativas sustentables</span>
                <span className='w-full h-[1px] bg-gray-300 rounded-full' />
              </div>
              {suggestionsQ.isLoading ? (
                <LoadingSpinner className='self-center my-10 w-12 h-12' />
              ) : bestSuggestions.length > 0 ? (
                <div className='mt-4 flex flex-col gap-y-6'>
                  {bestSuggestions.map(suggestion => (
                    <ProductCard
                      product={suggestion}
                      key={suggestion.id}
                      onClick={() => setSelectedSuggestion(suggestion)}
                      className={`
                        border
                        ${selectedSuggestion?.id === suggestion.id ? 'border-primary' : 'border-transparent'}
                      `}
                    />
                  ))}
                </div>
              ) : (
                <p className='text-gray-600 italic mt-10'>No hay alternativas más sustentables</p>
              )}
            </>
          )}

          {step === STEPS.quantity && (
            <div className='flex flex-col items-center gap-y-12 py-4'>
              <div className='flex flex-row gap-x-4 w-full'>
                <div className='w-24 h-24 shrink-0'>
                  <img
                    src={selectedSuggestion?.imageUrl}
                    className='w-full h-auto object-cover'
                  />
                </div>
                <div className='flex w-full flex-col gap-y-2 items-left justify-between'>
                  <span className='text-lg text-left font-bold'>
                    {selectedSuggestion?.label}
                  </span>
                  <div className='flex flex-row items-center justify-between'>
                    <span className='text-lg font-semibold text-gray-700'>
                      {toCurrency(selectedSuggestion?.price)}
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
              <ScoreBadge score={selectedSuggestion?.score} size="xl" />
              <p className='text-center text-gray-400 mx-12 text-sm'>
                Mientras más alto sea el puntaje, más sustentable es el producto
              </p>
            </div>
          )}

          {step === STEPS.information && (
            <div>
              <button
                onClick={() => setStep(STEPS.suggestions)}
              >
                <ArrowLongLeftIcon />
              </button>
              <span>hola</span>
            </div>
          )}
        </DrawerHeader>
        <DrawerFooter>
          <Button
            text={step === STEPS.suggestions ? 'Continuar' : 'Agregar'}
            onClick={() => handleNextStep()}
          />
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
