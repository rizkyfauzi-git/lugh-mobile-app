import React, { useEffect, useState } from 'react';
import { BottomNav } from './components/BottomNav';
import { SummaryCard } from './components/SummaryCard';
import { TransactionList } from './components/TransactionList';
import { StatsPage } from './pages/StatsPage';
import { HistoryPage } from './pages/HistoryPage';
import { SettingsPage } from './pages/SettingsPage';
import { StatusBar } from '@capacitor/status-bar';

import logo from './assets/logo.png';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('home');

  useEffect(() => {
    // Hide status bar for immersive experience
    StatusBar.hide().catch(() => {});
  }, []);

  const renderPage = () => {
    switch (activeTab) {
      case 'home':
        return <TransactionList showHeading={false} />;
      case 'stats':
        return <StatsPage />;
      case 'history':
        return <HistoryPage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <TransactionList showHeading={false} />;
    }
  };

  return (
    <div className="h-screen bg-slate-50 overflow-hidden flex flex-col">
      {/* Fixed Top Section */}
      <div className="flex-none bg-white">
        {/* Header */}
        <header className="px-6 pt-12 pb-4 flex justify-between items-center border-b border-slate-100 shadow-sm">
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

        {activeTab === 'home' && (
          <div className="px-6 py-4">
            {/* Balance Card - Non-scrollable */}
            <SummaryCard type="balance" amount={12450000} label="Current Balance" />
            
            {/* Recent Activity Heading - Non-scrollable */}
            <div className="flex justify-between items-center mt-6 mb-2">
              <h2 className="text-lg font-bold font-heading text-slate-800">Recent Activity</h2>
              <button className="text-sm font-semibold text-primary" onClick={() => setActiveTab('history')}>See All</button>
            </div>
          </div>
        )}
      </div>

      {/* Scrollable Content Section */}
      <main className="flex-1 overflow-y-auto px-4 sm:px-6 overscroll-none">
        {renderPage()}
      </main>

      {/* Navigation */}
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
};

export default App;
