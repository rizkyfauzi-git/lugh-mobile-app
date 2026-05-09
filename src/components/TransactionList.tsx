import React from 'react';
import { ShoppingBag, Utensils, Zap, TrendingUp, TrendingDown } from 'lucide-react';

const transactions = [
  { id: 1, title: 'Beras & Sembako', category: 'Inventory', amount: -450000, time: '10:30 AM', icon: ShoppingBag, color: 'bg-orange-100 text-orange-600' },
  { id: 2, title: 'Penjualan Siang', category: 'Revenue', amount: 1250000, time: '02:00 PM', icon: Utensils, color: 'bg-emerald-100 text-emerald-600' },
  { id: 3, title: 'Listrik & Air', category: 'Bills', amount: -150000, time: '04:15 PM', icon: Zap, color: 'bg-blue-100 text-blue-600' },
  { id: 4, title: 'Penjualan Malam', category: 'Revenue', amount: 850000, time: '09:00 PM', icon: Utensils, color: 'bg-emerald-100 text-emerald-600' },
];

interface TransactionListProps {
  showHeading?: boolean;
}

export const TransactionList: React.FC<TransactionListProps> = ({ showHeading = true }) => {
  return (
    <div className="mt-4 pb-32">
      {showHeading && (
        <div className="flex justify-between items-center mb-4 px-1">
          <h2 className="text-lg font-bold font-heading text-slate-800">Recent Activity</h2>
          <button className="text-sm font-semibold text-primary">See All</button>
        </div>
      )}
      
      <div className="space-y-3">
        {transactions.map((tx) => (
          <div key={tx.id} className="glass p-3 sm:p-4 rounded-3xl flex items-center justify-between transition-transform active:scale-[0.98]">
            <div className="flex items-center gap-3 sm:gap-4 overflow-hidden">
              <div className={`p-2 sm:p-3 rounded-2xl flex-shrink-0 ${tx.color}`}>
                <tx.icon size={18} />
              </div>
              <div className="overflow-hidden">
                <h4 className="font-bold text-slate-900 text-xs sm:text-sm truncate">{tx.title}</h4>
                <p className="text-[10px] sm:text-xs text-slate-400 font-medium truncate">{tx.category} • {tx.time}</p>
              </div>
            </div>
            <div className="text-right flex-shrink-0 ml-2">
              <p className={`font-bold text-xs sm:text-sm ${tx.amount > 0 ? 'text-emerald-600' : 'text-slate-900'}`}>
                {tx.amount > 0 ? '+' : ''}{tx.amount.toLocaleString('id-ID')}
              </p>
              <div className="flex items-center justify-end gap-1 mt-0.5 sm:mt-1">
                {tx.amount > 0 ? <TrendingUp size={10} className="text-emerald-500" /> : <TrendingDown size={10} className="text-rose-500" />}
                <span className="text-[9px] sm:text-[10px] font-bold text-slate-400">Success</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
