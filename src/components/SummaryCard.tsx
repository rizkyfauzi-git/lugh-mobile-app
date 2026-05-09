import React from 'react';
import { ArrowUpRight, ArrowDownRight, Wallet } from 'lucide-react';
import { motion } from 'framer-motion';

interface SummaryCardProps {
  type: 'income' | 'expense' | 'balance';
  amount: number;
  label: string;
}

export const SummaryCard: React.FC<SummaryCardProps> = ({ type, amount, label }) => {
  const isBalance = type === 'balance';
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`p-4 sm:p-5 rounded-3xl w-full ${
        isBalance 
          ? 'gradient-primary text-white shadow-xl shadow-primary/20' 
          : 'glass'
      }`}
    >
      <div className="flex justify-between items-start mb-3 sm:mb-4">
        <div className={`p-1.5 sm:p-2 rounded-xl ${isBalance ? 'bg-white/20' : 'bg-slate-100'}`}>
          {type === 'income' && <ArrowUpRight className="text-emerald-500" size={18} />}
          {type === 'expense' && <ArrowDownRight className="text-rose-500" size={18} />}
          {type === 'balance' && <Wallet className="text-white" size={18} />}
        </div>
        {!isBalance && (
          <span className="text-[10px] sm:text-xs font-semibold text-slate-400 bg-slate-50/50 px-2 py-0.5 rounded-full">
            Month
          </span>
        )}
      </div>
      <div className="overflow-hidden">
        <p className={`text-[10px] sm:text-xs font-medium mb-0.5 sm:mb-1 truncate ${isBalance ? 'text-emerald-50/80' : 'text-slate-500'}`}>
          {label}
        </p>
        <h3 className={`text-lg sm:text-2xl font-bold font-heading truncate ${isBalance ? 'text-white' : 'text-slate-900'}`}>
          Rp {amount.toLocaleString('id-ID')}
        </h3>
      </div>
    </motion.div>
  );
};
