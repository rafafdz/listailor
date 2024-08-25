import { computeListScore, displayScore } from '@/lib/utils';

export default function ListCard({ list, onClick }){
  let scoreBgColorClass = 'bg-green-500';

  if (list.score < 25) {
    scoreBgColorClass = 'bg-red-500'
  } else if (list.score < 60) {
    scoreBgColorClass = 'bg-green-500'
  }

  return(
    <button
      onClick={() => onClick(name)}
      className='relative rounded-xl bg-gray-100 px-6 py-2 flex flex-row items-center'
    >
      <span className='text-lg'>{list.icon}</span>
      <span className='text-sm text-gray-700 ml-4'>{list.name}</span>
      <div className={`${scoreBgColorClass} rounded-full w-5 h-5 flex items-center justify-center absolute -top-1 -right-1`}>
        <span className='text-white font-bold text-[10px]'>
          {displayScore(computeListScore(list))}
        </span>
      </div>
    </button>
  )
}
