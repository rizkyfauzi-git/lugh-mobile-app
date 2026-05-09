import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Wallet, Tag, AlignLeft, Calendar } from 'lucide-react';

interface AddTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AddTransactionModal: React.FC<AddTransactionModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState<number>(0);
  const [walletId, setWalletId] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  
  const [categories, setCategories] = useState<any[]>([]);
  const [wallets, setWallets] = useState<any[]>([]);

  useEffect(() => {
    if (isOpen) {
      fetchData();
    }
  }, [isOpen]);

  const fetchData = async () => {
    const token = localStorage.getItem('token');
    try {
      const [catRes, wallRes] = await Promise.all([
        fetch('https://lugh-mobile-backend-v1.vercel.app/api/categories', { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch('https://lugh-mobile-backend-v1.vercel.app/api/wallets', { headers: { 'Authorization': `Bearer ${token}` } })
      ]);
      
      if (catRes.ok) setCategories(await catRes.json());
      if (wallRes.ok) setWallets(await wallRes.json());
    } catch (err) {
      console.error('Failed to fetch categories/wallets', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const token = localStorage.getItem('token');
    try {
      const response = await fetch('https://lugh-mobile-backend-v1.vercel.app/api/transactions', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          amount: parseInt(amount),
          type,
          description,
          category_id: categoryId || (categories.find(c => c.type === type)?.id || 1),
          wallet_id: walletId || (wallets[0]?.id || 1),
          date: new Date().toISOString()
        })
      });

      if (response.ok) {
        onSuccess();
        onClose();
        // Reset form
        setAmount('');
        setDescription('');
      } else {
        alert('Gagal mencatat transaksi. Periksa kembali saldo atau input Anda.');
      }
    } catch (err) {
      alert('Koneksi bermasalah.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100]"
          />

          {/* Modal */}
          <motion.div 
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 bg-white rounded-t-[3rem] p-8 z-[101] shadow-2xl overflow-y-auto max-h-[90vh]"
          >
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-black font-heading text-slate-900">Add Transaction</h2>
              <button onClick={onClose} className="p-2 rounded-2xl bg-slate-50 text-slate-400">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Type Switcher */}
              <div className="flex p-1 bg-slate-50 rounded-2xl gap-1">
                <button 
                  type="button"
                  onClick={() => setType('expense')}
                  className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all ${type === 'expense' ? 'bg-rose-500 text-white shadow-lg' : 'text-slate-400'}`}
                >
                  Pengeluaran
                </button>
                <button 
                  type="button"
                  onClick={() => setType('income')}
                  className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all ${type === 'income' ? 'bg-emerald-500 text-white shadow-lg' : 'text-slate-400'}`}
                >
                  Pemasukan
                </button>
              </div>

              {/* Amount Input */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Amount</label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-slate-400 text-lg">Rp</div>
                  <input 
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full bg-slate-50 border-none rounded-3xl py-5 pl-12 pr-4 text-2xl font-black text-slate-900 focus:ring-4 focus:ring-primary/10 transition-all"
                    placeholder="0"
                    required
                  />
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Description</label>
                <div className="relative group">
                  <div className="absolute left-4 top-5 text-slate-400 group-focus-within:text-primary transition-colors">
                    <AlignLeft size={20} />
                  </div>
                  <textarea 
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full bg-slate-50 border-none rounded-3xl py-4 pl-12 pr-4 text-sm font-medium text-slate-900 focus:ring-4 focus:ring-primary/10 transition-all h-24"
                    placeholder="Beli ayam potong 2kg..."
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Category Selection */}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Category</label>
                  <div className="relative group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors">
                      <Tag size={18} />
                    </div>
                    <select 
                      value={categoryId}
                      onChange={(e) => setCategoryId(parseInt(e.target.value))}
                      className="w-full bg-slate-50 border-none rounded-2xl py-4 pl-11 pr-4 text-xs font-bold text-slate-900 focus:ring-4 focus:ring-primary/10 transition-all appearance-none"
                    >
                      <option value={0}>Select Category</option>
                      {categories.filter(c => c.type === type).map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Wallet Selection */}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Wallet</label>
                  <div className="relative group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors">
                      <Wallet size={18} />
                    </div>
                    <select 
                      value={walletId}
                      onChange={(e) => setWalletId(parseInt(e.target.value))}
                      className="w-full bg-slate-50 border-none rounded-2xl py-4 pl-11 pr-4 text-xs font-bold text-slate-900 focus:ring-4 focus:ring-primary/10 transition-all appearance-none"
                    >
                      <option value={0}>Select Wallet</option>
                      {wallets.map(w => (
                        <option key={w.id} value={w.id}>{w.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <button 
                type="submit"
                disabled={loading}
                className={`w-full py-5 rounded-3xl font-bold text-lg flex items-center justify-center gap-3 shadow-xl transition-all active:scale-95 mt-6 ${type === 'income' ? 'gradient-primary shadow-emerald-200' : 'bg-rose-500 text-white shadow-rose-200'} disabled:opacity-70`}
              >
                {loading ? 'Processing...' : `Save ${type === 'income' ? 'Income' : 'Expense'}`}
                {!loading && <Plus size={20} />}
              </button>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
