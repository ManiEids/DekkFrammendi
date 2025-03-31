'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { DekkStaerd } from '../types';
import { WIDTHS, HEIGHTS, RIM_SIZES } from '../constants';

export default function DekkjaLeitMobile() {
  const router = useRouter();
  const [valinStaerd, setValinStaerd] = useState<DekkStaerd>({
    breidd: 0,
    haed: 0,
    felga: 0
  });

  const handleSubmit = () => {
    const params = new URLSearchParams();
    if (valinStaerd.breidd > 0) params.append('breidd', valinStaerd.breidd.toString());
    if (valinStaerd.haed > 0) params.append('haed', valinStaerd.haed.toString());
    if (valinStaerd.felga > 0) params.append('felga', valinStaerd.felga.toString());
    
    router.push(`/dekk?${params.toString()}`);
  };

  const hasSelection = valinStaerd.breidd > 0 || valinStaerd.haed > 0 || valinStaerd.felga > 0;

  return (
    <div className="md:hidden">
      <div className="flex space-x-2 mb-4">
        <div className="flex-1">
          <label className="block text-xs mb-1">Breidd</label>
          <select 
            className="w-full py-1 px-2 border text-sm rounded"
            value={valinStaerd.breidd || ''}
            onChange={(e) => setValinStaerd({...valinStaerd, breidd: Number(e.target.value)})}
          >
            <option value="0">-</option>
            {WIDTHS.map(b => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>
        </div>
        <div className="flex-1">
          <label className="block text-xs mb-1">Hæð</label>
          <select 
            className="w-full py-1 px-2 border text-sm rounded"
            value={valinStaerd.haed || ''}
            onChange={(e) => setValinStaerd({...valinStaerd, haed: Number(e.target.value)})}
          >
            <option value="0">-</option>
            {HEIGHTS.map(h => (
              <option key={h} value={h}>{h}</option>
            ))}
          </select>
        </div>
        <div className="flex-1">
          <label className="block text-xs mb-1">Felga</label>
          <select 
            className="w-full py-1 px-2 border text-sm rounded"
            value={valinStaerd.felga || ''}
            onChange={(e) => setValinStaerd({...valinStaerd, felga: Number(e.target.value)})}
          >
            <option value="0">-</option>
            {RIM_SIZES.map(f => (
              <option key={f} value={f}>{f}</option>
            ))}
          </select>
        </div>
        <div className="flex items-end">
          <button 
            className={`h-[34px] py-1 px-3 rounded ${hasSelection ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'}`}
            disabled={!hasSelection}
            onClick={handleSubmit}
          >
            Leita
          </button>
        </div>
      </div>
    </div>
  );
}
