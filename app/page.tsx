'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useStaerdir } from './hooks/useDekkjaApi';
import { DekkStaerd } from './types';

export default function Forsida() {
  const router = useRouter();
  const { data: staerdir, isLoading } = useStaerdir();
  
  const [valinStaerd, setValinStaerd] = useState<DekkStaerd>({
    breidd: 0,
    haed: 0,
    felga: 0
  });

  const breiddir = staerdir 
    ? [...new Set(staerdir.map(s => s.breidd))].sort((a, b) => a - b)
    : [];
  
  const haedir = staerdir
    ? [...new Set(staerdir.map(s => s.haed))].sort((a, b) => a - b)
    : [];
  
  const felgur = staerdir
    ? [...new Set(staerdir.map(s => s.felga))].sort((a, b) => a - b)
    : [];

  const handleLeit = () => {
    // Create URL with only the specified parameters (ignore 0 values)
    const params = new URLSearchParams();
    if (valinStaerd.breidd > 0) params.append('breidd', valinStaerd.breidd.toString());
    if (valinStaerd.haed > 0) params.append('haed', valinStaerd.haed.toString());
    if (valinStaerd.felga > 0) params.append('felga', valinStaerd.felga.toString());
    
    router.push(`/dekk?${params.toString()}`);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold mb-6 text-center">Dekkjasafn</h1>
        <p className="mb-6 text-center">Finndu bestu dekkin á besta verðinu frá öllum helstu söluaðilum á Íslandi</p>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Breidd</label>
            <select 
              className="w-full p-2 border rounded"
              value={valinStaerd.breidd || ''}
              onChange={(e) => setValinStaerd({
                ...valinStaerd, 
                breidd: Number(e.target.value)
              })}
              disabled={isLoading}
            >
              <option value="0">Öll breidd</option>
              {breiddir.map(b => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Hæð</label>
            <select 
              className="w-full p-2 border rounded"
              value={valinStaerd.haed || ''}
              onChange={(e) => setValinStaerd({
                ...valinStaerd, 
                haed: Number(e.target.value)
              })}
              disabled={isLoading}
            >
              <option value="0">Öll hæð</option>
              {haedir.map(h => (
                <option key={h} value={h}>{h}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Felga</label>
            <select 
              className="w-full p-2 border rounded"
              value={valinStaerd.felga || ''}
              onChange={(e) => setValinStaerd({
                ...valinStaerd, 
                felga: Number(e.target.value)
              })}
              disabled={isLoading}
            >
              <option value="0">Öll felgustærð</option>
              {felgur.map(f => (
                <option key={f} value={f}>{f}</option>
              ))}
            </select>
          </div>
          
          <button 
            className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition disabled:opacity-50"
            disabled={(valinStaerd.breidd === 0 && valinStaerd.haed === 0 && valinStaerd.felga === 0) || isLoading}
            onClick={handleLeit}
          >
            {isLoading ? 'Hleður...' : 'Leita að dekkjum'}
          </button>
          <p className="text-xs text-gray-500 text-center">
            Þú getur leitað eftir hluta af dekkjastærð, t.d. bara hæð og felgustærð.
          </p>
        </div>
      </div>
    </main>
  );
}
