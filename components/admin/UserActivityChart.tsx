'use client'

import React, { useState, useEffect } from 'react';

interface BorrowRecord {
  borrowDate: string;
}

interface UserActivityChartProps {
  borrowHistory: BorrowRecord[];
}

const UserActivityChart = ({ borrowHistory }: UserActivityChartProps) => {
  const [chartData, setChartData] = useState<{ month: string; count: number; }[]>([]);
  
  useEffect(() => {
    // Prepare data for the chart
    const today = new Date();
    const last6Months = Array.from({ length: 6 }, (_, i) => {
      const date = new Date(today);
      date.setMonth(today.getMonth() - (5 - i));
      return {
        month: date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        count: 0
      };
    });
    
    // Count borrows per month
    if (borrowHistory && borrowHistory.length) {
      borrowHistory.forEach(borrow => {
        if (!borrow.borrowDate) return;
        
        const borrowDate = new Date(borrow.borrowDate);
        const monthKey = borrowDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
        
        const monthData = last6Months.find(m => m.month === monthKey);
        if (monthData) {
          monthData.count += 1;
        }
      });
    }
    
    setChartData(last6Months);
  }, [borrowHistory]);
  
  // Find the maximum count for scaling
  const maxCount = Math.max(...chartData.map(item => item.count), 1);
  
  return (
    <div className="w-full p-4">
      <h3 className="text-lg font-medium mb-4">Borrowing Activity</h3>
      
      <div className="flex flex-col h-64">
        <div className="flex items-end h-48 space-x-2 mb-2">
          {chartData.map((item, index) => {
            const heightPercent = (item.count / maxCount) * 100;
            return (
              <div key={index} className="flex flex-col items-center flex-1">
                <div className="relative w-full flex justify-center">
                  <div 
                    className="bg-blue-500 w-5/6 rounded-t" 
                    style={{ height: `${heightPercent}%`, minHeight: item.count > 0 ? '4px' : '0' }}
                  ></div>
                  <div className="absolute -top-6 text-xs font-medium">
                    {item.count}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="flex text-xs text-gray-600">
          {chartData.map((item, index) => (
            <div key={index} className="flex-1 text-center">
              {item.month}
            </div>
          ))}
        </div>
      </div>
      
      <div className="mt-4 text-sm text-gray-500 text-center">
        Books borrowed over the last 6 months
      </div>
    </div>
  );
};

export default UserActivityChart;