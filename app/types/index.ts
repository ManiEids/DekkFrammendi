export interface Dekk {
  id: number;
  titill: string;
  framleiddAf: string | null;
  dekkStaerd: string;
  breidd: number | null;
  haed: number | null;
  felga: number | null;
  verd: number | null;
  birgdaStada: string | null;
  fjoldiALager: number | null;
  mynd_url: string | null;
  upprunaSida: string;
  skrad_thann: string;
  uppfaert_thann: string | null;
}

export interface DekkFilter {
  breidd?: number;
  haed?: number;
  felga?: number;
  framleiddAf?: string;
  upprunaSida?: string;
  lagmarksVerd?: number;
  hamarksVerd?: number;
  adeinsALager?: boolean;
  id?: number;
  sortBy?: string; // For sorting results (e.g. 'verd')
  sortOrder?: 'asc' | 'desc'; // Ascending or descending order
}

export interface DekkStaerd {
  breidd: number;
  haed: number;
  felga: number;
}
