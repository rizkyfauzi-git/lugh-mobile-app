import React from 'react';
import { TransactionList } from '../components/TransactionList';

interface HistoryPageProps {
  activeFilter: string;
}

export const HistoryPage: React.FC<HistoryPageProps> = ({ activeFilter }) => {
  return (
    <div className="pt-2 pb-32">
      <TransactionList 
        showHeading={false} 
        isClickable={true} 
        filterCategory={activeFilter} 
      />
    </div>
  );
};
