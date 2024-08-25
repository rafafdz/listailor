import { useState, useEffect } from 'react';
import { useSearchQuery } from '@/api/search';
import { ClipboardDocumentIcon } from '@heroicons/react/24/solid';
import SearchBar from '@/components/ui/SearchBar';
import ListCard from '@/components/ui/ListCard';
import ProductCard from '@/components/ui/ProductCard';
import SelectProductDrawer from '@/components/ui/SelectProductDrawer';
import { BASE_LIST, useLists } from '@/contexts/ListsContext';
import JumboSpinner from '@/components/ui/JumboSpinner';

export default function Home() {
  const { lists, selectedList, addItemToList, removeItemFromList, selectList } = useLists();
  const [text, setText] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [productDrawerOpen, setProductDrawerOpen] = useState(false);
  const [listVisible, setListVisible] = useState(false);
  const [debouncedText, setDebouncedText] = useState(text); // State to hold the debounced text
  const n = 20;
  const searchQ = useSearchQuery(debouncedText, n);

  // Throttle the text input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedText(text);
    }, 200);

    // Cleanup the timeout if the text changes before 50ms
    return () => {
      clearTimeout(handler);
    };
  }, [text]);

  useEffect(() => {
    if (debouncedText && searchQ.data) {
      setListVisible(true);
    } else {
      setListVisible(false);
    }
  }, [searchQ.data, debouncedText]);

  function handleSelectProduct(product) {
    setSelectedProduct(product);
    setProductDrawerOpen(true);
  }

  function handleAddProduct(product, quantity) {
    if (quantity > 0) {
      addItemToList({ ...product, quantity });
    } else {
      removeItemFromList(product.id);
    }

    setProductDrawerOpen(false);
  }

  function handleSelectList(listName) {
    selectList(listName);
    window.location.href = '/cart';
  }

  useEffect(() => selectList(BASE_LIST.name), []);

  return (
    <main className='relative pt-40 flex flex-col py-4'>
      <div className='fixed bg-white w-full top-0 pt-12 pb-4 px-4 flex flex-row gap-x-4 w-full flex items-center'>
        <SearchBar
          onChangeText={(text) => setText(text)}
          onSubmit={() => console.log('submit')}
        />
        <a
          className='relative bg-gray-100 rounded-xl w-12 h-12 flex items-center justify-center'
          href="/cart"
        >
          <span className='text-base'>🛒</span>
          <div className='rounded-full w-4 h-4 flex items-center justify-center bg-primary absolute -top-1 -right-1'>
            <span className='text-white font-bold text-[10px]'>
              {selectedList.items.length}
            </span>
          </div>
        </a>
      </div>
      <div className='px-6 flex flex-col'>
        {searchQ.isFetching ? (
          <JumboSpinner className="w-64 h-auto self-center mt-10" />
        ) : (
          <>
            {debouncedText ? (
              <ul
                className={`flex flex-col space-y-4 transition-opacity duration-500 ${listVisible ? 'opacity-100' : 'opacity-0'}`}
              >
                {(searchQ.data || []).map(product => (
                  <ProductCard
                    key={product.id}
                    onClick={() => handleSelectProduct(product)}
                    product={product}
                  />
                ))}
              </ul>
            ) : lists.length > 0 ? (
              <>
                <div className='flex flex-row gap-x-4 items-center'>
                  <ClipboardDocumentIcon className='w-4 h-4 text-gray-400' />
                  <span className='text-sm text-gray-400'>
                    Tus listas
                  </span>
                </div>
                <div className='flex flex-col gap-y-6 mt-10'>
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
      </div>
      <SelectProductDrawer
        open={productDrawerOpen && selectedProduct}
        product={selectedProduct}
        onConfirm={handleAddProduct}
        onClose={() => setProductDrawerOpen(false)}
      />
    </main>
  );
}

