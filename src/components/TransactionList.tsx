import React, { useEffect, useState } from 'react';
import { ShoppingBag, Utensils, Zap, TrendingUp, TrendingDown, FileText, X, Clock, Wallet, Tag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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
  isClickable?: boolean;
  filterCategory?: string;
}

export const TransactionList: React.FC<TransactionListProps> = ({ 
  showHeading = true, 
  limit,
  isClickable = false,
  filterCategory = 'All'
}) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);

  useEffect(() => {
// ... existing fetch ...
    const fetchTransactions = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('https://lugh-mobile-backend-v1.vercel.app/api/transactions', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
          let data = await response.json();
          
          // Filter berdasarkan kategori yang dipilih
          if (filterCategory !== 'All') {
            data = data.filter((tx: any) => {
              const txCat = tx.category_name || (tx.type === 'income' ? 'Penjualan' : 'Operasional');
              return txCat === filterCategory;
            });
          }

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
            
            const ItemWrapper = isClickable ? 'button' : 'div';
            
            return (
              <ItemWrapper 
                key={tx.id} 
                onClick={() => isClickable && setSelectedTx(tx)}
                className={`w-full text-left glass p-3 sm:p-4 rounded-3xl flex items-center justify-between transition-transform ${isClickable ? 'active:scale-[0.98]' : ''}`}
              >
                <div className="flex items-center gap-3 sm:gap-4 overflow-hidden">
                  <div className={`p-2 sm:p-3 rounded-2xl flex-shrink-0 ${color}`}>
                    <Icon size={18} />
                  </div>
                  <div className="overflow-hidden">
                    <h4 className="font-bold text-slate-900 text-xs sm:text-sm truncate capitalize">{tx.description}</h4>
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
              </ItemWrapper>
            );
          })
        )}
      </div>

      {/* Transaction Detail Modal */}
      <AnimatePresence>
        {selectedTx && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedTx(null)}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100]"
            />
            <motion.div 
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              className="fixed bottom-0 left-0 right-0 bg-white rounded-t-[2.5rem] p-8 z-[101] shadow-2xl"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-black font-heading text-slate-900">Transaction Detail</h3>
                <button onClick={() => setSelectedTx(null)} className="p-2 rounded-xl bg-slate-50 text-slate-400">
                  <X size={20} />
                </button>
              </div>

              <div className="flex flex-col items-center mb-8">
                <div className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center mb-4 ${getIcon(selectedTx.type, selectedTx.description).color}`}>
                  {React.createElement(getIcon(selectedTx.type, selectedTx.description).icon, { size: 32 })}
                </div>
                <h2 className={`text-3xl font-black ${selectedTx.type === 'income' ? 'text-emerald-600' : 'text-slate-900'}`}>
                  {selectedTx.type === 'income' ? '+' : '-'}{selectedTx.amount.toLocaleString('id-ID')}
                </h2>
                <p className="text-sm font-bold text-slate-400 mt-1 capitalize">{selectedTx.description}</p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                  <div className="flex items-center gap-3">
                    <Clock size={18} className="text-slate-400" />
                    <span className="text-xs font-bold text-slate-500">Time & Date</span>
                  </div>
                  <span className="text-xs font-black text-slate-900">
                    {new Date(selectedTx.date).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })}
                  </span>
                </div>

                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                  <div className="flex items-center gap-3">
                    <Tag size={18} className="text-slate-400" />
                    <span className="text-xs font-bold text-slate-500">Category</span>
                  </div>
                  <span className="text-xs font-black text-slate-900">
                    {selectedTx.category_name || (selectedTx.type === 'income' ? 'Penjualan' : 'Operasional')}
                  </span>
                </div>

                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                  <div className="flex items-center gap-3">
                    <Wallet size={18} className="text-slate-400" />
                    <span className="text-xs font-bold text-slate-500">Payment Method</span>
                  </div>
                  <span className="text-xs font-black text-slate-900 uppercase">Cash</span>
                </div>
              </div>

              <button 
                onClick={() => setSelectedTx(null)}
                className="w-full mt-8 py-5 rounded-[2rem] bg-slate-900 text-white font-bold text-sm shadow-xl active:scale-95 transition-transform"
              >
                Close Details
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
