import React, { useState } from 'react';
import { User, Bell, Shield, CircleHelp, LogOut, ChevronRight, RefreshCw } from 'lucide-react';
import { Browser } from '@capacitor/browser';

const menuItems = [
  { icon: User, label: 'Profile Settings', sub: 'Manage your warteg info' },
  { icon: Bell, label: 'Notifications', sub: 'Daily summary & alerts' },
  { icon: Shield, label: 'Security', sub: 'PIN & Biometric' },
  { icon: CircleHelp, label: 'Help Center', sub: 'Contact support' },
];

export const SettingsPage: React.FC = () => {
  const [checking, setChecking] = useState(false);
  const currentVersion = '1.0.0';

  const checkUpdate = async () => {
    setChecking(true);
    try {
      const response = await fetch('https://api.github.com/repos/rizkyfauzi-git/lugh-mobile-app/releases/latest');
      const data = await response.json();
      
      if (data.tag_name) {
        const latestVersion = data.tag_name.replace('v', '').split('-')[0];
        
        if (latestVersion !== currentVersion) {
          const downloadUrl = data.assets[0]?.browser_download_url;
          if (downloadUrl && confirm(`New version v${latestVersion} is available! Download now?`)) {
            await Browser.open({ url: downloadUrl });
          }
        } else {
          alert('You are already using the latest version.');
        }
      }
    } catch (error) {
      alert('Failed to check for updates. Please try again later.');
    } finally {
      setChecking(false);
    }
  };

  return (
    <div className="p-6 pb-32">
      <h2 className="text-xl font-bold font-heading text-slate-900 mb-6">Settings</h2>
      
      <div className="space-y-4">
        <button 
          onClick={checkUpdate}
          disabled={checking}
          className="w-full bg-emerald-50 border border-emerald-100 p-4 rounded-3xl flex items-center justify-between transition-all active:scale-[0.98]"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-white text-emerald-600 shadow-sm">
              <RefreshCw size={20} className={checking ? 'animate-spin' : ''} />
            </div>
            <div className="text-left">
              <p className="text-sm font-bold text-slate-900">Check for Update</p>
              <p className="text-[10px] font-medium text-emerald-600">Current v{currentVersion}</p>
            </div>
          </div>
          <ChevronRight size={18} className="text-slate-300" />
        </button>

        {menuItems.map((item) => (
          <button key={item.label} className="w-full glass p-4 rounded-3xl flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-2xl bg-slate-50 text-slate-600">
                <item.icon size={20} />
              </div>
              <div className="text-left">
                <p className="text-sm font-bold text-slate-900">{item.label}</p>
                <p className="text-[10px] font-medium text-slate-400">{item.sub}</p>
              </div>
            </div>
            <ChevronRight size={18} className="text-slate-300" />
          </button>
        ))}

        <button className="w-full p-4 rounded-3xl flex items-center justify-center gap-2 text-rose-500 font-bold text-sm mt-8 border border-rose-100 bg-rose-50/30">
          <LogOut size={18} />
          Logout Account
        </button>
      </div>

      <div className="mt-12 text-center">
        <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">Lugh Finance v1.0.0</p>
      </div>
    </div>
  );
};
