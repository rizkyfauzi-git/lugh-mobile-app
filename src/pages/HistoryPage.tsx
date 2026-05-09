import React, { useState, useEffect } from 'react';
import { TransactionList } from '../components/TransactionList';

export const HistoryPage: React.FC = () => {
  const [categories, setCategories] = useState<string[]>(['All']);
  const [activeFilter, setActiveFilter] = useState('All');

  useEffect(() => {
    const fetchCategoriesFromTx = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('https://lugh-mobile-backend-v1.vercel.app/api/transactions', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
          const txs = await response.json();
          // Ekstrak kategori unik dari transaksi
          const uniqueCats = Array.from(new Set(txs.map((tx: any) => 
            tx.category_name || (tx.type === 'income' ? 'Penjualan' : 'Operasional')
          ))) as string[];
          setCategories(['All', ...uniqueCats]);
        }
      } catch (err) {
        console.error('Failed to fetch categories from transactions', err);
      }
    };

    fetchCategoriesFromTx();
  }, []);

  return (
    <div className="pt-2 pb-32 px-6">
      <div className="flex gap-2 overflow-x-auto pb-4 no-scrollbar">
        {categories.map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`px-5 py-2.5 rounded-full text-xs font-black whitespace-nowrap transition-all ${
              activeFilter === filter 
                ? 'bg-primary text-white shadow-lg shadow-emerald-100' 
                : 'bg-white text-slate-400 border border-slate-100'
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      <TransactionList 
        showHeading={false} 
        isClickable={true} 
        filterCategory={activeFilter} 
      />
    </div>
  );
};
