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
  const [lastSeedCount, setLastSeedCount] = useState<number | null>(null);
  const [updateMessage, setUpdateMessage] = useState('');

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

  // Fetch last update info from internal API, including tire count
  useEffect(() => {
    fetch('/api/lastUpdated')
      .then((res) => res.json())
      .then((data) => {
        if (data.lastUpdate) {
          const dt = new Date(data.lastUpdate);
          setLastUpdate(dt);
          if (data.count) setLastSeedCount(Number(data.count));
          const diffMs = new Date().getTime() - dt.getTime();
          const diffDays = diffMs / (1000 * 60 * 60 * 24);
          if (diffDays >= 1) {
            setUpdateMessage("Mæli með að keyra scrapy spiders aftur. Dagur+ síðan seinast");
          }
        }
      })
      .catch((err) => console.error("Error fetching last update:", err));
  }, []);

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
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between mb-8">
        <Link href="/" className="flex items-center text-blue-600 hover:underline">
          <FaArrowLeft className="mr-2" /> Forsíða
        </Link>
      </div>

      <h1 className="text-3xl font-bold mb-6 text-center">Finndu bestu dekkin</h1>
      
      {/* Last updated info and tire count */}
      {lastUpdate && (
        <div className="mb-4 text-center text-sm text-gray-700">
          <p>
            <strong>Gagnagrunnur síðast uppfærður:</strong> {formatLastUpdate(lastUpdate)}
          </p>
          {lastSeedCount !== null && (
            <p className="mt-1">
              <strong>Total dekk:</strong> {lastSeedCount}
            </p>
          )}
          {updateMessage && <p className="mt-1 text-red-600">{updateMessage}</p>}
        </div>
      )}

      {/* Search form using dropdown filters */}
      <DekkjaFilter 
        filter={filter} 
        onFilterChange={handleFilterChange} 
        onClearFilters={handleClearFilters}
      />
      
      <div className="mt-6 text-center">
        <button 
          onClick={handleLeit}
          disabled={!filter.width && !filter.aspect_ratio && !filter.rim_size}
          className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition"
        >
          <FaSearch className="mr-2 inline-block" /> Leita að dekkjum
        </button>
      </div>
      
      {/* Display results status (optional) */}
      {isLoading && <div className="mt-6 text-center">Hleður gögnum…</div>}
      {isError && <div className="mt-6 text-center text-red-600">Villa við að sækja gögn.</div>}
      {dekk && dekk.length === 0 && !isLoading && <div className="mt-6 text-center">Engin dekk fundust.</div>}
    </div>
  );
}
