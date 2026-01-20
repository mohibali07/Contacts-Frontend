import React from 'react';
import { useLocation } from 'react-router-dom';
import { Construction } from 'lucide-react';

const PlaceholderPage = () => {
  const location = useLocation();
  const title = location.pathname.split('/').pop().replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
        <Construction className="h-10 w-10 text-gray-400" />
      </div>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">{title} Module</h1>
      <p className="text-gray-500 max-w-md">
        This module is currently under development. Features for {title} will appear here.
      </p>
    </div>
  );
};

export default PlaceholderPage;
