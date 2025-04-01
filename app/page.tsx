'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useStaerdir, useLastUpdated } from './hooks/useDekkjaApi';
import { DekkStaerd } from './types';
import { WIDTHS, HEIGHTS, RIM_SIZES } from './constants';
import { FaSearch, FaTimes } from 'react-icons/fa';

export default function Forsida() {
  const router = useRouter();
  const { data: staerdir, isLoading } = useStaerdir();
  const { data: lastUpdated, isLoading: lastUpdatedLoading } = useLastUpdated();

  const [valinStaerd, setValinStaerd] = useState<DekkStaerd>({
    width: 0,
    aspect_ratio: 0,
    rim_size: 0
  });

  // Get available dimension arrays from API or constants
  const breiddir = staerdir?.length ? Array.from(new Set(staerdir.map(s => s.width))).sort((a, b) => a - b) : WIDTHS;
  const haedir = staerdir?.length ? Array.from(new Set(staerdir.map(s => s.aspect_ratio))).sort((a, b) => a - b) : HEIGHTS;
  const felgur = staerdir?.length ? Array.from(new Set(staerdir.map(s => s.rim_size))).sort((a, b) => a - b) : RIM_SIZES;

  // Clear a specific dimension
  const clearDimension = (dimension: keyof DekkStaerd) => {
    setValinStaerd({
      ...valinStaerd,
      [dimension]: 0
    });
  };

  const handleLeit = () => {
    // Create URL with only the specified parameters (ignore 0 values)
    const params = new URLSearchParams();
    if (valinStaerd.width > 0) params.append('width', valinStaerd.width.toString());
    if (valinStaerd.aspect_ratio > 0) params.append('aspect_ratio', valinStaerd.aspect_ratio.toString());
    if (valinStaerd.rim_size > 0) params.append('rim_size', valinStaerd.rim_size.toString());
    
    router.push(`/dekk?${params.toString()}`);
  };

  // Check if at least one dimension is selected
  const hasSelection = valinStaerd.width > 0 || valinStaerd.aspect_ratio > 0 || valinStaerd.rim_size > 0;

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh]">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold mb-6 text-center">Finndu bestu dekkin</h1>
        <div className="mb-4 text-center text-sm text-gray-600">
          {lastUpdatedLoading ? (
            <span>Uppfærsla í gangi...</span>
          ) : (
            <span>Gögnum síðast uppfærð: {new Date(lastUpdated).toLocaleString('is-IS')}</span>
          )}
        </div>
        <p className="mb-6 text-center">Bestu verðin frá öllum helstu söluaðilum á Íslandi</p>
        
        <div className="mb-6 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-700">
            <strong>Sveigjanleit:</strong> Þú getur leitað með einni, tveimur eða öllum stærðum. 
            Til dæmis getur þú leitað að öllum dekkjum í ákveðinni breidd eða á tiltekna felgustærð.
          </p>
        </div>

        <div className="space-y-6">
          {/* Width selection */}
          <div className="rounded-lg border p-3">
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium">Breidd</label>
              {valinStaerd.width > 0 && (
                <button 
                  onClick={() => clearDimension('width')} 
                  className="text-xs text-gray-500 hover:text-red-500 flex items-center"
                >
                  Hreinsa <FaTimes className="ml-1" />
                </button>
              )}
            </div>
            {valinStaerd.width === 0 ? (
              <div className="flex flex-wrap gap-2">
                {[185, 195, 205, 225].map(b => (
                  <button
                    key={b}
                    className="px-2 py-1 bg-gray-100 hover:bg-blue-100 rounded text-sm"
                    onClick={() => setValinStaerd({...valinStaerd, width: b})}
                  >
                    {b} mm
                  </button>
                ))}
                <select
                  className="flex-grow px-2 py-1 bg-gray-100 hover:bg-blue-100 rounded text-sm"
                  onChange={(e) => setValinStaerd({...valinStaerd, width: Number(e.target.value)})}
                  disabled={isLoading}
                >
                  <option value="0">Velja aðra breidd...</option>
                  {breiddir.map(b => (
                    <option key={b} value={b}>{b} mm</option>
                  ))}
                </select>
              </div>
            ) : (
              <div className="bg-blue-100 px-3 py-2 rounded-lg font-medium">
                {valinStaerd.width} mm
              </div>
            )}
          </div>

          {/* Height selection */}
          <div className="rounded-lg border p-3">
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium">Hæð</label>
              {valinStaerd.aspect_ratio > 0 && (
                <button 
                  onClick={() => clearDimension('aspect_ratio')} 
                  className="text-xs text-gray-500 hover:text-red-500 flex items-center"
                >
                  Hreinsa <FaTimes className="ml-1" />
                </button>
              )}
            </div>
            {valinStaerd.aspect_ratio === 0 ? (
              <div className="flex flex-wrap gap-2">
                {[45, 50, 55, 60, 65].map(h => (
                  <button
                    key={h}
                    className="px-2 py-1 bg-gray-100 hover:bg-blue-100 rounded text-sm"
                    onClick={() => setValinStaerd({...valinStaerd, aspect_ratio: h})}
                  >
                    {h}
                  </button>
                ))}
                <select
                  className="flex-grow px-2 py-1 bg-gray-100 hover:bg-blue-100 rounded text-sm"
                  onChange={(e) => setValinStaerd({...valinStaerd, aspect_ratio: Number(e.target.value)})}
                  disabled={isLoading}
                >
                  <option value="0">Velja aðra hæð...</option>
                  {haedir.map(h => (
                    <option key={h} value={h}>{h}</option>
                  ))}
                </select>
              </div>
            ) : (
              <div className="bg-blue-100 px-3 py-2 rounded-lg font-medium">
                {valinStaerd.aspect_ratio}
              </div>
            )}
          </div>

          {/* Rim size selection */}
          <div className="rounded-lg border p-3">
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium">Felgustærð</label>
              {valinStaerd.rim_size > 0 && (
                <button 
                  onClick={() => clearDimension('rim_size')} 
                  className="text-xs text-gray-500 hover:text-red-500 flex items-center"
                >
                  Hreinsa <FaTimes className="ml-1" />
                </button>
              )}
            </div>
            {valinStaerd.rim_size === 0 ? (
              <div className="flex flex-wrap gap-2">
                {[16, 17, 18, 19, 20].map(f => (
                  <button
                    key={f}
                    className="px-2 py-1 bg-gray-100 hover:bg-blue-100 rounded text-sm"
                    onClick={() => setValinStaerd({...valinStaerd, rim_size: f})}
                  >
                    R{f}
                  </button>
                ))}
                <select
                  className="flex-grow px-2 py-1 bg-gray-100 hover:bg-blue-100 rounded text-sm"
                  onChange={(e) => setValinStaerd({...valinStaerd, rim_size: Number(e.target.value)})}
                  disabled={isLoading}
                >
                  <option value="0">Velja aðra felgustærð...</option>
                  {felgur.map(f => (
                    <option key={f} value={f}>R{f}</option>
                  ))}
                </select>
              </div>
            ) : (
              <div className="bg-blue-100 px-3 py-2 rounded-lg font-medium">
                R{valinStaerd.rim_size}
              </div>
            )}
          </div>
          
          {/* Search summary */}
          {hasSelection && (
            <div className="p-3 rounded-lg bg-gray-50">
              <h3 className="font-medium mb-1">Leitarskilyrði:</h3>
              <div className="text-sm">
                <ul className="list-disc pl-5">
                  {valinStaerd.width > 0 && <li>Breidd: {valinStaerd.width} mm</li>}
                  {valinStaerd.aspect_ratio > 0 && <li>Hæð: {valinStaerd.aspect_ratio}</li>}
                  {valinStaerd.rim_size > 0 && <li>Felgustærð: R{valinStaerd.rim_size}</li>}
                </ul>
              </div>
            </div>
          )}
          
          <button 
            className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition flex items-center justify-center"
            disabled={!hasSelection}
            onClick={handleLeit}
          >
            <FaSearch className="mr-2" />
            Leita að dekkjum
          </button>
        </div>
      </div>
    </div>
  );
}
