import { displayScore } from '@/lib/utils';

const sizeClasses = {
  md: {
    icon: 'text-base',
    text: 'text-base',
    container: 'space-x-2',
  },
  xl: {
    icon: 'text-2xl',
    text: 'text-4xl',
    container: 'space-x-3',
  },
};

export default function ScoreBadge({ score, size = 'md' }) {
  const sizeClass = sizeClasses[size];
  let emoji = '🌳';
  let textColor = 'text-green-500';

  if (score < 2.5) {
    emoji = '🏭'
    textColor = 'text-red-500'
  } else if (score < 5) {
    emoji = '🟡'
    textColor = 'text-yellow-500'
  }

  return (
    <div className={`flex flex-row items-center ${sizeClass.container}`}>
      <span className={`text-red-500 ${sizeClass.icon}`}>
        {emoji}
      </span>
      <span className={`${textColor} ${sizeClass.text}`}>
        {displayScore(score)}
      </span>
    </div>
  );
}

