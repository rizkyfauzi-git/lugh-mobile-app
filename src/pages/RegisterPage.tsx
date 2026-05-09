import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Lock, UserPlus, ArrowLeft, Phone, CreditCard } from 'lucide-react';

interface RegisterPageProps {
  onBackToLogin: () => void;
  onRegisterSuccess: () => void;
}

export const RegisterPage: React.FC<RegisterPageProps> = ({ onBackToLogin, onRegisterSuccess }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('https://lugh-mobile-backend-v1.vercel.app/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          username, 
          email, 
          password,
          full_name: fullName,
          phone: phone
        })
      });

      const data = await response.json();

      if (response.ok) {
        alert('Registration successful! Please login.');
        onRegisterSuccess();
      } else {
        setError(data.message || 'Registration failed');
      }
    } catch (err) {
      setError('Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen bg-slate-50 flex flex-col p-8 safe-top overflow-y-auto">
      <button 
        onClick={onBackToLogin}
        className="flex items-center gap-2 text-slate-400 font-bold text-sm mb-8 hover:text-primary transition-colors"
      >
        <ArrowLeft size={20} />
        Back to Login
      </button>

      <div className="mb-10">
        <motion.h2 
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="text-3xl font-black font-heading text-slate-900 mb-2"
        >
          Create Account
        </motion.h2>
        <motion.p 
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-slate-500 font-medium"
        >
          Join Lugh Finance and start growing.
        </motion.p>
      </div>

      <motion.form 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        onSubmit={handleSubmit}
        className="space-y-6 pb-20"
      >
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
          <div className="relative group">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors">
              <CreditCard size={20} />
            </div>
            <input 
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full bg-white border border-slate-100 rounded-3xl py-4 pl-12 pr-4 text-slate-900 font-medium focus:outline-none focus:border-primary/30 focus:ring-4 focus:ring-primary/5 transition-all"
              placeholder="Rizky Fauzi"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Phone Number</label>
          <div className="relative group">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors">
              <Phone size={20} />
            </div>
            <input 
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full bg-white border border-slate-100 rounded-3xl py-4 pl-12 pr-4 text-slate-900 font-medium focus:outline-none focus:border-primary/30 focus:ring-4 focus:ring-primary/5 transition-all"
              placeholder="08123456789"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Username</label>
          <div className="relative group">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors">
              <User size={20} />
            </div>
            <input 
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-white border border-slate-100 rounded-3xl py-4 pl-12 pr-4 text-slate-900 font-medium focus:outline-none focus:border-primary/30 focus:ring-4 focus:ring-primary/5 transition-all"
              placeholder="rizkyfauzi"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
          <div className="relative group">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors">
              <Mail size={20} />
            </div>
            <input 
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-white border border-slate-100 rounded-3xl py-4 pl-12 pr-4 text-slate-900 font-medium focus:outline-none focus:border-primary/30 focus:ring-4 focus:ring-primary/5 transition-all"
              placeholder="name@example.com"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Password</label>
          <div className="relative group">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors">
              <Lock size={20} />
            </div>
            <input 
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-white border border-slate-100 rounded-3xl py-4 pl-12 pr-4 text-slate-900 font-medium focus:outline-none focus:border-primary/30 focus:ring-4 focus:ring-primary/5 transition-all"
              placeholder="••••••••"
              required
            />
          </div>
        </div>

        {error && (
          <div className="p-3 rounded-2xl bg-red-50 border border-red-100 text-red-600 text-xs font-bold text-center">
            {error}
          </div>
        )}

        <button 
          type="submit"
          disabled={loading}
          className="w-full gradient-primary text-white py-5 rounded-[2rem] font-bold text-lg flex items-center justify-center gap-3 shadow-xl shadow-emerald-200 active:scale-95 transition-transform mt-8 disabled:opacity-70"
        >
          {loading ? 'Processing...' : 'Create Account'}
          {!loading && <UserPlus size={20} />}
        </button>
      </motion.form>
    </div>
  );
};
