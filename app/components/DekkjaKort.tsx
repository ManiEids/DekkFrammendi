import Image from 'next/image';
import { Dekk } from '../types';
import { FaCar } from 'react-icons/fa';  // Changed from FaTire to FaCar which exists

export default function DekkjaKort({ dekk, onAddToSamanburdur, isSelected }: { dekk: Dekk; onAddToSamanburdur?: () => void; isSelected?: boolean; }) {
  // Updated price formatting using Intl.NumberFormat
  const formatPrice = (price: number | null) => {
    if (!price) return 'Verð óþekkt';
    const formatter = new Intl.NumberFormat('is-IS', { 
      style: 'currency', 
      currency: 'ISK', 
      minimumFractionDigits: 0, 
      maximumFractionDigits: 0 
    });
    return formatter.format(price);
  };
  
  // Get stock status in Icelandic
  const getStockStatus = (status: string | null, count: number | null) => {
    if (!status) return 'Birgðastaða óþekkt';
    if (status.toLowerCase().includes('in stock') || status.toLowerCase().includes('til í')) {
      return 'Á lager' + (count ? `: ${count} stk` : '');
    }
    return 'Ekki á lager';
  };
  
  return (
    <div className={`border rounded-lg overflow-hidden bg-white shadow-md transition ${isSelected ? 'ring-2 ring-blue-500' : 'hover:shadow-lg'}`}>
      <div className="flex flex-col h-full">
        <div className="relative pt-[56.25%] bg-gray-100">
          {dekk.picture ? (
            <Image
              unoptimized
              src={dekk.picture}
              alt={dekk.product_name}
              fill
              className="object-contain"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <FaCar size={48} className="text-gray-300" />
            </div>
          )}
        </div>
        
        <div className="p-4 flex flex-col flex-grow">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm font-semibold text-blue-600">
              {dekk.seller}
            </div>
            <span className="text-sm text-gray-500">
              {`${dekk.width}/${dekk.aspect_ratio}R${dekk.rim_size}`}
            </span>
          </div>
          
          <h3 className="font-semibold mb-1">{dekk.product_name}</h3>
          {dekk.manufacturer && <p className="text-sm text-gray-600 mb-3">Framleiðandi: {dekk.manufacturer}</p>}
          
          <div className="mt-auto">
            <p className="text-lg font-bold text-blue-600">{formatPrice(dekk.price)}</p>
            <p className={`text-sm ${dekk.inventory_count && dekk.inventory_count > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {getStockStatus(dekk.stock, dekk.inventory_count)}
            </p>
          </div>
        </div>
        
        {onAddToSamanburdur && (
          <div className="px-4 pb-4">
            <button 
              onClick={onAddToSamanburdur}
              className={`w-full py-2 px-4 rounded text-sm ${isSelected ? 'bg-red-100 text-red-700 hover:bg-red-200' : 'bg-blue-50 text-blue-700 hover:bg-blue-100'}`}
            >
              {isSelected ? 'Fjarlægja úr samanburði' : 'Bæta við samanburð'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
