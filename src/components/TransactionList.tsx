import React, { useEffect, useState } from 'react';
import { ShoppingBag, Utensils, Zap, TrendingUp, TrendingDown, FileText } from 'lucide-react';

interface Transaction {
  id: number;
  description: string;
  type: 'income' | 'expense';
  amount: number;
  date: string;
  category_name?: string;
}

interface TransactionListProps {
  showHeading?: boolean;
  limit?: number;
}

export const TransactionList: React.FC<TransactionListProps> = ({ showHeading = true, limit }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('https://lugh-mobile-backend-v1.vercel.app/api/transactions', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
          let data = await response.json();
          if (limit) data = data.slice(0, limit);
          setTransactions(data);
        }
      } catch (err) {
        console.error('Failed to fetch transactions', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [limit]);

  const getIcon = (type: string, description: string) => {
    if (type === 'income') return { icon: Utensils, color: 'bg-emerald-100 text-emerald-600' };
    if (description.toLowerCase().includes('belanja') || description.toLowerCase().includes('pasar')) 
      return { icon: ShoppingBag, color: 'bg-orange-100 text-orange-600' };
    if (description.toLowerCase().includes('listrik') || description.toLowerCase().includes('air'))
      return { icon: Zap, color: 'bg-blue-100 text-blue-600' };
    return { icon: FileText, color: 'bg-slate-100 text-slate-600' };
  };

  if (loading) {
    return (
      <div className="py-10 text-center text-slate-400 font-medium animate-pulse">
        Memuat data transaksi...
      </div>
    );
  }

  return (
    <div className="mt-4 pb-32">
      {showHeading && (
        <div className="flex justify-between items-center mb-4 px-1">
          <h2 className="text-lg font-bold font-heading text-slate-800">Recent Activity</h2>
          <button className="text-sm font-semibold text-primary">See All</button>
        </div>
      )}
      
      <div className="space-y-3">
        {transactions.length === 0 ? (
          <div className="py-10 text-center bg-white rounded-3xl border border-dashed border-slate-200">
            <p className="text-sm text-slate-400 font-medium">Belum ada transaksi</p>
          </div>
        ) : (
          transactions.map((tx) => {
            const { icon: Icon, color } = getIcon(tx.type, tx.description);
            const date = new Date(tx.date);
            const timeStr = date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
            
            return (
              <div key={tx.id} className="glass p-3 sm:p-4 rounded-3xl flex items-center justify-between transition-transform active:scale-[0.98]">
                <div className="flex items-center gap-3 sm:gap-4 overflow-hidden">
                  <div className={`p-2 sm:p-3 rounded-2xl flex-shrink-0 ${color}`}>
                    <Icon size={18} />
                  </div>
                  <div className="overflow-hidden">
                    <h4 className="font-bold text-slate-900 text-xs sm:text-sm truncate">{tx.description}</h4>
                    <p className="text-[10px] sm:text-xs text-slate-400 font-medium truncate">
                      {tx.category_name || (tx.type === 'income' ? 'Penjualan' : 'Operasional')} • {timeStr}
                    </p>
                  </div>
                </div>
                <div className="text-right flex-shrink-0 ml-2">
                  <p className={`font-bold text-xs sm:text-sm ${tx.type === 'income' ? 'text-emerald-600' : 'text-slate-900'}`}>
                    {tx.type === 'income' ? '+' : '-'}{tx.amount.toLocaleString('id-ID')}
                  </p>
                  <div className="flex items-center justify-end gap-1 mt-0.5 sm:mt-1">
                    {tx.type === 'income' ? <TrendingUp size={10} className="text-emerald-500" /> : <TrendingDown size={10} className="text-rose-500" />}
                    <span className="text-[9px] sm:text-[10px] font-bold text-slate-400">Success</span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
