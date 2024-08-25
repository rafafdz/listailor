import CartProductCard from '@/components/ui/CartProductCard';
import ProductSuggestionsDrawer from '@/components/ui/ProductSuggestionsDrawer';
import { useLists } from '@/contexts/ListsContext'
import { useState } from "react"

export default function Cart() {
  const { selectedList } = useLists();
  const [switchProductDrawerOpen, setSwitchProductDrawerOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  function openSwitchProductDrawer(product) {
    setSelectedProduct(product);
    setSwitchProductDrawerOpen(true);
  }

  function switchProduct() {

  }

  return(
    <div className='flex flex-col items-center w-full p-4 mt-10'>
      <p className='text-base font-bold text-center'>
        Tienes algunos productos que podrias cambiar por su alternativa más sustentable
      </p>
      <div className='flex flex-col space-y-4'>
        {selectedList.items.map(item => (
          <CartProductCard
            key={item.id}
            onSwitch={() => openSwitchProductDrawer(product)}
            product={item}
          />
        ))}
      </div>
      <ProductSuggestionsDrawer
        open={switchProductDrawerOpen}
        product={selectedProduct}
        onConfirm={() => switchProduct()}
        onClose={() => setSwitchProductDrawerOpen(false)}
      />
    </div>
    )
}
