'use client';

import { useEffect, useState } from 'react';
import { useApiHealth } from '../hooks/useDekkjaApi';

export default function ConnectionStatus() {
  const { data: isHealthy, isLoading, isError } = useApiHealth();
  const [isVisible, setIsVisible] = useState(true);

  // Auto-hide after 10 seconds if connection is good
  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (isHealthy && !isLoading && !isError) {
      timer = setTimeout(() => {
        setIsVisible(false);
      }, 10000);
    } else {
      setIsVisible(true);
    }
    
    return () => clearTimeout(timer);
  }, [isHealthy, isLoading, isError]);

  const getStatusText = () => {
    if (isLoading) return 'Athugar tengingu...';
    if (isError || !isHealthy) return 'Ekki tengt við vefþjónustu';
    return 'Tengt við vefþjónustu';
  };

  const getStatusColor = () => {
    if (isLoading) return 'bg-yellow-500';
    if (isError || !isHealthy) return 'bg-red-500';
    return 'bg-green-500';
  };

  if (!isVisible) {
    return (
      <button 
        onClick={() => setIsVisible(true)}
        className="fixed bottom-4 left-4 p-2 bg-gray-200 hover:bg-gray-300 rounded-md z-50 text-xs"
      >
        Sýna tengivísi
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 left-4 p-3 bg-white rounded-md shadow-md z-50 flex items-center">
      <div className={`w-3 h-3 rounded-full mr-2 ${getStatusColor()}`}></div>
      <span className="text-sm">{getStatusText()}</span>
      <button 
        onClick={() => setIsVisible(false)}
        className="ml-3 text-gray-500 hover:text-gray-700 text-xs"
      >
        ✕
      </button>
    </div>
  );
}
