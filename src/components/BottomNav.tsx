import React from 'react';
import { Home, BarChart2, PlusCircle, History, Settings } from 'lucide-react';
import { motion } from 'framer-motion';

interface BottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const navItems = [
  { id: 'home', icon: Home, label: 'Home' },
  { id: 'stats', icon: BarChart2, label: 'Stats' },
  { id: 'add', icon: PlusCircle, label: 'Add', isCenter: true },
  { id: 'history', icon: History, label: 'History' },
  { id: 'settings', icon: Settings, label: 'Settings' },
];

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onTabChange }) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 glass border-t border-slate-200 safe-bottom z-50">
      <div className="flex justify-around items-end px-2 py-2">
        {navItems.map((item) => (
          <motion.button
            key={item.id}
            whileTap={{ scale: 0.9 }}
            onClick={() => onTabChange(item.id)}
            className={`flex flex-col items-center justify-center p-2 rounded-2xl transition-all ${
              activeTab === item.id ? 'text-primary' : 'text-slate-400'
            } ${item.isCenter ? 'bg-primary text-white -translate-y-6 shadow-lg shadow-primary/40 p-4' : ''}`}
          >
            <item.icon size={item.isCenter ? 28 : 24} />
            {!item.isCenter && <span className="text-[10px] font-medium mt-1">{item.label}</span>}
          </motion.button>
        ))}
      </div>
    </div>
  );
};
