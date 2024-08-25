import { useEffect, useRef } from 'react';
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
} from "@/components/ui/drawer"
import { useLists } from '@/contexts/ListsContext';
import ScoreBadge from './ScoreBadge';

function ItemCard({ item }) {
  return (
    <li className='flex flex-col bg-white rounded-xl p-4 w-full'>
      <div className='flex flex-row gap-x-4'>
        <div className='w-24 h-24 shrink-0'>
          <img src={item.imageUrl} className='w-full h-full object-cover' />
        </div>
        <p className='text-left text-gray-700 text-sm font-semibold'>
          {item.label}
        </p>
        <ScoreBadge score={item.score} />
      </div>
      <p className='text-gray-500 mx-4 text-xs text-left mt-6'>
        {item.reason}
      </p>
    </li>
  )
}

export default function CredentialsDrawer({ open, onClose }) {
  const { selectedList } = useLists()
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
      <DrawerContent className='bg-gray-100 max-h-[80%]' ref={drawerRef}>
        <DrawerHeader className='flex overflow-y-scroll flex-col gap-y-6'>
          <span className='text-gray-600 text-sm font-medium'>
            Explicación de los puntajes
          </span>
          <ul className='flex flex-col gap-y-4'>
            {selectedList.items.map(item => (
              <ItemCard
                key={item.id}
                item={item}
              />
            ))}
          </ul>
        </DrawerHeader>
        <DrawerFooter className='mb-6'>
          <button
            onClick={onClose}
            className='rounded-xl border border-gray-800 py-2 px-4 bg-white'
          >
            <span className='text-sm font-semibold'>
              Cerrar
            </span>
          </button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
