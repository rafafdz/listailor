import { useState, useEffect } from "react";
import { useSearchQuery } from "@/api/useSearch";
import {
  ClipboardDocumentIcon,
  ShoppingCartIcon,
} from "@heroicons/react/24/solid";
import Link from "next/link";
import SearchBar from "@/components/ui/SearchBar";
import ListCard from "@/components/ui/ListCard";
import ProductCard from "@/components/ui/ProductCard";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import SelectProductDrawer from "@/components/ui/SelectProductDrawer";
import Head from "next/head";
import { BASE_LIST, useLists } from "@/contexts/ListsContext";

export default function Home() {
  const { lists, selectedList, addItemToList, selectList } = useLists();
  const [text, setText] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [productDrawerOpen, setProductDrawerOpen] = useState(false);
  const searchQ = useSearchQuery(text, { enabled: Boolean(text) });

  function handleSelectProduct(product) {
    setSelectedProduct(product);
    setProductDrawerOpen(true);
  }

  function handleAddProduct(product, quantity) {
    if (quantity > 0) {
      addItemToList({ ...product, quantity });
      setProductDrawerOpen(false);
    }
  }

  function handleSelectList(listName) {
    selectList(listName);
    window.location.href = "/cart";
  }

  useEffect(() => selectList(BASE_LIST.name), []);

  return (
    <main className="flex mt-20 flex-col px-8 py-4">
      <Head>
        <title>✨🛒 ListAIlor | Descarboniza tus compras</title>
      </Head>
      <div className="mb-20 flex flex-row gap-x-4 w-full flex items-center">
        <SearchBar
          onChangeText={(text) => setText(text)}
          onSubmit={() => console.log("submit")}
        />
        <Link
          className="relative bg-gray-100 rounded-xl w-12 h-12 flex items-center justify-center"
          href="/cart"
        >
          <ShoppingCartIcon className="w-5 h-5 text-gray-400" />
          <div className="rounded-full w-4 h-4 flex items-center justify-center bg-primary absolute -top-1 -right-1">
            <span className="text-white font-bold text-[10px]">
              {selectedList.items.length}
            </span>
          </div>
        </Link>
      </div>
      {searchQ.isFetching ? (
        <LoadingSpinner className="w-10 h-10 self-center" />
      ) : (
        <>
          {text && searchQ.data ? (
            <ul className="flex flex-col space-y-4">
              {searchQ.data.map((product) => (
                <ProductCard
                  key={product.id}
                  onClick={() => handleSelectProduct(product)}
                  product={product}
                />
              ))}
            </ul>
          ) : lists.length > 0 ? (
            <>
              <div className="flex flex-row gap-x-4 items-center">
                <ClipboardDocumentIcon className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-400">Tus listas</span>
              </div>
              <div className="flex flex-col gap-y-6 mt-10">
                {lists.map((list, index) => (
                  <ListCard
                    key={index}
                    onClick={(listName) => handleSelectList(listName)}
                    list={list}
                  />
                ))}
              </div>
            </>
          ) : null}
        </>
      )}
      <SelectProductDrawer
        open={productDrawerOpen && selectedProduct}
        product={selectedProduct}
        onConfirm={handleAddProduct}
        onClose={() => setProductDrawerOpen(false)}
      />
    </main>
  );
}
