import { displayScore } from '@/lib/utils';
import { NoSymbolIcon } from '@heroicons/react/24/solid'

const sizeClasses = {
  xs: {
    icon: 'w-3 h-3',
    text: 'text-xs',
    container: 'space-x-1',
  },
  sm: {
    icon: 'w-4 h-4',
    text: 'text-sm',
    container: 'space-x-2',
  },
  md: {
    icon: 'w-5 h-5',
    text: 'text-base',
    container: 'space-x-2',
  },
  xl: {
    icon: 'w-8 h-8',
    text: 'text-4xl',
    container: 'space-x-3',
  },
};

export default function ScoreBadge({ score, size = 'md' }) {
  const sizeClass = sizeClasses[size];

  return (
    <div className={`flex flex-row items-center ${sizeClass.container}`}>
      <NoSymbolIcon className={`text-red-500 ${sizeClass.icon}`} />
      <span className={`text-red-500 ${sizeClass.text}`}>
        {displayScore(score)}
      </span>
    </div>
  );
}

