'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { FaArrowLeft, FaTimes, FaCar } from 'react-icons/fa';
import { fetchDekk } from '../lib/api';
import { Dekk } from '../types';

export default function Samanburdur() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [dekk, setDekk] = useState<Dekk[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const ids = searchParams.get('ids');
    if (!ids) {
      setError('Engin dekk valin til samanburðar');
      setIsLoading(false);
      return;
    }

    const fetchSelectedDekk = async () => {
      try {
        const idArray = ids.split(',').map(Number);
        // Fetch each tire individually
        const promises = idArray.map(id => fetchDekk({ id }));
        const results = await Promise.all(promises);
        // Flatten the results as fetchDekk returns an array
        const allDekk = results.flatMap(result => result);
        setDekk(allDekk);
      } catch (err) {
        setError('Villa kom upp við að sækja dekk');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSelectedDekk();
  }, [searchParams]);

  const formatPrice = (price: number | null) => {
    if (!price) return 'Verð óþekkt';
    return `${price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")} kr`;
  };

  const getStockStatus = (status: string | null, count: number | null) => {
    if (!status) return 'Birgðastaða óþekkt';
    if (status.toLowerCase().includes('in stock') || status.toLowerCase().includes('til í')) {
      return 'Á lager' + (count ? `: ${count} stk` : '');
    }
    return 'Ekki á lager';
  };

  const removeDekk = (id: number) => {
    const newDekk = dekk.filter(d => d.id !== id);
    if (newDekk.length < 2) {
      // If less than 2 tires remain, go back to the listing page
      router.back();
    } else {
      setDekk(newDekk);
      const newIds = newDekk.map(d => d.id).join(',');
      router.replace(`/samanburdur?ids=${newIds}`);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || dekk.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 p-6 rounded-lg text-center">
          <p className="text-lg mb-4">{error || 'Engin dekk valin til samanburðar'}</p>
          <Link href="/dekk" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded inline-block">
            Aftur í dekkjaleit
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Link href="/dekk" className="flex items-center text-blue-600 hover:underline">
          <FaArrowLeft className="mr-2" /> Til baka í dekkjaleit
        </Link>
        <h1 className="text-2xl font-bold mt-4">Samanburður á dekkjum</h1>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="p-4 bg-gray-100 text-left font-semibold border-b"></th>
              {dekk.map(d => (
                <th key={d.id} className="p-4 bg-gray-100 text-center border-b min-w-[250px]">
                  <div className="relative">
                    <button 
                      onClick={() => removeDekk(d.id)}
                      className="absolute top-0 right-0 p-1 text-gray-500 hover:text-red-500"
                      aria-label="Fjarlægja"
                    >
                      <FaTimes />
                    </button>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {/* Image row */}
            <tr>
              <td className="p-4 border-b font-semibold">Mynd</td>
              {dekk.map(d => (
                <td key={d.id} className="p-4 border-b text-center">
                  <div className="relative h-40 w-full">
                    {d.mynd_url ? (
                      <Image
                        src={d.mynd_url}
                        alt={d.titill}
                        fill
                        className="object-contain"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                    ) : (
                      <div className="h-full flex items-center justify-center bg-gray-100">
                        <FaCar size={48} className="text-gray-300" />
                      </div>
                    )}
                  </div>
                </td>
              ))}
            </tr>

            {/* Name row */}
            <tr>
              <td className="p-4 border-b font-semibold">Nafn</td>
              {dekk.map(d => (
                <td key={d.id} className="p-4 border-b text-center">{d.titill}</td>
              ))}
            </tr>

            {/* Manufacturer row */}
            <tr>
              <td className="p-4 border-b font-semibold">Framleiðandi</td>
              {dekk.map(d => (
                <td key={d.id} className="p-4 border-b text-center">{d.framleiddAf || 'Óþekkt'}</td>
              ))}
            </tr>

            {/* Size row */}
            <tr>
              <td className="p-4 border-b font-semibold">Stærð</td>
              {dekk.map(d => (
                <td key={d.id} className="p-4 border-b text-center">{d.dekkStaerd}</td>
              ))}
            </tr>

            {/* Price row */}
            <tr>
              <td className="p-4 border-b font-semibold">Verð</td>
              {dekk.map(d => (
                <td key={d.id} className="p-4 border-b text-center font-bold">
                  {formatPrice(d.verd)}
                </td>
              ))}
            </tr>

            {/* Stock row */}
            <tr>
              <td className="p-4 border-b font-semibold">Birgðastaða</td>
              {dekk.map(d => (
                <td key={d.id} className="p-4 border-b text-center">
                  <span 
                    className={`px-2 py-1 rounded text-sm ${
                      d.birgdaStada?.toLowerCase().includes('stock') || d.birgdaStada?.toLowerCase().includes('til í')
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {getStockStatus(d.birgdaStada, d.fjoldiALager)}
                  </span>
                </td>
              ))}
            </tr>

            {/* Source row */}
            <tr>
              <td className="p-4 border-b font-semibold">Söluaðili</td>
              {dekk.map(d => (
                <td key={d.id} className="p-4 border-b text-center">{d.upprunaSida}</td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
