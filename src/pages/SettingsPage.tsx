import React from 'react';
import { User, Bell, Shield, CircleHelp, LogOut, ChevronRight } from 'lucide-react';

const menuItems = [
  { icon: User, label: 'Profile Settings', sub: 'Manage your warteg info' },
  { icon: Bell, label: 'Notifications', sub: 'Daily summary & alerts' },
  { icon: Shield, label: 'Security', sub: 'PIN & Biometric' },
  { icon: CircleHelp, label: 'Help Center', sub: 'Contact support' },
];

export const SettingsPage: React.FC = () => {
  return (
    <div className="p-6 pb-32">
      <h2 className="text-xl font-bold font-heading text-slate-900 mb-6">Settings</h2>
      
      <div className="space-y-4">
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
