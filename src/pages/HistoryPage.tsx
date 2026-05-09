import React from 'react';
import { TransactionList } from '../components/TransactionList';

export const HistoryPage: React.FC = () => {
  return (
    <div className="p-6 pt-12 pb-32">
      <h2 className="text-xl font-bold font-heading text-slate-900 mb-6">Transaction History</h2>
      
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2 no-scrollbar">
        {['All', 'Revenue', 'Inventory', 'Bills', 'Wages'].map((filter) => (
          <button 
            key={filter}
            className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap ${
              filter === 'All' ? 'bg-primary text-white' : 'bg-white text-slate-500 border border-slate-100'
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      <TransactionList />
    </div>
  );
};
