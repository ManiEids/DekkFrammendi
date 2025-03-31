'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useStaerdir } from './hooks/useDekkjaApi';
import { DekkStaerd } from './types';
import { WIDTHS, HEIGHTS, RIM_SIZES } from './constants';
import { FaSearch, FaTimes } from 'react-icons/fa';

export default function Forsida() {
  const router = useRouter();
  const { data: staerdir, isLoading } = useStaerdir();
  
  const [valinStaerd, setValinStaerd] = useState<DekkStaerd>({
    breidd: 0,
    haed: 0,
    felga: 0
  });

  // Get available dimension arrays from API or constants
  const breiddir = staerdir?.length ? Array.from(new Set(staerdir.map(s => s.breidd))).sort((a, b) => a - b) : WIDTHS;
  const haedir = staerdir?.length ? Array.from(new Set(staerdir.map(s => s.haed))).sort((a, b) => a - b) : HEIGHTS;
  const felgur = staerdir?.length ? Array.from(new Set(staerdir.map(s => s.felga))).sort((a, b) => a - b) : RIM_SIZES;

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
    if (valinStaerd.breidd > 0) params.append('breidd', valinStaerd.breidd.toString());
    if (valinStaerd.haed > 0) params.append('haed', valinStaerd.haed.toString());
    if (valinStaerd.felga > 0) params.append('felga', valinStaerd.felga.toString());
    
    router.push(`/dekk?${params.toString()}`);
  };

  // Check if at least one dimension is selected
  const hasSelection = valinStaerd.breidd > 0 || valinStaerd.haed > 0 || valinStaerd.felga > 0;

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh]">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold mb-6 text-center">Finndu bestu dekkin</h1>
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
              {valinStaerd.breidd > 0 && (
                <button 
                  onClick={() => clearDimension('breidd')} 
                  className="text-xs text-gray-500 hover:text-red-500 flex items-center"
                >
                  Hreinsa <FaTimes className="ml-1" />
                </button>
              )}
            </div>
            {valinStaerd.breidd === 0 ? (
              <div className="flex flex-wrap gap-2">
                {[185, 195, 205, 225].map(b => (
                  <button
                    key={b}
                    className="px-2 py-1 bg-gray-100 hover:bg-blue-100 rounded text-sm"
                    onClick={() => setValinStaerd({...valinStaerd, breidd: b})}
                  >
                    {b} mm
                  </button>
                ))}
                <select
                  className="flex-grow px-2 py-1 bg-gray-100 hover:bg-blue-100 rounded text-sm"
                  onChange={(e) => setValinStaerd({...valinStaerd, breidd: Number(e.target.value)})}
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
                {valinStaerd.breidd} mm
              </div>
            )}
          </div>

          {/* Height selection */}
          <div className="rounded-lg border p-3">
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium">Hæð</label>
              {valinStaerd.haed > 0 && (
                <button 
                  onClick={() => clearDimension('haed')} 
                  className="text-xs text-gray-500 hover:text-red-500 flex items-center"
                >
                  Hreinsa <FaTimes className="ml-1" />
                </button>
              )}
            </div>
            {valinStaerd.haed === 0 ? (
              <div className="flex flex-wrap gap-2">
                {[45, 50, 55, 60, 65].map(h => (
                  <button
                    key={h}
                    className="px-2 py-1 bg-gray-100 hover:bg-blue-100 rounded text-sm"
                    onClick={() => setValinStaerd({...valinStaerd, haed: h})}
                  >
                    {h}
                  </button>
                ))}
                <select
                  className="flex-grow px-2 py-1 bg-gray-100 hover:bg-blue-100 rounded text-sm"
                  onChange={(e) => setValinStaerd({...valinStaerd, haed: Number(e.target.value)})}
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
                {valinStaerd.haed}
              </div>
            )}
          </div>

          {/* Rim size selection */}
          <div className="rounded-lg border p-3">
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium">Felgustærð</label>
              {valinStaerd.felga > 0 && (
                <button 
                  onClick={() => clearDimension('felga')} 
                  className="text-xs text-gray-500 hover:text-red-500 flex items-center"
                >
                  Hreinsa <FaTimes className="ml-1" />
                </button>
              )}
            </div>
            {valinStaerd.felga === 0 ? (
              <div className="flex flex-wrap gap-2">
                {[16, 17, 18, 19, 20].map(f => (
                  <button
                    key={f}
                    className="px-2 py-1 bg-gray-100 hover:bg-blue-100 rounded text-sm"
                    onClick={() => setValinStaerd({...valinStaerd, felga: f})}
                  >
                    R{f}
                  </button>
                ))}
                <select
                  className="flex-grow px-2 py-1 bg-gray-100 hover:bg-blue-100 rounded text-sm"
                  onChange={(e) => setValinStaerd({...valinStaerd, felga: Number(e.target.value)})}
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
                R{valinStaerd.felga}
              </div>
            )}
          </div>
          
          {/* Search summary */}
          {hasSelection && (
            <div className="p-3 rounded-lg bg-gray-50">
              <h3 className="font-medium mb-1">Leitarskilyrði:</h3>
              <div className="text-sm">
                <ul className="list-disc pl-5">
                  {valinStaerd.breidd > 0 && <li>Breidd: {valinStaerd.breidd} mm</li>}
                  {valinStaerd.haed > 0 && <li>Hæð: {valinStaerd.haed}</li>}
                  {valinStaerd.felga > 0 && <li>Felgustærð: R{valinStaerd.felga}</li>}
                </ul>
              </div>
            </div>
          )}
          
          <button 
            className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 flex items-center justify-center"
            disabled={!hasSelection || isLoading}
            onClick={handleLeit}
          >
            <FaSearch className="mr-2" />
            {isLoading ? 'Hleður...' : 'Leita að dekkjum'}
          </button>
        </div>
      </div>
    </div>
  );
}
