import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Wallet, Tag, AlignLeft, ArrowLeft, PlusCircle } from 'lucide-react';

interface AddTransactionPageProps {
  onBack: () => void;
  onSuccess: () => void;
}

export const AddTransactionPage: React.FC<AddTransactionPageProps> = ({ onBack, onSuccess }) => {
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState<number>(0);
  const [walletId, setWalletId] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  
  const [categories, setCategories] = useState<any[]>([]);
  const [wallets, setWallets] = useState<any[]>([]);
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const token = localStorage.getItem('token');
    try {
      const [catRes, wallRes] = await Promise.all([
        fetch('https://lugh-mobile-backend-v1.vercel.app/api/categories', { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch('https://lugh-mobile-backend-v1.vercel.app/api/wallets', { headers: { 'Authorization': `Bearer ${token}` } })
      ]);
      
      if (catRes.ok) setCategories(await catRes.json());
      if (wallRes.ok) {
        const allWallets = await wallRes.json();
        const filtered = allWallets.filter((w: any) => 
          w.name.toLowerCase().includes('cash') || w.name.toLowerCase().includes('qris')
        );
        
        // Jika hasil filter kosong, tampilkan semua dompet yang ada
        const finalWallets = filtered.length > 0 ? filtered : allWallets;
        setWallets(finalWallets);
        
        // Pilih dompet pertama secara otomatis
        if (finalWallets.length > 0) {
          setWalletId(finalWallets[0].id);
        }
      }
    } catch (err) {
      console.error('Failed to fetch data', err);
    }
  };

  const handleAddCategory = async () => {
    if (!newCategoryName) return;
    const token = localStorage.getItem('token');
    try {
      const response = await fetch('https://lugh-mobile-backend-v1.vercel.app/api/categories', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ name: newCategoryName, type, icon: 'tag' })
      });
      if (response.ok) {
        const newCat = await response.json();
        setCategories([...categories, newCat]);
        setCategoryId(newCat.id);
        setIsAddingCategory(false);
        setNewCategoryName('');
      }
    } catch (err) {
      alert('Gagal menambah kategori');
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
      } else {
        alert('Gagal mencatat transaksi.');
      }
    } catch (err) {
      alert('Koneksi bermasalah.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen bg-white flex flex-col safe-top overflow-y-auto">
      {/* Header */}
      <div className="flex items-center gap-4 px-6 py-4">
        <button onClick={onBack} className="p-2 rounded-2xl bg-slate-50 text-slate-600">
          <ArrowLeft size={20} />
        </button>
        <h2 className="text-xl font-black font-heading text-slate-900">Tambah Transaksi</h2>
      </div>

      <form onSubmit={handleSubmit} className="flex-1 px-6 pt-4 pb-12 space-y-8">
        {/* Type Switcher */}
        <div className="flex p-1.5 bg-slate-50 rounded-[2rem] gap-1 shadow-inner">
          <button 
            type="button"
            onClick={() => setType('expense')}
            className={`flex-1 py-4 rounded-[1.5rem] font-bold text-sm transition-all ${type === 'expense' ? 'bg-white text-rose-600 shadow-sm' : 'text-slate-400'}`}
          >
            Pengeluaran
          </button>
          <button 
            type="button"
            onClick={() => setType('income')}
            className={`flex-1 py-4 rounded-[1.5rem] font-bold text-sm transition-all ${type === 'income' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-400'}`}
          >
            Pemasukan
          </button>
        </div>

        {/* Amount Input */}
        <div className="space-y-3">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Jumlah Uang</label>
          <div className="relative">
            <div className={`absolute left-0 top-1/2 -translate-y-1/2 font-black text-3xl transition-colors ${type === 'income' ? 'text-emerald-500' : 'text-rose-500'}`}>Rp</div>
            <input 
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full bg-transparent border-b-2 border-slate-100 py-6 pl-14 pr-4 text-4xl font-black text-slate-900 focus:outline-none focus:border-primary transition-all"
              placeholder="0"
              required
            />
          </div>
        </div>

        {/* Category Selection */}
        <div className="space-y-3">
          <div className="flex justify-between items-center px-1">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Kategori</label>
            <button 
              type="button"
              onClick={() => setIsAddingCategory(!isAddingCategory)}
              className="text-xs font-bold text-primary flex items-center gap-1"
            >
              <PlusCircle size={14} />
              Tambah Baru
            </button>
          </div>

          {isAddingCategory ? (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex gap-2"
            >
              <input 
                type="text"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                className="flex-1 bg-slate-50 border-none rounded-2xl py-4 px-4 text-sm font-bold text-slate-900 focus:ring-4 focus:ring-primary/10"
                placeholder="Nama kategori baru..."
              />
              <button 
                type="button"
                onClick={handleAddCategory}
                className="bg-primary text-white px-6 rounded-2xl font-bold text-sm"
              >
                Simpan
              </button>
            </motion.div>
          ) : (
            <div className="relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors">
                <Tag size={20} />
              </div>
              <select 
                value={categoryId}
                onChange={(e) => setCategoryId(parseInt(e.target.value))}
                className="w-full bg-slate-50 border-none rounded-3xl py-5 pl-12 pr-4 text-sm font-bold text-slate-900 focus:ring-4 focus:ring-primary/10 transition-all appearance-none"
              >
                <option value={0}>Pilih Kategori</option>
                {categories.filter(c => c.type === type).map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Wallet Selection */}
        <div className="space-y-3">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Metode Pembayaran</label>
          <div className="grid grid-cols-2 gap-4">
            {wallets.length === 0 ? (
              <p className="col-span-2 text-xs font-medium text-rose-400 p-4 bg-rose-50 rounded-2xl">
                Belum ada Dompet di database. Buat "Cash" & "QRIS" di backend.
              </p>
            ) : (
              wallets.map(w => (
                <button
                  key={w.id}
                  type="button"
                  onClick={() => setWalletId(w.id)}
                  className={`py-5 rounded-3xl border-2 flex flex-col items-center gap-2 transition-all ${walletId === w.id ? 'border-primary bg-primary/5 text-primary' : 'border-slate-50 bg-slate-50 text-slate-400'}`}
                >
                  <Wallet size={24} />
                  <span className="text-sm font-black uppercase tracking-widest">{w.name}</span>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Description */}
        <div className="space-y-3">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Keterangan</label>
          <div className="relative group">
            <div className="absolute left-4 top-5 text-slate-400 group-focus-within:text-primary transition-colors">
              <AlignLeft size={20} />
            </div>
            <textarea 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-slate-50 border-none rounded-3xl py-4 pl-12 pr-4 text-sm font-medium text-slate-900 focus:ring-4 focus:ring-primary/10 transition-all h-28"
              placeholder="Misal: Beli daging ayam untuk stok 3 hari..."
              required
            />
          </div>
        </div>

        <button 
          type="submit"
          disabled={loading}
          className={`w-full py-6 rounded-[2rem] font-bold text-xl flex items-center justify-center gap-3 shadow-2xl transition-all active:scale-95 mt-8 ${type === 'income' ? 'gradient-primary shadow-emerald-200' : 'bg-rose-500 text-white shadow-rose-200'} disabled:opacity-70`}
        >
          {loading ? 'Menyimpan...' : `Simpan ${type === 'income' ? 'Pemasukan' : 'Pengeluaran'}`}
          {!loading && <Plus size={24} />}
        </button>
      </form>
    </div>
  );
};
