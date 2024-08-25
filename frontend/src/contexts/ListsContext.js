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
    items: []
  },
  {
    name: 'Lista no tan sustentable',
    icon: '🚬',
    items: []
  }
];

// Create the context
const ListsContext = createContext();

// Create a provider component
export function ListsProvider({ children }) {
  const [lists, setLists] = useLocalStorage("lists", DEFAULT_LISTS);
  const [selectedListName, setSelectedListName] = useState(lists[0]?.name || BASE_LIST.name);
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
    console.log(item.id, item.quantity);
    const list = { ...selectedList };

    list.items = list.items.filter(i => i.id !== item.id);
    list.items.push(item);

    console.log(list.name, item);

    setLists([...lists.filter(l => l.id !== list.id), list]);
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

