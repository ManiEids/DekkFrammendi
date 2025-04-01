import { DekkFilter } from '../types';
import { WIDTHS, HEIGHTS, RIM_SIZES } from '../constants';

interface DekkjaFilterProps {
  filter: DekkFilter;
  onFilterChange: (newFilter: DekkFilter) => void;
  onClearFilters?: () => void;
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
          {WIDTHS.map((w) => (
            <option key={w} value={w}>
              {w} mm
            </option>
          ))}
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
          {HEIGHTS.map((h) => (
            <option key={h} value={h}>
              {h}
            </option>
          ))}
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
          <button onClick={onClearFilters} className="w-full py-2 px-4 rounded bg-gray-200 text-gray-700">
            Hreinsa síur
          </button>
        </div>
      )}
    </div>
  );
}
