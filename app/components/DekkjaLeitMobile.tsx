'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { DekkStaerd } from '../types';
import { WIDTHS, HEIGHTS, RIM_SIZES } from '../constants';

export default function DekkjaLeitMobile() {
  const router = useRouter();
  const [valinStaerd, setValinStaerd] = useState<DekkStaerd>({
    width: 0,
    aspect_ratio: 0,
    rim_size: 0
  });

  const handleSubmit = () => {
    const params = new URLSearchParams();
    if (valinStaerd.width > 0) params.append('width', valinStaerd.width.toString());
    if (valinStaerd.aspect_ratio > 0) params.append('aspect_ratio', valinStaerd.aspect_ratio.toString());
    if (valinStaerd.rim_size > 0) params.append('rim_size', valinStaerd.rim_size.toString());
    
    router.push(`/dekk?${params.toString()}`);
  };

  const hasSelection = valinStaerd.width > 0 || valinStaerd.aspect_ratio > 0 || valinStaerd.rim_size > 0;

  return (
    <div className="md:hidden">
      <div className="flex space-x-2 mb-4">
        <div className="flex-1">
          <label className="block text-xs mb-1">Breidd</label>
          <select 
            className="w-full py-1 px-2 border text-sm rounded"
            value={valinStaerd.width || ''}
            onChange={(e) => setValinStaerd({...valinStaerd, width: Number(e.target.value)})}
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
            value={valinStaerd.aspect_ratio || ''}
            onChange={(e) => setValinStaerd({...valinStaerd, aspect_ratio: Number(e.target.value)})}
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
            value={valinStaerd.rim_size || ''}
            onChange={(e) => setValinStaerd({...valinStaerd, rim_size: Number(e.target.value)})}
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
