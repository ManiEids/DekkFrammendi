'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useDekkja, useSkrapa } from '../hooks/useDekkjaApi';
import { DekkFilter, Dekk } from '../types';
import DekkjaKort from '../components/DekkjaKort';
import DekkjaFilter from '../components/DekkjaFilter';
import Link from 'next/link';
import { FaArrowLeft, FaSyncAlt } from 'react-icons/fa';

export default function DekkjaListi() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [filter, setFilter] = useState<DekkFilter>({});
  const [selectedDekk, setSelectedDekk] = useState<Dekk[]>([]);
  
  // Get query params
  useEffect(() => {
    const breidd = searchParams.get('breidd');
    const haed = searchParams.get('haed');
    const felga = searchParams.get('felga');
    
    const newFilter: DekkFilter = {};
    if (breidd) newFilter.breidd = parseInt(breidd);
    if (haed) newFilter.haed = parseInt(haed);
    if (felga) newFilter.felga = parseInt(felga);
    
    setFilter(newFilter);
  }, [searchParams]);
  
  const { data: dekk, isLoading, isError } = useDekkja(filter);
  const { mutate: skrapa, isLoading: isSkraping } = useSkrapa();
  
  const handleFilterChange = (newFilter: DekkFilter) => {
    setFilter({ ...filter, ...newFilter });
  };
  
  const handleClearFilters = () => {
    // Keep only initial search parameters from URL
    const initialFilter: DekkFilter = {};
    const breidd = searchParams.get('breidd');
    const haed = searchParams.get('haed');
    const felga = searchParams.get('felga');
    
    if (breidd) initialFilter.breidd = parseInt(breidd);
    if (haed) initialFilter.haed = parseInt(haed);
    if (felga) initialFilter.felga = parseInt(felga);
    
    setFilter(initialFilter);
  };
  
  const handleToggleToSamanburdur = (item: Dekk) => {
    if (selectedDekk.some(d => d.id === item.id)) {
      setSelectedDekk(selectedDekk.filter(d => d.id !== item.id));
    } else {
      if (selectedDekk.length < 4) {
        setSelectedDekk([...selectedDekk, item]);
      } else {
        alert('Þú getur aðeins borið saman 4 dekk í einu!');
      }
    }
  };
  
  const handleSkrapa = () => {
    // Need at least one dimension to scrape
    if (filter.breidd || filter.haed || filter.felga) {
      skrapa({ 
        breidd: filter.breidd || 0, 
        haed: filter.haed || 0, 
        felga: filter.felga || 0
      });
      alert('Skrapaverkefni hafið! Þetta getur tekið nokkrar mínútur.');
    } else {
      alert('Þú þarft að velja að minnsta kosti eina stærð til að skrapa!');
    }
  };
  
  const startSamanburdur = () => {
    if (selectedDekk.length > 1) {
      const ids = selectedDekk.map(d => d.id).join(',');
      router.push(`/samanburdur?ids=${ids}`);
    }
  };

  // Create title based on available filter dimensions
  const createSizeTitle = () => {
    if (!filter.breidd && !filter.haed && !filter.felga) {
      return "Öll dekk";
    }
    
    const parts = [];
    if (filter.breidd) parts.push(`${filter.breidd}`);
    else parts.push("x");
    
    if (filter.haed) parts.push(`${filter.haed}`);
    else parts.push("x");
    
    if (filter.felga) parts.push(`R${filter.felga}`);
    else parts.push("Rx");
    
    return `Dekk í stærðinni ${parts.join("/")}`;
  };

  // Format pricing info for display
  const formatPriceInfo = () => {
    if (!dekk || dekk.length === 0) return "";
    
    const pricesWithValues = dekk.filter(d => d.verd !== null).map(d => d.verd as number);
    
    if (pricesWithValues.length === 0) return "";
    
    const lowest = Math.min(...pricesWithValues);
    const highest = Math.max(...pricesWithValues);
    const formatter = new Intl.NumberFormat('is-IS');
    
    return `Verð frá ${formatter.format(lowest)} kr. til ${formatter.format(highest)} kr.`;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <Link href="/" className="flex items-center text-blue-600 hover:underline">
          <FaArrowLeft className="mr-2" /> Til baka
        </Link>
        <h1 className="text-2xl font-bold text-center">
          {createSizeTitle()}
        </h1>
      </div>

      <div className="mb-6">
        <button 
          className="flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded w-full md:w-auto"
          onClick={handleSkrapa}
          disabled={isSkraping || (!filter.breidd && !filter.haed && !filter.felga)}
        >
          <FaSyncAlt className={`mr-2 ${isSkraping ? 'animate-spin' : ''}`} />
          {isSkraping ? 'Skrapar...' : 'Skrapa nýjustu gögn'}
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Filter panel */}
        <div className="w-full lg:w-64">
          <DekkjaFilter 
            filter={filter}
            onFilterChange={handleFilterChange}
            onClearFilters={handleClearFilters}
          />
        </div>

        {/* Results area */}
        <div className="flex-1">
          {/* Selected items counter */}
          {selectedDekk.length > 0 && (
            <div className="flex items-center justify-between bg-blue-50 p-4 rounded-lg mb-4">
              <div>
                <span className="font-semibold">{selectedDekk.length} dekk valin</span>
                <p className="text-sm text-gray-600">Veldu að minnsta kosti 2 dekk til að bera saman</p>
              </div>
              <button
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                disabled={selectedDekk.length < 2}
                onClick={startSamanburdur}
              >
                Bera saman
              </button>
            </div>
          )}

          {/* Loading state */}
          {isLoading && (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          )}

          {/* Error state */}
          {isError && (
            <div className="bg-red-50 p-4 rounded-lg text-red-700">
              <p>Villa kom upp við að sækja gögn. Vinsamlegast reyndu aftur síðar.</p>
            </div>
          )}

          {/* Empty state */}
          {!isLoading && !isError && dekk?.length === 0 && (
            <div className="bg-yellow-50 p-6 rounded-lg text-center">
              <p className="text-lg mb-4">Engin dekk fundust sem passa við þessar síur.</p>
              <button
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                onClick={handleSkrapa}
                disabled={!filter.breidd && !filter.haed && !filter.felga}
              >
                Skrapa nýjustu gögn
              </button>
            </div>
          )}

          {/* Results grid */}
          {!isLoading && !isError && dekk && dekk.length > 0 && (
            <div>
              <div className="mb-4 flex flex-col md:flex-row md:items-center justify-between">
                <p className="text-gray-600">{dekk.length} dekk fundust</p>
                {formatPriceInfo() && (
                  <p className="text-gray-600 mt-1 md:mt-0">{formatPriceInfo()}</p>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {dekk.map((item) => (
                  <DekkjaKort
                    key={item.id}
                    dekk={item}
                    onAddToSamanburdur={() => handleToggleToSamanburdur(item)}
                    isSelected={selectedDekk.some(d => d.id === item.id)}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
