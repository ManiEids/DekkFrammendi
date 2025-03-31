import { useState } from 'react';
import { DekkFilter } from '../types';
import { useStaerdir } from '../hooks/useDekkjaApi';
import { FaFilter, FaChevronDown, FaChevronUp, FaSortAmountDown, FaSortAmountUp } from 'react-icons/fa';

interface DekkjaFilterProps {
  filter: DekkFilter;
  onFilterChange: (newFilter: DekkFilter) => void;
  onClearFilters: () => void;
}

export default function DekkjaFilter({ 
  filter, 
  onFilterChange, 
  onClearFilters
}: DekkjaFilterProps) {
  const { data: staerdir, isLoading } = useStaerdir();
  const [isOpen, setIsOpen] = useState(true);

  // Fix TypeScript error by avoiding spread on Set
  const breiddir = staerdir 
    ? Array.from(new Set(staerdir.map(s => s.breidd))).sort((a, b) => a - b)
    : [];
  
  const haedir = staerdir
    ? Array.from(new Set(staerdir.map(s => s.haed))).sort((a, b) => a - b)
    : [];
  
  const felgur = staerdir
    ? Array.from(new Set(staerdir.map(s => s.felga))).sort((a, b) => a - b)
    : [];

  // Handle sorting change
  const handleSortChange = (sortOrder: 'asc' | 'desc' | undefined) => {
    if (!sortOrder) {
      onFilterChange({ sortBy: undefined, sortOrder: undefined });
    } else {
      onFilterChange({ sortBy: 'verd', sortOrder });
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <FaFilter className="mr-2 text-blue-600" />
          <h2 className="font-semibold">Dekkjaleit</h2>
        </div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="lg:hidden text-gray-500"
        >
          {isOpen ? <FaChevronUp /> : <FaChevronDown />}
        </button>
      </div>

      <div className={`${isOpen ? 'block' : 'hidden'} lg:block space-y-4`}>
        {/* Width filter */}
        <div>
          <label className="block text-sm font-medium mb-2">Breidd</label>
          <select
            className="w-full p-2 border rounded"
            value={filter.breidd || ''}
            onChange={(e) => onFilterChange({ breidd: e.target.value ? Number(e.target.value) : undefined })}
            disabled={isLoading}
          >
            <option value="">Öll breidd</option>
            {breiddir.map(b => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>
        </div>

        {/* Height filter */}
        <div>
          <label className="block text-sm font-medium mb-2">Hæð</label>
          <select
            className="w-full p-2 border rounded"
            value={filter.haed || ''}
            onChange={(e) => onFilterChange({ haed: e.target.value ? Number(e.target.value) : undefined })}
            disabled={isLoading}
          >
            <option value="">Öll hæð</option>
            {haedir.map(h => (
              <option key={h} value={h}>{h}</option>
            ))}
          </select>
        </div>

        {/* Rim filter */}
        <div>
          <label className="block text-sm font-medium mb-2">Felgustærð</label>
          <select
            className="w-full p-2 border rounded"
            value={filter.felga || ''}
            onChange={(e) => onFilterChange({ felga: e.target.value ? Number(e.target.value) : undefined })}
            disabled={isLoading}
          >
            <option value="">Allar felgustærðir</option>
            {felgur.map(f => (
              <option key={f} value={f}>{f}</option>
            ))}
          </select>
        </div>

        {/* In stock filter */}
        <div className="flex items-center">
          <input
            type="checkbox"
            id="inStock"
            className="mr-2"
            checked={filter.adeinsALager || false}
            onChange={(e) => onFilterChange({ adeinsALager: e.target.checked })}
          />
          <label htmlFor="inStock">Aðeins á lager</label>
        </div>
        
        {/* Sort by price */}
        <div>
          <label className="block text-sm font-medium mb-2">Raða eftir verði</label>
          <div className="flex gap-2">
            <button 
              className={`flex-1 p-2 border rounded flex items-center justify-center ${
                filter.sortBy === 'verd' && filter.sortOrder === 'asc' 
                  ? 'bg-blue-100 border-blue-500' : 'hover:bg-gray-100'
              }`}
              onClick={() => handleSortChange(filter.sortBy === 'verd' && filter.sortOrder === 'asc' ? undefined : 'asc')}
            >
              <FaSortAmountUp className="mr-1" /> Lægsta verð
            </button>
            <button 
              className={`flex-1 p-2 border rounded flex items-center justify-center ${
                filter.sortBy === 'verd' && filter.sortOrder === 'desc' 
                  ? 'bg-blue-100 border-blue-500' : 'hover:bg-gray-100'
              }`}
              onClick={() => handleSortChange(filter.sortBy === 'verd' && filter.sortOrder === 'desc' ? undefined : 'desc')}
            >
              <FaSortAmountDown className="mr-1" /> Hæsta verð
            </button>
          </div>
        </div>

        {/* Clear filters button */}
        <button
          className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded"
          onClick={onClearFilters}
        >
          Hreinsa síur
        </button>
      </div>
    </div>
  );
}
