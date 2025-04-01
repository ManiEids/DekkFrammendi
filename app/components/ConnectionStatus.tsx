'use client';

import { useEffect, useState } from 'react';
import { useDekkja, useStaerdir, useLastUpdated } from '../hooks/useDekkjaApi';
import { FaExclamationTriangle } from 'react-icons/fa';

export default function ConnectionStatus() {
  const { data: dekk, isLoading: dekkLoading, isError: dekkError } = useDekkja({});
  const { data: staerdir, isLoading: staerdirLoading } = useStaerdir();
  const { data: lastUpdated, isLoading: lastUpdatedLoading } = useLastUpdated();
  const [isVisible, setIsVisible] = useState(true);
  
  const hasData = (dekk && dekk.length > 0) || (staerdir && staerdir.length > 0);
  const isLoading = dekkLoading || staerdirLoading || lastUpdatedLoading;
  const hasError = dekkError && !hasData;
  
  let status: 'loading' | 'data' | 'error' = 'loading';
  if (hasData) status = 'data';
  else if (hasError && !isLoading) status = 'error';
  else status = 'loading';

  // Hide after 10 seconds if data is loaded
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (status === 'data') {
      timer = setTimeout(() => setIsVisible(false), 10000);
    }
    return () => clearTimeout(timer);
  }, [status]);

  const getStatusText = () => {
    switch (status) {
      case 'loading': return 'Sækir gögn...';
      case 'data': return lastUpdated?.count 
        ? `Gögn fundust um ${Number(lastUpdated.count).toLocaleString('is-IS')} dekk`
        : 'Gögn fundust';
      case 'error': return 'Engin gögn fundust';
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'loading': return 'bg-yellow-500';
      case 'data': return 'bg-green-500';
      case 'error': return 'bg-red-500';
    }
  };

  if (!isVisible) {
    return (
      <button 
        onClick={() => setIsVisible(true)}
        className="fixed bottom-4 left-4 p-2 bg-gray-700 hover:bg-gray-600 text-white rounded-md z-50 text-xs"
      >
        Sýna stöðu
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 left-4 p-3 bg-gray-800 text-white rounded-md shadow-md z-50">
      <div className="flex items-center">
        <div className={`w-3 h-3 rounded-full mr-2 ${getStatusColor()}`}></div>
        <span className="text-sm">{getStatusText()}</span>
        <button 
          onClick={() => setIsVisible(false)}
          className="ml-3 text-gray-300 hover:text-gray-100 text-xs"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
