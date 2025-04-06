import { DekkFilter } from '../types';
import { WIDTHS, HEIGHTS, RIM_SIZES } from '../constants';

interface DekkjaFilterProps {
  filter: DekkFilter;
  onFilterChange: (newFilter: DekkFilter) => void;
  onClearFilters?: () => void;
}

export default function DekkjaFilter({ filter, onFilterChange, onClearFilters }: DekkjaFilterProps) {
  return (
    <div className="search-container">
      {/* Breidd dropdown */}
      <div className="mb-3 sm:mb-4">
        <label className="form-label">Breidd</label>
        <select
          className="form-select text-base"
          value={filter.width ?? ""}
          onChange={(e) => onFilterChange({ width: e.target.value ? Number(e.target.value) : undefined })}
        >
          <option value="">Velja aðra breidd...</option>
          {WIDTHS.map((w) => (
            <option key={w} value={w}>
              {w} mm
            </option>
          ))}
        </select>
      </div>
      
      {/* Hæð dropdown */}
      <div className="mb-3 sm:mb-4">
        <label className="form-label">Hæð</label>
        <select
          className="form-select text-base"
          value={filter.aspect_ratio ?? ""}
          onChange={(e) => onFilterChange({ aspect_ratio: e.target.value ? Number(e.target.value) : undefined })}
        >
          <option value="">Velja aðra hæð...</option>
          {HEIGHTS.map((h) => (
            <option key={h} value={h}>
              {h}
            </option>
          ))}
        </select>
      </div>
      
      {/* Felgustærð dropdown */}
      <div className="mb-3 sm:mb-4">
        <label className="form-label">Felgustærð</label>
        <select
          className="form-select text-base"
          value={filter.rim_size ?? ""}
          onChange={(e) => onFilterChange({ rim_size: e.target.value ? Number(e.target.value) : undefined })}
        >
          <option value="">Velja aðra felgustærð...</option>
          {RIM_SIZES.map((f) => (
            <option key={f} value={f}>
              R{f}
            </option>
          ))}
        </select>
      </div>
      
      {/* Clear button */}
      {onClearFilters && (
        <div>
          <button 
            onClick={onClearFilters} 
            className="w-full py-2 px-4 rounded text-white bg-gray-600 hover:bg-gray-700 transition"
          >
            Hreinsa síur
          </button>
        </div>
      )}
    </div>
  );
}
