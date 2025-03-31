import { useState } from 'react';
import { DekkFilter } from '../types';
import { useStaerdir } from '../hooks/useDekkjaApi';
import { FaFilter, FaChevronDown, FaChevronUp, FaSortAmountDown, FaSortAmountUp, FaTimes } from 'react-icons/fa';
import { WIDTHS, HEIGHTS, RIM_SIZES } from '../constants';

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

  // Get available widths - use API data if available, otherwise fallback to constants
  const breiddir = staerdir && staerdir.length > 0
    ? Array.from(new Set(staerdir.map(s => s.breidd))).sort((a, b) => a - b)
    : WIDTHS;
  
  // Get available heights - use API data if available, otherwise fallback to constants
  const haedir = staerdir && staerdir.length > 0
    ? Array.from(new Set(staerdir.map(s => s.haed))).sort((a, b) => a - b)
    : HEIGHTS;
  
  // Get available rim sizes - use API data if available, otherwise fallback to constants
  const felgur = staerdir && staerdir.length > 0
    ? Array.from(new Set(staerdir.map(s => s.felga))).sort((a, b) => a - b)
    : RIM_SIZES;

  // Handle sorting change
  const handleSortChange = (sortOrder: 'asc' | 'desc' | undefined) => {
    if (!sortOrder) {
      onFilterChange({ sortBy: undefined, sortOrder: undefined });
    } else {
      onFilterChange({ sortBy: 'verd', sortOrder });
    }
  };

  // Clear a specific dimension
  const clearDimension = (dimension: string) => {
    const newFilter = { ...filter };
    delete newFilter[dimension as keyof DekkFilter];
    onFilterChange(newFilter);
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
        <div className="border rounded-lg p-3">
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-medium">Breidd</label>
            {filter.breidd !== undefined && (
              <button
                onClick={() => clearDimension('breidd')}
                className="text-xs text-gray-500 hover:text-red-500 flex items-center"
              >
                Hreinsa <FaTimes className="ml-1" />
              </button>
            )}
          </div>
          {filter.breidd !== undefined ? (
            <div className="bg-blue-100 px-3 py-2 rounded-lg font-medium">
              {filter.breidd} mm
            </div>
          ) : (
            <select
              className="w-full p-2 border rounded"
              value=""
              onChange={(e) => onFilterChange({ breidd: e.target.value ? Number(e.target.value) : undefined })}
              disabled={isLoading}
            >
              <option value="">Allar breiddir</option>
              {breiddir.map(b => (
                <option key={b} value={b}>{b} mm</option>
              ))}
            </select>
          )}
        </div>

        {/* Height filter */}
        <div className="border rounded-lg p-3">
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-medium">Hæð</label>
            {filter.haed !== undefined && (
              <button
                onClick={() => clearDimension('haed')}
                className="text-xs text-gray-500 hover:text-red-500 flex items-center"
              >
                Hreinsa <FaTimes className="ml-1" />
              </button>
            )}
          </div>
          {filter.haed !== undefined ? (
            <div className="bg-blue-100 px-3 py-2 rounded-lg font-medium">
              {filter.haed}
            </div>
          ) : (
            <select
              className="w-full p-2 border rounded"
              value=""
              onChange={(e) => onFilterChange({ haed: e.target.value ? Number(e.target.value) : undefined })}
              disabled={isLoading}
            >
              <option value="">Allar hæðir</option>
              {haedir.map(h => (
                <option key={h} value={h}>{h}</option>
              ))}
            </select>
          )}
        </div>

        {/* Rim filter */}
        <div className="border rounded-lg p-3">
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-medium">Felgustærð</label>
            {filter.felga !== undefined && (
              <button
                onClick={() => clearDimension('felga')}
                className="text-xs text-gray-500 hover:text-red-500 flex items-center"
              >
                Hreinsa <FaTimes className="ml-1" />
              </button>
            )}
          </div>
          {filter.felga !== undefined ? (
            <div className="bg-blue-100 px-3 py-2 rounded-lg font-medium">
              R{filter.felga}
            </div>
          ) : (
            <select
              className="w-full p-2 border rounded"
              value=""
              onChange={(e) => onFilterChange({ felga: e.target.value ? Number(e.target.value) : undefined })}
              disabled={isLoading}
            >
              <option value="">Allar felgustærðir</option>
              {felgur.map(f => (
                <option key={f} value={f}>R{f}</option>
              ))}
            </select>
          )}
        </div>

        {/* In stock filter */}
        <div className="flex items-center p-2">
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
        <div className="p-3 border rounded-lg">
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
          Hreinsa allar síur
        </button>
      </div>
    </div>
  );
}
