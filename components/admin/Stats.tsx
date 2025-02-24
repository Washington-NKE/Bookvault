import { db } from '@/database/drizzle';
import { borrowRecords } from '@/database/schema';
import React from 'react'
import {FaArrowUp, FaArrowDown} from 'react-icons/fa';

const Stats = () => {
  
    const change = -2;
    const change2 = 3;
    const change3 = 3;
  return (
    <div className="flex space-x-4 space-y-0">
        <div className="m-2 flex flex-1 flex-col items-center justify-center rounded-lg border border-white bg-white p-4">
      <div className="flex">
      Borrowed Books 
      <div className={change > 0 ? 'px-2 text-green-500 ' : change  < 0 ? 'px-2 text-red-600' : 'px-2 text-gray-500'}>
        {change > 0 ? <FaArrowUp className="inline
        " />: <FaArrowDown className="inline" />} {Math.abs(change)}
      </div>
      </div>
      <p>17</p>
    </div>
    <div className="m-2  flex  flex-1 flex-col items-center justify-center rounded-lg border  border-white  bg-white  p-2">
      <div className="flex">     
      Total Users 
      <div className={change2 > 0 ? 'px-2 text-green-500' : change2  < 0 ? 'px-2 text-red-600' : 'px-2 text-gray-500'}>
        {change2 > 0 ? <FaArrowUp className="inline
        " />: <FaArrowDown className="inline" />} {Math.abs(change2)}
      </div>
      </div>
      <p className="block">17</p>
      </div>
    <div className="m-2 flex  flex-1 flex-col items-center justify-center rounded-lg border border-white  bg-white p-2">
      <div className="flex">      
      Total Books
      <div className={change3 > 0 ? 'px-2 text-green-500' : change3 < 0 ? 'px-2 text-red-600' : 'px-2 text-gray-500'}>
        {change3 > 0 ? <FaArrowUp className="inline
        " />: <FaArrowDown className="inline" />} {Math.abs(change3)}
      </div>
      </div>
      <p>17</p>
      </div>
      </div>
  )
}

export default Stats
