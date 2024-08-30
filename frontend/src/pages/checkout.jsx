import { useState, useMemo } from "react";
import CredentialsDrawer from "@/components/ui/CredentialsDrawer";
import Button from "@/components/ui/button";
import ListProductsReasonsDrawer from "@/components/ui/ListProductsReasonsDrawer";
import { useCreateList } from "@/api/lists";
import JumboSpinner from "@/components/ui/JumboSpinner";
import { useLists } from "@/contexts/ListsContext";
import { computeListScore } from "@/lib/utils";
import { RadialChart } from "@/components/ui/RadialChart";
import { PostHogProvider } from "@/components/PostHogProvider";

export default function Checkout() {
  const [credentialsDrawerOpen, setCredentialsDrawerOpen] = useState(false);
  const [reasonsDrawerOpen, setReasonsDrawerOpen] = useState(false);
  const { selectedList } = useLists();
  const createListMutation = useCreateList();

  const products = useMemo(() => {
    const obj = {};

    selectedList.items.forEach((item) => {
      obj[item.id] = { quantity: item.quantity };
    });

    return obj;
  }, [selectedList]);

  function handleConfirm(username, password) {
    createListMutation.mutate(
      { username, password, products },
      {
        onMutate: () => setCredentialsDrawerOpen(false),
        onSuccess: ({ shoppingListId }) => {
          const url = `https://www.jumbo.cl/lista-de-compra?l=${shoppingListId}`;
          window.open(url, "_blank");
        },
      }
    );
  }

  const score = computeListScore(selectedList);

  return (
    <PostHogProvider>
      <div className="flex flex-col w-full px-4 h-screen">
        {createListMutation.isPending ? (
          <JumboSpinner className="w-64 h-auto self-center mt-30" />
        ) : (
          <div className="mt-10 flex flex-col items-center px-4">
            <div className="flex w-full flex-col items-center p-4 rounded-xl">
              <span className="font-bold text-center text-gray-700">
                Tu puntaje de sustentabilidad
              </span>
              <button
                className="flex-1 w-full"
                onClick={() => setReasonsDrawerOpen(true)}
              >
                <RadialChart score={score} />
              </button>
              <p className="text-gray-600 text-sm mt-10">
                El puntaje de sustentabilidad es un indicador de cuán
                sustentable es tu lista de compra. Para obtenerlo se consideran
                multiples factores, como los ingredientes, el packaging, país de
                origen y más. Esta información es usada por agentes basados en
                LLMs que asignan un puntaje a cada producto.
              </p>
            </div>
            <span className="mt-20 font-medium text-gray-400 mb-3 text-sm">
              ¿Quieres comprar tu lista en Jumbo?
            </span>
            <Button
              onClick={() => setCredentialsDrawerOpen(true)}
              className="gap-x-4 w-full"
              bgColor="bg-[#00a400]"
            >
              <span className="text-white font-semibold">Ir a Jumbo</span>
              <img src="/jumbito.png" alt="Jumbo" className="w-7 h-auto" />
            </Button>
          </div>
        )}
        <CredentialsDrawer
          open={credentialsDrawerOpen}
          onConfirm={handleConfirm}
          onClose={() => setCredentialsDrawerOpen(false)}
        />
        <ListProductsReasonsDrawer
          open={reasonsDrawerOpen}
          onClose={() => setReasonsDrawerOpen(false)}
        />
      </div>
    </PostHogProvider>
  );
}
