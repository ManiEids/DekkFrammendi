import axios from 'axios';
import { Dekk, DekkFilter, DekkStaerd } from '../types';
import { WIDTHS, HEIGHTS, RIM_SIZES } from '../constants';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://dekkbakendi.onrender.com';

// Create axios instance with a longer timeout for Render's free tier (which can be slow to wake up)
const api = axios.create({ 
  baseURL: API_URL,
  timeout: 30000, // 30 seconds timeout
});

// Update FALLBACK_DATA to use new fields
const FALLBACK_DATA: {
  dekk: Dekk[];
  staerdir: DekkStaerd[];
} = {
  dekk: Array(15).fill(null).map((_, i) => ({
    id: i + 1,
    seller: ['Seller1', 'Seller2', 'Seller3'][i % 3],
    manufacturer: ['Michelin', 'Continental', 'Pirelli', 'Bridgestone', 'Goodyear'][i % 5],
    product_name: `Demo vöru ${i + 1}`,
    width: [205, 215, 225][i % 3],
    aspect_ratio: [55, 60, 65][i % 3],
    rim_size: [16, 17, 18][i % 3],
    price: 20000 + Math.floor(Math.random() * 30000),
    stock: i % 3 === 0 ? 'Out of Stock' : 'In Stock',
    inventory_count: i % 3 === 0 ? 0 : Math.floor(Math.random() * 10),
    picture: null,
  })),
  staerdir: [] as DekkStaerd[],
};

// Generate fallback size data using new keys
for (const w of [175, 185, 195, 205, 215, 225, 235]) {
  for (const ar of [50, 55, 60, 65, 70]) {
    for (const rs of [15, 16, 17, 18]) {
      FALLBACK_DATA.staerdir.push({ width: w, aspect_ratio: ar, rim_size: rs });
    }
  }
}

export async function fetchDekk(filter: DekkFilter = {}): Promise<Dekk[]> {
  const params = new URLSearchParams();

  if (filter.id) params.append('id', filter.id.toString());
  if (filter.width) params.append('width', filter.width.toString());
  if (filter.aspect_ratio) params.append('aspect_ratio', filter.aspect_ratio.toString());
  if (filter.rim_size) params.append('rim_size', filter.rim_size.toString());
  if (filter.manufacturer) params.append('manufacturer', filter.manufacturer);
  if (filter.seller) params.append('seller', filter.seller);
  if (filter.product_name) params.append('product_name', filter.product_name);
  if (filter.minPrice !== undefined) params.append('minPrice', filter.minPrice.toString());
  if (filter.maxPrice !== undefined) params.append('maxPrice', filter.maxPrice.toString());
  if (filter.inStock) params.append('inStock', 'true');
  if (filter.sortBy) params.append('sortBy', filter.sortBy);
  if (filter.sortOrder) params.append('sortOrder', filter.sortOrder);

  try {
    const response = await api.get<Dekk[]>(`/dekk?${params.toString()}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching tires:', error);
    let fallbackDekk = [...FALLBACK_DATA.dekk];
    if (filter.id) fallbackDekk = fallbackDekk.filter(d => d.id === filter.id);
    if (filter.width) fallbackDekk = fallbackDekk.filter(d => d.width === filter.width);
    if (filter.aspect_ratio) fallbackDekk = fallbackDekk.filter(d => d.aspect_ratio === filter.aspect_ratio);
    if (filter.rim_size) fallbackDekk = fallbackDekk.filter(d => d.rim_size === filter.rim_size);
    return fallbackDekk;
  }
}

export async function fetchStaerdir(): Promise<DekkStaerd[]> {
  try {
    const response = await api.get<DekkStaerd[]>('/staerdir');
    return response.data;
  } catch (error) {
    console.error('Error fetching sizes:', error);
    // Return fallback data or generate from constants
    const staerdir: DekkStaerd[] = [];
    
    // Create a set of common tire sizes from constants
    WIDTHS.forEach(width => {
      HEIGHTS.forEach(aspect_ratio => {
        RIM_SIZES.forEach(rim_size => {
          // Only include common combinations to keep the list reasonable
          if ((width === 195 && aspect_ratio === 65 && rim_size === 15) ||
              (width === 205 && aspect_ratio === 55 && rim_size === 16) ||
              (width === 225 && aspect_ratio === 45 && rim_size === 17) ||
              // Add more common combinations
              ([175, 185, 195, 205, 215, 225, 235].includes(width) && 
               [45, 50, 55, 60, 65].includes(aspect_ratio) && 
               [15, 16, 17, 18].includes(rim_size))) {
            staerdir.push({ width, aspect_ratio, rim_size });
          }
        });
      });
    });
    
    return staerdir.length > 0 ? staerdir : FALLBACK_DATA.staerdir;
  }
}

export async function fetchFramleideendur(): Promise<string[]> {
  try {
    const response = await api.get<string[]>('/framleidandi');
    return response.data;
  } catch (error) {
    console.error('Error fetching manufacturers:', error);
    return ['Continental', 'Michelin', 'Bridgestone', 'Pirelli', 'Goodyear', 'Hankook', 'Nokian'];
  }
}

export async function fetchVefsidur(): Promise<string[]> {
  try {
    const response = await api.get<string[]>('/vefsidur');
    return response.data;
  } catch (error) {
    console.error('Error fetching websites:', error);
    return ['N1', 'Dekkjahollin', 'Nesdekk'];
  }
}

// Ensure that your backend API (at NEXT_PUBLIC_API_URL) implements SQL queries 
// on the "tires" table using the provided parameters (width, aspect_ratio, rim_size, etc.).
// Consider adding pagination parameters (limit and offset) for efficiency.
