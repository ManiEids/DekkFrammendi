import { DekkFilter } from '../types';

interface DekkjaFilterProps {
  filter: DekkFilter;
  onFilterChange: (newFilter: DekkFilter) => void;
  onClearFilters?: () => void; // Added optional prop
}

export default function DekkjaFilter({ filter, onFilterChange, onClearFilters }: DekkjaFilterProps) {
  return (
    <div className="bg-white rounded-lg shadow p-4 space-y-4">
      {/* Breidd dropdown */}
      <div>
        <label className="block text-sm font-medium mb-1">Breidd</label>
        <select
          className="w-full p-2 border rounded"
          value={filter.width ?? ""}
          onChange={(e) => onFilterChange({ width: e.target.value ? Number(e.target.value) : undefined })}
        >
          <option value="">Velja aðra breidd...</option>
          <option value="185">185 mm</option>
          <option value="195">195 mm</option>
          <option value="205">205 mm</option>
          <option value="225">225 mm</option>
        </select>
      </div>
      {/* Hæð dropdown */}
      <div>
        <label className="block text-sm font-medium mb-1">Hæð</label>
        <select
          className="w-full p-2 border rounded"
          value={filter.aspect_ratio ?? ""}
          onChange={(e) => onFilterChange({ aspect_ratio: e.target.value ? Number(e.target.value) : undefined })}
        >
          <option value="">Velja aðra hæð...</option>
          <option value="45">45</option>
          <option value="50">50</option>
          <option value="55">55</option>
          <option value="60">60</option>
          <option value="65">65</option>
        </select>
      </div>
      {/* Felgustærð dropdown */}
      <div>
        <label className="block text-sm font-medium mb-1">Felgustærð</label>
        <select
          className="w-full p-2 border rounded"
          value={filter.rim_size ?? ""}
          onChange={(e) => onFilterChange({ rim_size: e.target.value ? Number(e.target.value) : undefined })}
        >
          <option value="">Velja aðra felgustærð...</option>
          <option value="16">R16</option>
          <option value="17">R17</option>
          <option value="18">R18</option>
          <option value="19">R19</option>
          <option value="20">R20</option>
        </select>
      </div>
      {/* Clear button */}
      {onClearFilters && (
        <div>
          <button onClick={onClearFilters} className="w-full py-2 px-4 rounded bg-gray-200 text-gray-700">
            Hreinsa síur
          </button>
        </div>
      )}
    </div>
  );
}
