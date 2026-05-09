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
import { AddTransactionModal } from './components/AddTransactionModal';

import logo from './assets/logo.png';

const App: React.FC = () => {
  const [view, setView] = useState<'landing' | 'login' | 'register' | 'app'>('landing');
  const [activeTab, setActiveTab] = useState('home');
  const [user, setUser] = useState<any>(null);
  const [summary, setSummary] = useState({ total_income: 0, total_expense: 0, balance: 0 });
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const fetchSummary = async (token: string) => {
    try {
      const response = await fetch('https://lugh-mobile-backend-v1.vercel.app/api/transactions/summary', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setSummary(data);
      }
    } catch (err) {
      console.error('Failed to fetch summary', err);
    }
  };

  const fetchProfile = async (token: string) => {
    try {
      const response = await fetch('https://lugh-mobile-backend-v1.vercel.app/api/user/profile', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
        fetchSummary(token); // Ambil data keuangan setelah profil didapat
        setView('app');
      } else {
        localStorage.removeItem('token');
        setView('login');
      }
    } catch (err) {
      console.error('Failed to fetch profile', err);
    }
  };

  useEffect(() => {
    StatusBar.show().catch(() => { });
    
    // Auto-login if token exists
    const token = localStorage.getItem('token');
    if (token) {
      fetchProfile(token);
    }
  }, []);

  const handleLoginSuccess = (token: string) => {
    localStorage.setItem('token', token);
    fetchProfile(token);
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

  const renderPage = () => {
    switch (activeTab) {
      case 'home':
        return <TransactionList showHeading={false} />;
      case 'stats':
        return <StatsPage summary={summary} />;
      case 'history':
        return <HistoryPage />;
      case 'settings':
        return (
          <SettingsPage 
            onLogout={() => {
              localStorage.removeItem('token');
              setUser(null);
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
          <div className="px-6 pt-4 pb-3">
            <h2 className="text-xl font-bold font-heading text-slate-900 mb-2">Transaction History</h2>
            <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
              {['All', 'Revenue', 'Inventory', 'Bills', 'Wages'].map((filter) => (
                <button
                  key={filter}
                  className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap ${filter === 'All' ? 'bg-primary text-white' : 'bg-slate-50 text-slate-500 border border-slate-100'
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
            setIsAddModalOpen(true);
          } else {
            setActiveTab(tab);
          }
        }} 
      />

      <AddTransactionModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={() => {
          const token = localStorage.getItem('token');
          if (token) fetchSummary(token);
          // Refresh current page if it's transaction list
          setActiveTab('home');
        }}
      />
    </div>
  );
};

export default App;
