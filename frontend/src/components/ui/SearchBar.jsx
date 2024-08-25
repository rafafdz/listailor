import { useState } from "react";
import { MagnifyingGlassIcon } from '@heroicons/react/24/solid';
import colors from 'tailwindcss/colors';

export default function SearchBar({ onChangeText, onSubmit }) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div
      className={`
        w-full bg-gray-50 flex flex-row ring-2 relative py-4 px-6 rounded-xl transition-colors duration-200
        ${isFocused ? 'ring-primary' : 'ring-transparent'}
      `}
    >
      <MagnifyingGlassIcon
        className="w-6 h-6"
        color={colors.gray[400]}
      />
      <input
        className="bg-transparent text-gray-400 px-4 w-full"
        onChange={(e) => onChangeText(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onKeyPress={(e) => {
          if (e.key === 'Enter') {
            onSubmit(e);
          }
        }}
        placeholder="Busca un producto..."
      />
    </div>
  );
}

