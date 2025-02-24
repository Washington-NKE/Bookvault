'use client'

import React, { useEffect, useState } from 'react';
import { ArrowDown, ArrowUp } from 'lucide-react';

interface StatData {
  current: number;
  change: number;
}

interface StatsData {
  borrowedBooks: StatData;
  totalUsers: StatData;
  totalBooks: StatData;
}

const StatCard = ({ 
  title, 
  count, 
  change 
}: { 
  title: string; 
  count: number; 
  change: number;
}) => {
  const isPositive = change >= 0;
  
  return (
    <div className="bg-white rounded-lg p-4 shadow-sm">
      <div className="flex flex-col items-center justify-center text-center">
        <div className="flex items-center gap-2 text-sm font-medium mb-1">
          {title}
          <span className={`flex items-center ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
            {isPositive ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
            {Math.abs(change)}
          </span>
        </div>
        <div className="text-2xl font-semibold">
          {count}
        </div>
      </div>
    </div>
  );
};

const Stats = () => {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('/api/analytics/stats');
        if (!res.ok) throw new Error('Failed to fetch statistics');
        const data = await res.json();
        setStats(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load statistics');
      }
    };

    fetchStats();
    // Update every hour
    const interval = setInterval(fetchStats, 3600000);
    return () => clearInterval(interval);
  }, []);

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  if (!stats) {
    return <div className="text-gray-500">Loading statistics...</div>;
  }

  return (
    <div className="grid grid-cols-3 gap-4">
      <StatCard
        title="Borrowed Books"
        count={stats.borrowedBooks.current}
        change={stats.borrowedBooks.change}
      />
      <StatCard
        title="Total Users"
        count={stats.totalUsers.current}
        change={stats.totalUsers.change}
      />
      <StatCard
        title="Total Books"
        count={stats.totalBooks.current}
        change={stats.totalBooks.change}
      />
    </div>
  );
};

export default Stats;