export interface BankSampah {
  No: number;
  "Nama Bank Sampah": string;
  Kecamatan: string;
  Lattitude: number;
  Longtitude: number;
  "Volume Sampah Per Minggu": string;
  "Jenis Sampah Dominan": string;
}

export type VolumeCategory = 'low' | 'medium' | 'high';

export const KECAMATAN_LIST = [
  'binawidya',
  'rumbai',
  'tenayan raya',
  'marpoyan damai'
] as const;

export type Kecamatan = typeof KECAMATAN_LIST[number];

export const KECAMATAN_COLORS: Record<string, string> = {
  'marpoyan damai': '#e74c3c',
  'rumbai': '#2ecc71',
  'tenayan raya': '#3498db',
  'binawidya': '#9b59b6',
};

export const VOLUME_COLORS = {
  low: '#22c55e',    // Green - < 100 kg
  medium: '#eab308', // Yellow - 100-500 kg
  high: '#ef4444',   // Red - > 500 kg
};

export function getVolumeCategory(volumeStr: string): VolumeCategory {
  const numbers = volumeStr.match(/\d+/g);
  if (!numbers) return 'low';
  
  const maxVolume = Math.max(...numbers.map(n => parseInt(n)));
  
  if (maxVolume < 100) return 'low';
  if (maxVolume < 500) return 'medium';
  return 'high';
}

export function getVolumeColor(volumeStr: string): string {
  const category = getVolumeCategory(volumeStr);
  return VOLUME_COLORS[category];
}

export function formatKecamatan(kec: string): string {
  return kec.split(' ').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');
}
