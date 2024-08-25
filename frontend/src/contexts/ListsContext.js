import { createContext, useContext } from 'react';
import { useLocalStorage } from "@uidotdev/usehooks";

export const BASE_LIST = {
  name: 'Lista',
  icon: '🌳',
  items: []
}

const DEFAULT_LISTS = [
  {
    name: 'Lista no tan sustentable',
    icon: '🚬',
    items: [
      {
        "id": "29027",
        "label": "Bombín Plástico Dribbling Universal",
        "imageUrl": "https://jumbo.vtexassets.com/arquivos/ids/193978/258510.jpg?v=636437820770030000",
        "score": 0.5,
        "price": 6990,
        "category": "futbol",
        "reason": "Plastic materials; no eco-friendly certifications."
      },
      {
        "id": "73847",
        "label": "Bolsa de Basura Superior con Asas 70 x 90 cm 10 un.",
        "imageUrl": "https://jumbo.vtexassets.com/arquivos/ids/582058/Bolsa-de-aseo-Superior-con-asas-70x90-10-unid.jpg?v=638001649984200000",
        "score": 1,
        "price": 1120,
        "category": "accesorios-de-limpieza",
        "reason": "No ingredient data; plastic bags create substantial waste."
      },
      {
        "id": "29750",
        "label": "Raticida Pellet Anasac Rastop 250 g",
        "imageUrl": "https://jumbo.vtexassets.com/arquivos/ids/677054/Raticida-Pellet-Anasac-Rastop-250-g.jpg?v=638216596713600000",
        "score": 1,
        "price": 10490,
        "category": "jardin",
        "reason": "Plastic container with no eco-friendly indicators."
      },
      {
        "id": "139565",
        "label": "Preservativo Skyn Elite",
        "imageUrl": "https://jumbo.vtexassets.com/arquivos/ids/943194/PRESERVATIVO-SKYN-ELITE.jpg?v=638592492487130000",
        "score": 2.3,
        "price": 6290,
        "category": "preservativos-y-lubricantes",
        "reason": "No ingredient info but recyclable box with plastic wrappers."
      }
    ]
  },
  {
    name: 'Lista sustentable',
    icon: '🌳',
    items: [
      {
        "id": "72480",
        "label": "Té Blanco English Tea Shop 8 Bolsitas",
        "imageUrl": "https://jumbo.vtexassets.com/arquivos/ids/881120/Te-blanco-8-bolsitas.jpg?v=638542416046370000",
        "score": 9.5,
        "price": 1890,
        "category": "organico",
        "reason": "Organic white tea in recyclable packaging."
      },
      {
        "id": "1447",
        "label": "Aceite de Oliva Orgánico Extra Virgen 500 ml",
        "imageUrl": "https://jumbo.vtexassets.com/arquivos/ids/434877/Aceite-de-Oliva-organico-extra-virgen-500-ml.jpg?v=637560026006630000",
        "score": 9.3,
        "price": 11790,
        "category": "organico",
        "reason": "Highly sustainable organic olive oil with recyclable bottle."
      },
      {
        "id": "18741",
        "label": "Tunas Granel",
        "imageUrl": "https://jumbo.vtexassets.com/arquivos/ids/935253/261302-KG-01_17674.jpg?v=638580602257730000",
        "score": 9.3,
        "price": 3290,
        "category": "frutas",
        "reason": "Highly sustainable fruit; no packaging."
      },
      {
        "id": "131481",
        "label": "Quinoa Blanca Orgánica Andara 250 g",
        "imageUrl": "https://jumbo.vtexassets.com/arquivos/ids/856099/Quinoa-Blanca-Organica-Andara-250-g.jpg?v=638519833776370000",
        "score": 9,
        "price": 3190,
        "category": "busca?fq=H%3A14883",
        "reason": "Organic quinoa; likely paper-based packaging."
      },
      {
        "id": "103597",
        "label": "Seda Dental Biobrush Biofloss",
        "imageUrl": "https://jumbo.vtexassets.com/arquivos/ids/822353/Seda-Dental-Biobrush-Biofloss.jpg?v=638475739248000000",
        "score": 8.8,
        "price": 4290,
        "category": "ecofriendly",
        "reason": "Biodegradable, plastic-free; minimal, likely sustainable packaging."
      },
    ]
  }
];

// Create the context
const ListsContext = createContext();

// Create a provider component
export function ListsProvider({ children }) {
  const [lists, setLists] = useLocalStorage("lists", DEFAULT_LISTS);
  const [selectedListName, setSelectedListName] = useLocalStorage('selectedListName', lists[0]?.name || BASE_LIST.name);
  const selectedList = lists.find(list => list.name === selectedListName) || BASE_LIST;

  // Function to add a new list
  function addList(newList) {
    setLists([...lists, newList]);
  }

  // Function to select a list
  function selectList(listName) {
    setSelectedListName(listName);
  }

  // Function to add or update an item in the selected list
  function addItemToList(item) {
    const list = { ...selectedList };

    list.items = list.items.filter(i => i.id !== item.id);
    list.items.push(item);

    setLists([...lists.filter(l => l.name !== list.name), list]);
  }

  function removeItemFromList(itemId) {
    const list = { ...selectedList };

    list.items = list.items.filter(i => i.id !== itemId);

    setLists([...lists.filter(l => l.name !== list.name), list]);
  }

  return (
    <ListsContext.Provider
      value={{
        lists,
        addList,
        selectedList,
        selectList,
        addItemToList,
        removeItemFromList
      }}
    >
      {children}
    </ListsContext.Provider>
  );
}

// Custom hook to use the ListsContext
export function useLists() {
  return useContext(ListsContext);
}

