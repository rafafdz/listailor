import { useState, useMemo } from "react";
import CredentialsDrawer from "@/components/ui/CredentialsDrawer";
import Button from '@/components/ui/button'
import { useCreateList } from '@/api/lists';
import JumboSpinner from '@/components/ui/JumboSpinner';
import { useLists } from '@/contexts/ListsContext';
import { computeListScore } from '@/lib/utils';
import { RadialChart } from '@/components/ui/RadialChart';

export default function Checkout() {
  const [credentialsDrawerOpen, setCredentialsDrawerOpen] = useState(false)
  const { selectedList } = useLists()
  const createListMutation = useCreateList()

  const products = useMemo(() => {
    const obj = {}

    selectedList.items.forEach(item => {
      obj[item.id] = { quantity: item.quantity }
    })

    return obj
  }, [selectedList]);

  function handleConfirm(username, password) {
    createListMutation.mutate(
      { username, password, products },
      {
        onMutate: () => setCredentialsDrawerOpen(false),
        onSuccess: ({ shoppingListId }) => {
          const url = `https://www.jumbo.cl/lista-de-compra?l=${shoppingListId}`
          window.open(url, '_blank')
        }
      }
    )
  }

  const score = computeListScore(selectedList)

  return(
    <div className='flex flex-col pt-20 w-full pb-20 grow px-4'>
      {createListMutation.isPending ? (
        <JumboSpinner className="w-64 h-auto self-center mt-30" />
      ) : (
        <div className='flex flex-col items-center grow px-4'>
          <div className='flex w-full flex-col items-center p-4 rounded-xl'>
            <span className='font-bold text-center text-gray-700'>
              Tu score de sustentabilidad
            </span>
            <RadialChart score={score} />
          </div>
          <Button
            onClick={() => setCredentialsDrawerOpen(true)}
            className='flex flex-row gap-x-4 mt-auto w-full'
            bgColor='bg-[#00a400]'
          >
            <span className="text-white font-semibold">
              Ir a jumbo
            </span>
            <img src="/jumbito.png" alt="Jumbo" className="w-7 h-auto" />
          </Button>
          <CredentialsDrawer
            open={credentialsDrawerOpen}
            onConfirm={handleConfirm}
            onClose={() => setCredentialsDrawerOpen(false)}
          />
        </div>
      )}
    </div>
  )
}

