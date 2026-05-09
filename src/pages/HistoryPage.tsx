import React from 'react';
import { TransactionList } from '../components/TransactionList';

export const HistoryPage: React.FC = () => {
  return (
    <div className="pt-4 pb-32">
      <TransactionList />
    </div>
  );
};
