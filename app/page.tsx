'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useDekkja } from './hooks/useDekkjaApi';
import { DekkFilter } from './types';
import DekkjaFilter from './components/DekkjaFilter';
import Link from 'next/link';
import { FaSearch, FaArrowLeft } from 'react-icons/fa';

export default function Forsida() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [filter, setFilter] = useState<DekkFilter>({});
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [totalTires, setTotalTires] = useState<number>(0);
  const [updateMessage, setUpdateMessage] = useState('');
  
  // Fetch last update info from internal API
  useEffect(() => {
    fetch('/api/lastUpdated')
      .then((res) => res.json())
      .then((data) => {
        if (data.lastUpdate) {
          const dt = new Date(data.lastUpdate);
          setLastUpdate(dt);
          setTotalTires(Number(data.count) || 0);
          const diffMs = new Date().getTime() - dt.getTime();
          const diffDays = diffMs / (1000 * 60 * 60 * 24);
          if (diffDays >= 1) {
            setUpdateMessage("Mæli með að keyra scrapy spiders aftur. Dagur+ síðan seinast");
          }
        }
      })
      .catch((err) => console.error("Error fetching last update:", err));
  }, []);

  // Populate initial filter from URL if present.
  useEffect(() => {
    const width = searchParams.get('width');
    const aspect_ratio = searchParams.get('aspect_ratio');
    const rim_size = searchParams.get('rim_size');
    const newFilter: DekkFilter = {};
    if (width) newFilter.width = parseInt(width);
    if (aspect_ratio) newFilter.aspect_ratio = parseInt(aspect_ratio);
    if (rim_size) newFilter.rim_size = parseInt(rim_size);
    setFilter(newFilter);
  }, [searchParams]);

  const { data: dekk, isLoading, isError } = useDekkja(filter);

  const handleFilterChange = (newFilter: DekkFilter) => {
    setFilter({ ...filter, ...newFilter });
  };

  const handleClearFilters = () => {
    setFilter({});
  };

  const handleLeit = () => {
    const params = new URLSearchParams();
    if (filter.width) params.append('width', filter.width.toString());
    if (filter.aspect_ratio) params.append('aspect_ratio', filter.aspect_ratio.toString());
    if (filter.rim_size) params.append('rim_size', filter.rim_size.toString());
    router.push(`/dekk?${params.toString()}`);
  };

  // Format last update date in Icelandic format
  const formatLastUpdate = (date: Date) => {
    return date.toLocaleString('is-IS');
  };

  return (
    <div className="container mx-auto px-4 py-8 space-bg">
      <div className="flex justify-between mb-8">
        <Link href="/" className="flex items-center text-white hover:text-accent-color">
          <FaArrowLeft className="mr-2" /> Forsíða
        </Link>
      </div>

      <h1 className="text-3xl font-bold mb-8 text-center text-white">
        Finndu bestu dekkin
      </h1>
      
      {/* Updated search form container with improved contrast */}
      <div className="mb-8 max-w-lg mx-auto">
        <DekkjaFilter 
          filter={filter} 
          onFilterChange={handleFilterChange} 
          onClearFilters={handleClearFilters}
        />
        
        <div className="mt-6 text-center">
          <button 
            onClick={handleLeit}
            disabled={!filter.width && !filter.aspect_ratio && !filter.rim_size}
            className="btn-primary w-full"
          >
            <FaSearch className="mr-2 inline-block" /> Leita að dekkjum
          </button>
        </div>
      </div>
      
      {/* Display results status with improved visibility */}
      {isLoading && <div className="mt-6 text-center text-white">Hleður gögnum…</div>}
      {isError && <div className="mt-6 text-center text-error">Villa við að sækja gögn.</div>}
      {dekk && dekk.length === 0 && !isLoading && <div className="mt-6 text-center text-warning">Engin dekk fundust.</div>}
      
      {/* Database last updated info - now at the bottom of the page */}
      <div className="mt-16 p-4 bg-black bg-opacity-30 rounded-lg text-center">
        {lastUpdate ? (
          <>
            <p className="text-white">
              <strong>Gagnagrunnur síðast uppfærður:</strong> {formatLastUpdate(lastUpdate)}
            </p>
            {totalTires > 0 && (
              <p className="mt-1 text-white">
                <strong>Total dekk:</strong> {totalTires.toLocaleString('is-IS')} 
                <span className="ml-2">{updateMessage ? "⚠️" : "✅"}</span>
              </p>
            )}
            {updateMessage && <p className="mt-1 text-orange-300">{updateMessage}</p>}
          </>
        ) : (
          <p className="text-yellow-300">Gögn um síðustu uppfærslu ekki tiltæk</p>
        )}
      </div>
    </div>
  );
}
