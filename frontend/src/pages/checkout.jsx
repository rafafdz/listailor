import { useState } from "react";
import CredentialsDrawer from "@/components/ui/CredentialsDrawer";
import Button from '@/components/ui/button'
import { useCreateList } from '@/api/lists';
import JumboSpinner from '@/components/ui/JumboSpinner';

export default function Checkout() {
  const [credentialsDrawerOpen, setCredentialsDrawerOpen] = useState(false)
  const createListMutation = useCreateList()

  function handleConfirm(email, password) {
    createListMutation.mutate(
      { email, password },
      {
        onMutate: () => setCredentialsDrawerOpen(false),
        onSuccess: (listId) => {
          const url = `https://www.jumbo.cl/lista-de-compra?l=${listId}`
          window.open(url, '_blank')
        }
      }
    )
  }

  return(
    <div className='flex flex-col mt-20 w-full pb-20 grow px-4'>
      {createListMutation.isPending ? (
        <JumboSpinner className="w-64 h-auto self-center mt-30" />
      ) : (
        <>
          <div className='flex flex-row items-center gap-x-4 w-full'>
            <span className='text-xl mb-3'>
              🚬
            </span>
            <div className='relative rounded-full bg-primary w-full border border-primary w-full h-2'>
              <div className='w-4 h-4 absolute -top-[3px] right-12 top-0 bg-white border border-gray-100 rounded-full' />
            </div>
            <span className='text-xl mb-2'>
              🐢
            </span>
          </div>
          <p>
            Tu lista de compras es más sustentable que el 83% de las personas que han hecho listas
            con productos similares.
          </p>
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
        </>
      )}
    </div>
  )
}
