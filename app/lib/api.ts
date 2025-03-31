import axios from 'axios';
import { Dekk, DekkFilter, DekkStaerd } from '../types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://dekkbakendi.onrender.com';
const api = axios.create({ baseURL: API_URL });

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
  
  const response = await api.get<Dekk[]>(`/dekk?${params.toString()}`);
  return response.data;
}

export async function fetchStaerdir(): Promise<DekkStaerd[]> {
  const response = await api.get<DekkStaerd[]>('/staerdir');
  return response.data;
}

export async function fetchFramleideendur(): Promise<string[]> {
  const response = await api.get<string[]>('/framleideendur');
  return response.data;
}

export async function fetchVefsidur(): Promise<string[]> {
  const response = await api.get<string[]>('/vefsidur');
  return response.data;
}

export async function skrapaDekk(breidd: number, haed: number, felga: number): Promise<{skilabod: string}> {
  const response = await api.post('/skrapa', { breidd, haed, felga });
  return response.data;
}
