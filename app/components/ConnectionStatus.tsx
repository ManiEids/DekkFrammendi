'use client';

import { useEffect, useState } from 'react';
import { useApiHealth, useStaerdir } from '../hooks/useDekkjaApi';
import { FaExclamationTriangle } from 'react-icons/fa';

export default function ConnectionStatus() {
  const { data: isHealthy, isLoading: healthLoading, isError: healthError } = useApiHealth();
  const { data: sizes, isLoading: sizesLoading, isError: sizesError } = useStaerdir();
  const [isVisible, setIsVisible] = useState(true);
  const [backendStatus, setBackendStatus] = useState<'unknown' | 'connecting' | 'connected' | 'error'>('unknown');
  
  // Determine the overall connection status
  useEffect(() => {
    if (healthLoading || sizesLoading) {
      setBackendStatus('connecting');
    } else if (healthError && sizesError) {
      // Both endpoints failed
      setBackendStatus('error');
    } else if (sizes && sizes.length > 0) {
      // If we have sizes data, the connection is working
      setBackendStatus('connected');
    } else if (isHealthy) {
      // Health endpoint returns success but no data yet
      setBackendStatus('connected');
    } else {
      setBackendStatus('error');
    }
  }, [healthLoading, healthError, isHealthy, sizes, sizesLoading, sizesError]);

  // Auto-hide after 10 seconds if connection is good
  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (backendStatus === 'connected') {
      timer = setTimeout(() => {
        setIsVisible(false);
      }, 10000);
    } else {
      setIsVisible(true);
    }
    
    return () => clearTimeout(timer);
  }, [backendStatus]);

  const getStatusText = () => {
    switch (backendStatus) {
      case 'connecting':
        return 'Tengist vefþjónustu...';
      case 'connected':
        return 'Tengt við vefþjónustu';
      case 'error':
        return 'Ekki tengt við vefþjónustu';
      default:
        return 'Staða tengingar óþekkt';
    }
  };

  const getStatusColor = () => {
    switch (backendStatus) {
      case 'connecting':
        return 'bg-yellow-500';
      case 'connected':
        return 'bg-green-500';
      case 'error':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
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
    <div className="fixed bottom-4 left-4 p-3 bg-white rounded-md shadow-md z-50">
      <div className="flex items-center">
        <div className={`w-3 h-3 rounded-full mr-2 ${getStatusColor()}`}></div>
        <span className="text-sm">{getStatusText()}</span>
        <button 
          onClick={() => setIsVisible(false)}
          className="ml-3 text-gray-500 hover:text-gray-700 text-xs"
        >
          ✕
        </button>
      </div>
      
      {backendStatus === 'error' && (
        <div className="mt-2 text-xs text-red-600 flex items-center">
          <FaExclamationTriangle className="mr-1" />
          <span>Bakendi er í undirbúningi, prófaðu aftur síðar</span>
        </div>
      )}
    </div>
  );
}
