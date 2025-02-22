'use client'

import React, {useState} from 'react'
import { SortAsc, SortDesc } from 'lucide-react';

const Sort = () => {
    const [isAscending, setIsAscending] = useState(true);

    const handleSortClick = () => {
      setIsAscending(!isAscending);
    };
  return (
    <span className='flex items-center space-x-4 text-sm text-gray-500' onClick={handleSortClick}>Oldest to Recent
                {isAscending ? <SortAsc size={16} /> : <SortDesc size={16} />}
    </span>
  )
}

export default Sort
