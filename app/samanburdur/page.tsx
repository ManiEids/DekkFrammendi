'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { FaArrowLeft, FaTimes, FaCar } from 'react-icons/fa';
import { fetchDekk } from '../lib/api';
import { Dekk } from '../types';

type ComparisonDekk = Dekk & { size: string };

export default function Samanburdur() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [dekk, setDekk] = useState<ComparisonDekk[]>([]);
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
        const promises = idArray.map(id => fetchDekk({ id }));
        const results = await Promise.all(promises);
        const allDekk = results.flatMap(result => result);
        const formattedDekk = allDekk.map(d => ({
          ...d,
          size: `${d.width}/${d.aspect_ratio}R${d.rim_size}`,
        }));
        setDekk(formattedDekk);
      } catch (err) {
        setError('Villa kom upp við að sækja dekk');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSelectedDekk();
  }, [searchParams]);

  const removeDekk = (id: number) => {
    const newDekk = dekk.filter(d => d.id !== id);
    if (newDekk.length < 2) {
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
          <p className="text-lg mb-4">{error || 'Engin dekk fundust til samanburðar'}</p>
          <Link href="/dekk" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded inline-block">
            Aftur í dekkjaleit
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8">
      <div className="mb-4 sm:mb-8">
        <Link href="/dekk" className="flex items-center text-blue-600 hover:underline">
          <FaArrowLeft className="mr-2" /> Til baka í dekkjaleit
        </Link>
        <h1 className="text-xl sm:text-2xl font-bold mt-3 text-white">Samanburður á dekkjum</h1>
        <p className="text-sm text-gray-300 mt-1">Renndu til hliðar til að sjá allan samanburðinn</p>
      </div>
      
      <div className="overflow-x-auto pb-6 -mx-2 px-2">
        <table className="w-full border-collapse min-w-[600px]">
          <thead>
            <tr>
              <th className="p-3 bg-gray-100 text-left font-semibold border-b"></th>
              {dekk.map(d => (
                <th key={d.id} className="p-3 bg-gray-100 text-center border-b min-w-[180px]">
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
            <tr>
              <td className="p-4 border-b font-semibold">Mynd</td>
              {dekk.map(d => (
                <td key={d.id} className="p-4 border-b text-center">
                  <div className="relative h-40 w-full">
                    {d.picture ? (
                      <Image
                        src={d.picture}
                        alt={d.product_name}
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
            <tr>
              <td className="p-4 border-b font-semibold">Nafn</td>
              {dekk.map(d => (
                <td key={d.id} className="p-4 border-b text-center">{d.product_name}</td>
              ))}
            </tr>
            <tr>
              <td className="p-4 border-b font-semibold">Framleiðandi</td>
              {dekk.map(d => (
                <td key={d.id} className="p-4 border-b text-center">{d.manufacturer || 'Óþekkt'}</td>
              ))}
            </tr>
            <tr>
              <td className="p-4 border-b font-semibold">Stærð</td>
              {dekk.map(d => (
                <td key={d.id} className="p-4 border-b text-center">{d.size}</td>
              ))}
            </tr>
            <tr>
              <td className="p-4 border-b font-semibold">Verð</td>
              {dekk.map(d => (
                <td key={d.id} className="p-4 border-b text-center font-bold">
                  {d.price.toLocaleString('is-IS')} kr
                </td>
              ))}
            </tr>
            <tr>
              <td className="p-4 border-b font-semibold">Birgðastaða</td>
              {dekk.map(d => (
                <td key={d.id} className="p-4 border-b text-center">
                  {d.stock}
                </td>
              ))}
            </tr>
            <tr>
              <td className="p-4 border-b font-semibold">Söluaðili</td>
              {dekk.map(d => (
                <td key={d.id} className="p-4 border-b text-center">{d.seller}</td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
