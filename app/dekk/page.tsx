'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useDekkja } from '../hooks/useDekkjaApi';
import { DekkFilter, Dekk } from '../types';
import DekkjaKort from '../components/DekkjaKort';
import DekkjaFilter from '../components/DekkjaFilter';
import Link from 'next/link';
import { FaArrowLeft } from 'react-icons/fa';

export default function DekkjaListi() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [filter, setFilter] = useState<DekkFilter>({});
  const [selectedDekk, setSelectedDekk] = useState<Dekk[]>([]);
  const [sortBy, setSortBy] = useState<"price" | "manufacturer" | "seller" | undefined>(undefined);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc" | undefined>(undefined);

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
    const initialFilter: DekkFilter = {};
    const width = searchParams.get('width');
    const aspect_ratio = searchParams.get('aspect_ratio');
    const rim_size = searchParams.get('rim_size');
    if (width) initialFilter.width = parseInt(width);
    if (aspect_ratio) initialFilter.aspect_ratio = parseInt(aspect_ratio);
    if (rim_size) initialFilter.rim_size = parseInt(rim_size);
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

  const startSamanburdur = () => {
    if (selectedDekk.length > 1) {
      const ids = selectedDekk.map(d => d.id).join(',');
      router.push(`/samanburdur?ids=${ids}`);
    }
  };

  const createSizeTitle = () => {
    if (!filter.width && !filter.aspect_ratio && !filter.rim_size) {
      return "Öll dekk";
    }

    const parts = [];
    if (filter.width) parts.push(`${filter.width}`);
    else parts.push("x");

    if (filter.aspect_ratio) parts.push(`${filter.aspect_ratio}`);
    else parts.push("x");

    if (filter.rim_size) parts.push(`R${filter.rim_size}`);
    else parts.push("Rx");

    return `Dekk í stærðinni ${parts.join("/")}`;
  };

  const formatPriceInfo = () => {
    if (!dekk || dekk.length === 0) return "";

    const pricesWithValues = dekk.filter(d => d.price !== null).map(d => d.price);
    if (pricesWithValues.length === 0) return "";
    const lowest = Math.min(...pricesWithValues);
    const highest = Math.max(...pricesWithValues);
    const formatter = new Intl.NumberFormat('is-IS', {
      style: 'currency',
      currency: 'ISK',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    });

    return `Verð frá ${formatter.format(lowest)} til ${formatter.format(highest)}`;
  };

  const handleLeit = () => {
    const params = new URLSearchParams();
    if (filter.width) params.append('width', filter.width.toString());
    if (filter.aspect_ratio) params.append('aspect_ratio', filter.aspect_ratio.toString());
    if (filter.rim_size) params.append('rim_size', filter.rim_size.toString());
    if (sortBy) params.append('sortBy', sortBy);
    if (sortOrder) params.append('sortOrder', sortOrder);
    router.push(`/dekk?${params.toString()}`);
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

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="w-full lg:w-64">
          <DekkjaFilter
            filter={filter}
            onFilterChange={handleFilterChange}
            onClearFilters={handleClearFilters}
          />
        </div>

        <div className="flex-1">
          <div className="mb-4 flex flex-col md:flex-row gap-4 items-start">
            <div>
              <label className="block text-sm font-medium mb-1">Raða eftir</label>
              <select
                className="w-full p-2 border rounded"
                value={sortBy ?? ""}
                onChange={(e) => setSortBy(e.target.value as "price" | "manufacturer" | "seller" || undefined)}
              >
                <option value="">Velja röðun...</option>
                <option value="price">Verð</option>
                <option value="manufacturer">Framleiðandi</option>
                <option value="seller">Seljandi</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Raðunar röð</label>
              <select
                className="w-full p-2 border rounded"
                value={sortOrder ?? ""}
                onChange={(e) => setSortOrder(e.target.value as "asc" | "desc" || undefined)}
              >
                <option value="">Velja röð...</option>
                <option value="asc">Eftir vaxandi</option>
                <option value="desc">Eftir lækkandi</option>
              </select>
            </div>
            <div className="flex items-end">
              <button
                className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition"
                onClick={handleLeit}
                disabled={!filter.width && !filter.aspect_ratio && !filter.rim_size}
              >
                Leita að dekkjum
              </button>
            </div>
          </div>

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

          {isLoading && (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          )}

          {isError && (
            <div className="bg-red-50 p-4 rounded-lg text-red-700">
              <p>Villa kom upp við að sækja gögn. Vinsamlegast reyndu aftur síðar.</p>
            </div>
          )}

          {!isLoading && !isError && dekk?.length === 0 && (
            <div className="bg-yellow-50 p-6 rounded-lg text-center">
              <p className="text-lg mb-4">Engin dekk fundust sem passa við þessar síur.</p>
            </div>
          )}

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
