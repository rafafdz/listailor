import { createContext, useContext, useState } from 'react';
import { useLocalStorage } from "@uidotdev/usehooks";

export const BASE_LIST = {
  name: 'Lista',
  icon: '🌳',
  items: []
}

const DEFAULT_LISTS = [
  {
    name: 'Lista sustentable',
    icon: '🌳',
    items: [
      {
        id: 1,
        label: "Helado colun 1 125G",
        imageUrl: "https://jumbo.vtexassets.com/arquivos/ids/466501-180-180?width=900width=180&height=180height=900&aspect=true",
        score: 5.0,
        price: 2333,
        category: "Yogurts",
        reason: "La razon es que esta wea contamina caleta papito",
        quantity: 3
      },
      {
        id: 2,
        label: "Yogurt colun 2 125G",
        imageUrl: "https://jumbo.vtexassets.com/arquivos/ids/466501-180-180?width=900width=180&height=180height=900&aspect=true",
        score: 5.0,
        price: 2333,
        category: "Yogurts",
        reason: "La razon es que esta wea contamina caleta papito",
        quantity: 1
      },
      {
        id: 3,
        label: "Yogurt con granola 125G",
        imageUrl: "https://jumbo.vtexassets.com/arquivos/ids/466501-180-180?width=900width=180&height=180height=900&aspect=true",
        score: 5.0,
        price: 2333,
        category: "Yogurts",
        reason: "La razon es que esta wea contamina caleta papito",
        quantity: 1
      },
      {
        id: 4,
        label: "Cereales milo 125G",
        imageUrl: "https://jumbo.vtexassets.com/arquivos/ids/466501-180-180?width=900width=180&height=180height=900&aspect=true",
        score: 5.0,
        price: 2333,
        category: "Yogurts",
        reason: "La razon es que esta wea contamina caleta papito",
        quantity: 1
      },
      {
        id: 5,
        label: "Leche con yogurt 125G",
        imageUrl: "https://jumbo.vtexassets.com/arquivos/ids/466501-180-180?width=900width=180&height=180height=900&aspect=true",
        score: 5.0,
        price: 2333,
        category: "Yogurts",
        reason: "La razon es que esta wea contamina caleta papito",
        quantity: 1
      },
      {
        id: 5,
        label: "Queso griego 125G",
        imageUrl: "https://jumbo.vtexassets.com/arquivos/ids/466501-180-180?width=900width=180&height=180height=900&aspect=true",
        score: 5.0,
        price: 2333,
        category: "Yogurts",
        reason: "La razon es que esta wea contamina caleta papito",
        quantity: 1
      },
      {
        id: 5,
        label: "Pillows con cafeina 125G",
        imageUrl: "https://jumbo.vtexassets.com/arquivos/ids/466501-180-180?width=900width=180&height=180height=900&aspect=true",
        score: 5.0,
        price: 2333,
        category: "Yogurts",
        reason: "La razon es que esta wea contamina caleta papito",
        quantity: 1
      },
      {
        id: 5,
        label: "Marlboro red 125G",
        imageUrl: "https://jumbo.vtexassets.com/arquivos/ids/466501-180-180?width=900width=180&height=180height=900&aspect=true",
        score: 5.0,
        price: 2333,
        category: "Yogurts",
        reason: "La razon es que esta wea contamina caleta papito",
        quantity: 1
      }
    ]
  },
  {
    name: 'Lista no tan sustentable',
    icon: '🚬',
    items: [
      {
        id: 5,
        label: "Marlboro red 125G",
        imageUrl: "https://jumbo.vtexassets.com/arquivos/ids/466501-180-180?width=900width=180&height=180height=900&aspect=true",
        score: 1.0,
        price: 2333,
        category: "Yogurts",
        reason: "La razon es que esta wea contamina caleta papito",
        quantity: 1
      }
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

