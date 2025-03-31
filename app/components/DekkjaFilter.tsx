import { useState } from 'react';
import { DekkFilter } from '../types';
import { useStaerdir } from '../hooks/useDekkjaApi';
import { FaFilter, FaChevronDown, FaChevronUp } from 'react-icons/fa';

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

  const breiddir = staerdir 
    ? [...new Set(staerdir.map(s => s.breidd))].sort((a, b) => a - b)
    : [];
  
  const haedir = staerdir
    ? [...new Set(staerdir.map(s => s.haed))].sort((a, b) => a - b)
    : [];
  
  const felgur = staerdir
    ? [...new Set(staerdir.map(s => s.felga))].sort((a, b) => a - b)
    : [];

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
