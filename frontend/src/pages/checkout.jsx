import { useState, useMemo } from "react";
import CredentialsDrawer from "@/components/ui/CredentialsDrawer";
import Button from '@/components/ui/button'
import { useCreateList } from '@/api/lists';
import JumboSpinner from '@/components/ui/JumboSpinner';
import { useLists } from '@/contexts/ListsContext';
import { computeListScore } from '@/lib/utils';
import ScoreBadge from '@/components/ui/ScoreBadge';

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
  const scorePercentage = Number(score * 10);

  return(
    <div className='flex flex-col mt-20 w-full pb-20 grow px-4'>
      {createListMutation.isPending ? (
        <JumboSpinner className="w-64 h-auto self-center mt-30" />
      ) : (
        <div className='flex flex-col items-center grow px-4'>
          <ScoreBadge score={score} size="xl" />
          <div className='flex flex-row mt-4 items-center gap-x-4 w-full'>
            <span className='text-xl mb-3'>
              🚬
            </span>
            <div className='relative w-full h-2 bg-gray-200 rounded-full'>
              <div
                className='absolute h-full bg-primary rounded-full'
                style={{ width: `${scorePercentage}%` }}
              />
            </div>
            <span className='text-xl mb-2'>
              🐢
            </span>
          </div>
          <div className='grow'>
            <p className='mt-20 text-gray-700'>
              Tu lista de compras es más sustentable que el 83% de las personas que han hecho listas
              con productos similares.
            </p>
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
