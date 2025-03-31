import axios from 'axios';
import { Dekk, DekkFilter, DekkStaerd } from '../types';
import { WIDTHS, HEIGHTS, RIM_SIZES } from '../constants';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://dekkbakendi.onrender.com';

// Create axios instance with a longer timeout for Render's free tier (which can be slow to wake up)
const api = axios.create({ 
  baseURL: API_URL,
  timeout: 30000, // 30 seconds timeout
});

// Sample data to use when backend is unavailable
const FALLBACK_DATA: {
  dekk: Dekk[];
  staerdir: DekkStaerd[]; // Explicitly type this array
} = {
  dekk: Array(15).fill(null).map((_, i) => ({
    id: i+1,
    titill: `Demo dekk ${i+1}`,
    framleiddAf: ['Michelin', 'Continental', 'Pirelli', 'Bridgestone', 'Goodyear'][i % 5],
    dekkStaerd: `${[205, 215, 225][i % 3]}/${[55, 60, 65][i % 3]}R${[16, 17, 18][i % 3]}`,
    breidd: [205, 215, 225][i % 3],
    haed: [55, 60, 65][i % 3],
    felga: [16, 17, 18][i % 3],
    verd: 20000 + Math.floor(Math.random() * 30000),
    birgdaStada: i % 3 === 0 ? null : i % 2 === 0 ? 'In Stock' : 'Out of Stock',
    fjoldiALager: i % 3 === 0 ? null : i % 2 === 0 ? Math.floor(Math.random() * 10) : 0,
    mynd_url: null,
    upprunaSida: ['N1', 'Dekkjahollin', 'Nesdekk'][i % 3],
    skrad_thann: new Date().toISOString(),
    uppfaert_thann: new Date().toISOString()
  })),
  staerdir: [] as DekkStaerd[] // Initialize with correct type
};

// Generate fallback size data
for (const breidd of [175, 185, 195, 205, 215, 225, 235]) {
  for (const haed of [50, 55, 60, 65, 70]) {
    for (const felga of [15, 16, 17, 18]) {
      FALLBACK_DATA.staerdir.push({ breidd, haed, felga });
    }
  }
}

export async function fetchDekk(filter: DekkFilter = {}): Promise<Dekk[]> {
  const params = new URLSearchParams();
  
  if (filter.id) params.append('id', filter.id.toString());
  if (filter.breidd) params.append('breidd', filter.breidd.toString());
  if (filter.haed) params.append('haed', filter.haed.toString());
  if (filter.felga) params.append('felga', filter.felga.toString());
  if (filter.framleiddAf) params.append('framleiddAf', filter.framleiddAf);
  if (filter.upprunaSida) params.append('upprunaSida', filter.upprunaSida);
  if (filter.lagmarksVerd !== undefined) params.append('lagmarksVerd', filter.lagmarksVerd.toString());
  if (filter.hamarksVerd !== undefined) params.append('hamarksVerd', filter.hamarksVerd.toString());
  if (filter.adeinsALager) params.append('adeinsALager', 'true');
  if (filter.sortBy) params.append('sortBy', filter.sortBy);
  if (filter.sortOrder) params.append('sortOrder', filter.sortOrder);
  
  try {
    const response = await api.get<Dekk[]>(`/dekk?${params.toString()}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching tires:', error);
    // Return fallback data filtered according to the filter parameters
    let fallbackDekk = [...FALLBACK_DATA.dekk];
    
    if (filter.id) {
      fallbackDekk = fallbackDekk.filter(d => d.id === filter.id);
    }
    if (filter.breidd) {
      fallbackDekk = fallbackDekk.filter(d => d.breidd === filter.breidd);
    }
    if (filter.haed) {
      fallbackDekk = fallbackDekk.filter(d => d.haed === filter.haed);
    }
    if (filter.felga) {
      fallbackDekk = fallbackDekk.filter(d => d.felga === filter.felga);
    }
    
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
    WIDTHS.forEach(breidd => {
      HEIGHTS.forEach(haed => {
        RIM_SIZES.forEach(felga => {
          // Only include common combinations to keep the list reasonable
          if ((breidd === 195 && haed === 65 && felga === 15) ||
              (breidd === 205 && haed === 55 && felga === 16) ||
              (breidd === 225 && haed === 45 && felga === 17) ||
              // Add more common combinations
              ([175, 185, 195, 205, 215, 225, 235].includes(breidd) && 
               [45, 50, 55, 60, 65].includes(haed) && 
               [15, 16, 17, 18].includes(felga))) {
            staerdir.push({ breidd, haed, felga });
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

export async function skrapaDekk(breidd: number, haed: number, felga: number): Promise<{skilabod: string}> {
  try {
    const response = await api.post('/skrapa', { breidd, haed, felga });
    return response.data;
  } catch (error) {
    console.error('Error scraping tires:', error);
    return { skilabod: 'Villa kom upp við að skrapa gögn. Bakendi virðist ekki vera tengdur.' };
  }
}

// Function to check API health with a more reliable approach
export async function checkHealth(): Promise<boolean> {
  try {
    // Try multiple endpoints to determine API health
    const healthEndpoints = [
      api.get('/heilsa').catch(() => ({ status: 500 })),
      api.get('/').catch(() => ({ status: 500 }))
    ];
    
    const responses = await Promise.all(healthEndpoints);
    
    // If any endpoint succeeds, consider API healthy
    return responses.some(response => response.status >= 200 && response.status < 300);
  } catch (error) {
    console.error('API health check failed:', error);
    return false;
  }
}
