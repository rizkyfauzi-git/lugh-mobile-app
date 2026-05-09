import React, { useEffect, useState } from 'react';
import { BottomNav } from './components/BottomNav';
import { SummaryCard } from './components/SummaryCard';
import { TransactionList } from './components/TransactionList';
import { StatsPage } from './pages/StatsPage';
import { HistoryPage } from './pages/HistoryPage';
import { SettingsPage } from './pages/SettingsPage';
import { StatusBar } from '@capacitor/status-bar';

import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { AddTransactionPage } from './pages/AddTransactionPage';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchProfile, fetchSummary, fetchTransactions } from './services/api';

import logo from './assets/logo.png';

const App: React.FC = () => {
  const queryClient = useQueryClient();
  const [view, setView] = useState<'landing' | 'login' | 'register' | 'add-transaction' | 'app'>('landing');
  const [activeTab, setActiveTab] = useState('home');
  const [historyCategories, setHistoryCategories] = useState<string[]>(['All']);
  const [activeHistoryFilter, setActiveHistoryFilter] = useState('All');

  // TanStack Query for User Profile
  const { data: user, status: profileStatus } = useQuery({
    queryKey: ['profile'],
    queryFn: fetchProfile,
    enabled: !!localStorage.getItem('token'),
    retry: false,
  });

  const { data: allTransactions = [] } = useQuery({
    queryKey: ['transactions'],
    queryFn: () => fetchTransactions(),
    enabled: !!user,
  });

  useEffect(() => {
    if (allTransactions.length > 0) {
      const uniqueCats = Array.from(new Set(allTransactions.map((tx: any) => 
        tx.category_name || (tx.type === 'income' ? 'Penjualan' : 'Operasional')
      ))) as string[];
      setHistoryCategories(['All', ...uniqueCats]);
    }
  }, [allTransactions]);

  // TanStack Query for Financial Summary
  const { data: summary = { total_income: 0, total_expense: 0, balance: 0 } } = useQuery({
    queryKey: ['summary'],
    queryFn: fetchSummary,
    enabled: !!user,
  });

  useEffect(() => {
    StatusBar.show().catch(() => { });
    
    if (localStorage.getItem('token') && profileStatus === 'success') {
      setView('app');
    } else if (localStorage.getItem('token') && profileStatus === 'error') {
      localStorage.removeItem('token');
      setView('login');
    }
  }, [profileStatus]);

  const handleLoginSuccess = (token: string) => {
    localStorage.setItem('token', token);
    window.location.reload(); // Quick way to reset query client and state
  };

  if (view === 'landing') {
    return <LandingPage onGetStarted={() => setView('login')} />;
  }

  if (view === 'login') {
    return (
      <LoginPage 
        onLogin={handleLoginSuccess} 
        onGoToRegister={() => setView('register')} 
      />
    );
  }

  if (view === 'register') {
    return (
      <RegisterPage 
        onBackToLogin={() => setView('login')} 
        onRegisterSuccess={() => setView('login')} 
      />
    );
  }

  if (view === 'add-transaction') {
    return (
      <AddTransactionPage 
        onBack={() => setView('app')} 
        onSuccess={() => {
          setView('app');
          setActiveTab('home');
        }} 
      />
    );
  }

  const renderPage = () => {
    switch (activeTab) {
      case 'home':
        return <TransactionList showHeading={false} />;
      case 'stats':
        return <StatsPage summary={summary} />;
      case 'history':
        return <HistoryPage activeFilter={activeHistoryFilter} />;
      case 'settings':
        return (
          <SettingsPage 
            onLogout={() => {
              localStorage.removeItem('token');
              queryClient.clear();
              setView('login');
            }} 
          />
        );
      default:
        return <TransactionList showHeading={false} />;
    }
  };

  return (
    <div className="h-screen bg-slate-50 overflow-hidden flex flex-col">
      {/* Fixed Top Section - Now includes safe-top and white background */}
      <div className="flex-none bg-white border-b border-slate-100 shadow-sm safe-top ">
        {activeTab === 'home' && (
          <>
            {/* Header - Only on Home */}
            <header className="px-6 pt-4 pb-4 flex justify-between items-center mt-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl overflow-hidden shadow-lg shadow-emerald-100 border border-emerald-50">
                  <img src={logo} alt="Lugh Finance Logo" className="w-full h-full object-cover" />
                </div>
                <div>
                  <h1 className="text-xl font-bold font-heading text-slate-900 tracking-tight">
                    {user ? `Halo, ${user.username}` : 'Lugh Finance'}
                  </h1>
                </div>
              </div>
              <div className="flex gap-2">
                <div className="px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-100 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]"></div>
                  <span className="text-[10px] font-bold text-emerald-700">System Live</span>
                </div>
              </div>
            </header>

            <div className="px-6 pb-4">
              <SummaryCard type="balance" amount={summary.balance} label="Total Saldo Warteg" />
              


              <div className="flex justify-between items-center mt-6">
                <h2 className="text-lg font-bold font-heading text-slate-800">Recent Activity</h2>
                <button className="text-sm font-semibold text-primary" onClick={() => setActiveTab('history')}>See All</button>
              </div>
            </div>
          </>
        )}

        {activeTab === 'history' && (
          <div className="px-6 pt-4 pb-4">
            <h2 className="text-xl font-bold font-heading text-slate-900 mb-3">Transaction History</h2>
            <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
              {historyCategories.map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveHistoryFilter(filter)}
                  className={`px-5 py-2 rounded-full text-[10px] font-black whitespace-nowrap transition-all ${
                    activeHistoryFilter === filter 
                      ? 'bg-primary text-white shadow-lg shadow-emerald-100' 
                      : 'bg-slate-50 text-slate-400 border border-slate-100'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="px-6 pt-4 pb-3">
            <h2 className="text-xl font-bold font-heading text-slate-900">Settings</h2>
          </div>
        )}

        {activeTab === 'stats' && (
          <div className="px-6 pt-4 pb-3">
            <h2 className="text-xl font-bold font-heading text-slate-900">Financial Stats</h2>
          </div>
        )}
      </div>

      {/* Scrollable Content Section */}
      <main className="flex-1 overflow-y-auto px-4 sm:px-6 overscroll-none">
        {renderPage()}
      </main>

      {/* Navigation */}
      <BottomNav 
        activeTab={activeTab} 
        onTabChange={(tab) => {
          if (tab === 'add') {
            setView('add-transaction');
          } else {
            setActiveTab(tab);
          }
        }} 
      />
    </div>
  );
};

export default App;
