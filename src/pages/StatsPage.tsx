import React from 'react';
import { BarChart, Bar, XAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const data = [
  { name: 'Mon', total: 4000 },
  { name: 'Tue', total: 3000 },
  { name: 'Wed', total: 2000 },
  { name: 'Thu', total: 2780 },
  { name: 'Fri', total: 1890 },
  { name: 'Sat', total: 2390 },
  { name: 'Sun', total: 3490 },
];

export const StatsPage: React.FC = () => {
  return (
    <div className="p-6 pt-12">
      <h2 className="text-xl font-bold font-heading text-slate-900 mb-6">Financial Stats</h2>
      
      <div className="glass p-4 rounded-3xl mb-6 h-64">
        <h3 className="text-sm font-bold text-slate-500 mb-4">Weekly Revenue</h3>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} />
            <Tooltip 
              cursor={{ fill: 'transparent' }}
              contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
            />
            <Bar dataKey="total" radius={[4, 4, 0, 0]}>
              {data.map((_, index) => (
                <Cell key={`cell-${index}`} fill={index === 6 ? '#059669' : '#e2e8f0'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="glass p-4 rounded-3xl text-center">
          <p className="text-xs font-bold text-slate-400 mb-1">Average/Day</p>
          <p className="text-lg font-bold text-slate-900">Rp 1.2M</p>
        </div>
        <div className="glass p-4 rounded-3xl text-center">
          <p className="text-xs font-bold text-slate-400 mb-1">Total Sales</p>
          <p className="text-lg font-bold text-slate-900">124</p>
        </div>
      </div>
    </div>
  );
};
