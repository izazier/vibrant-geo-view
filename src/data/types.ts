export interface BankSampah {
  No: number;
  "Nama Bank Sampah": string;
  Kecamatan: string;
  "Jenis Sampah Dominan": string;
  "Volume Sampah Per Minggu": string;
  Lattitude: number;
  Longtitude: number;
}

export const KECAMATAN_LIST = [
  'tampan',
  'tenayan raya',
  'marpoyan damai',
  'rumbai',
] as const;

export type Kecamatan = typeof KECAMATAN_LIST[number];

export function formatKecamatan(kec: string): string {
  return kec
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export function getVolumeCategory(volume: string): 'low' | 'medium' | 'high' {
  const numMatch = volume.match(/\d+/);
  if (!numMatch) return 'low';
  
  const num = parseInt(numMatch[0], 10);
  if (num < 100) return 'low';
  if (num <= 500) return 'medium';
  return 'high';
}

export function parseVolumeNumber(volume: string): number {
  const numMatch = volume.match(/\d+/);
  return numMatch ? parseInt(numMatch[0], 10) : 0;
}
