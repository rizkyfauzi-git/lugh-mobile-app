import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, TrendingUp, ShieldCheck, Zap } from 'lucide-react';
import logo from '../assets/logo.png';

interface LandingPageProps {
  onGetStarted: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted }) => {
  return (
    <div className="h-screen bg-slate-50 flex flex-col items-center justify-between p-8 safe-top">
      <div className="flex-1 flex flex-col items-center justify-center w-full max-w-sm">
        {/* Animated Logo */}
        <motion.div 
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="w-24 h-24 rounded-[2rem] overflow-hidden shadow-2xl shadow-emerald-200 border-4 border-white mb-8"
        >
          <img src={logo} alt="Lugh Finance" className="w-full h-full object-cover" />
        </motion.div>

        {/* Text Content */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center"
        >
          <h1 className="text-4xl font-black font-heading text-slate-900 mb-3 tracking-tight">
            Lugh <span className="text-primary">Finance</span>
          </h1>
          <p className="text-slate-500 font-medium leading-relaxed mb-10">
            Smart financial monitoring for your business. Track revenue, inventory, and growth in one place.
          </p>
        </motion.div>

        {/* Feature Highlights */}
        <div className="grid grid-cols-1 gap-4 w-full mb-10">
          {[
            { icon: TrendingUp, text: 'Real-time Stats', color: 'text-blue-500', bg: 'bg-blue-50' },
            { icon: ShieldCheck, text: 'Secure Monitoring', color: 'text-emerald-500', bg: 'bg-emerald-50' },
            { icon: Zap, text: 'Instant Updates', color: 'text-amber-500', bg: 'bg-amber-50' },
          ].map((item, idx) => (
            <motion.div 
              key={idx}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 + (idx * 0.1) }}
              className="flex items-center gap-4 p-4 rounded-2xl bg-white border border-slate-100 shadow-sm"
            >
              <div className={`p-2.5 rounded-xl ${item.bg} ${item.color}`}>
                <item.icon size={20} />
              </div>
              <span className="font-bold text-sm text-slate-700">{item.text}</span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Action Button */}
      <motion.button
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6 }}
        onClick={onGetStarted}
        className="w-full max-w-sm gradient-primary text-white py-5 rounded-[2rem] font-bold text-lg flex items-center justify-center gap-3 shadow-xl shadow-emerald-200 active:scale-95 transition-transform"
      >
        Get Started
        <ArrowRight size={22} />
      </motion.button>
    </div>
  );
};
