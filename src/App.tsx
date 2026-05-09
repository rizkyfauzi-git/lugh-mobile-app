import React from 'react';
import { BottomNav } from './components/BottomNav';
import { SummaryCard } from './components/SummaryCard';
import { TransactionList } from './components/TransactionList';

import logo from './assets/logo.png';

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 pb-20 overflow-x-hidden">
      {/* Header */}
      <header className="px-6 pt-12 pb-6 flex justify-between items-center bg-white fixed top-0 left-0 right-0 z-40 border-b border-slate-100 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl overflow-hidden shadow-lg shadow-emerald-100 border border-emerald-50">
            <img src={logo} alt="Lugh Finance Logo" className="w-full h-full object-cover" />
          </div>
          <div>
            <h1 className="text-xl font-bold font-heading text-slate-900 tracking-tight">Lugh Finance</h1>
          </div>
        </div>
        <div className="flex gap-2">
          <div className="px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-100 flex items-center gap-2">
             <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]"></div>
             <span className="text-[10px] font-bold text-emerald-700">System Live</span>
          </div>
        </div>
      </header>

      <main className="px-4 sm:px-6 pt-32">
        {/* Main Balance */}
        <SummaryCard type="balance" amount={12450000} label="Current Balance" />

        {/* Stats Summary */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4 mt-4">
          <SummaryCard type="income" amount={3450000} label="Total Income" />
          <SummaryCard type="expense" amount={1200000} label="Total Expense" />
        </div>

        {/* Transaction List */}
        <TransactionList />
      </main>

      {/* Navigation */}
      <BottomNav />
    </div>
  );
};

export default App;
