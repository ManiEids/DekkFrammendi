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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between mb-8">
        <Link href="/" className="flex items-center text-blue-600 hover:underline">
          <FaArrowLeft className="mr-2" /> Forsíða
        </Link>
      </div>
      
      <h1 className="text-3xl font-bold mb-6 text-center">Finndu bestu dekkin</h1>
      
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
