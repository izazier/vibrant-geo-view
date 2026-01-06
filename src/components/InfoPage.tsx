import { X, Users, Target, Calendar, MapPin } from 'lucide-react';

interface InfoPageProps {
  onClose: () => void;
}

export default function InfoPage({ onClose }: InfoPageProps) {
  return (
    <div className="page-overlay">
      <div className="page-content max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl md:text-3xl font-bold">Tentang Proyek</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-muted transition-colors"
            aria-label="Tutup"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Project Info */}
        <div className="space-y-6">
          <div className="p-6 rounded-xl bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20">
            <h3 className="text-xl font-bold mb-4">Sistem Informasi Geografis Bank Sampah Kota Pekanbaru</h3>
            <p className="text-muted-foreground">
              Proyek ini merupakan implementasi Sistem Informasi Geografis (SIG) berbasis web 
              untuk memetakan dan menganalisis sebaran lokasi bank sampah di Kota Pekanbaru. 
              Sistem ini dikembangkan menggunakan teknologi WebGIS modern dengan library OpenLayers 
              untuk visualisasi peta interaktif.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-5 rounded-xl bg-muted/30 flex gap-4">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Target className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h4 className="font-semibold mb-1">Tujuan</h4>
                <p className="text-sm text-muted-foreground">
                  Menyediakan platform visualisasi data spasial bank sampah untuk mendukung 
                  pengelolaan sampah yang lebih efektif.
                </p>
              </div>
            </div>

            <div className="p-5 rounded-xl bg-muted/30 flex gap-4">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <MapPin className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h4 className="font-semibold mb-1">Cakupan Wilayah</h4>
                <p className="text-sm text-muted-foreground">
                  4 Kecamatan: Binawidya, Rumbai, Tenayan Raya, dan Marpoyan Damai.
                </p>
              </div>
            </div>

            <div className="p-5 rounded-xl bg-muted/30 flex gap-4">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Users className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h4 className="font-semibold mb-1">Tim Pengembang</h4>
                <p className="text-sm text-muted-foreground">
                  Mahasiswa Program Studi yang mengambil mata kuliah Sistem Informasi Geografis.
                </p>
              </div>
            </div>

            <div className="p-5 rounded-xl bg-muted/30 flex gap-4">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Calendar className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h4 className="font-semibold mb-1">Jadwal Presentasi</h4>
                <p className="text-sm text-muted-foreground">
                  7 Januari 2026
                </p>
              </div>
            </div>
          </div>

          {/* Features */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Fitur Sistem</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 rounded-full bg-primary mt-2"></span>
                <span className="text-muted-foreground">
                  Peta interaktif dengan basemap OpenStreetMap menggunakan library OpenLayers
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 rounded-full bg-primary mt-2"></span>
                <span className="text-muted-foreground">
                  Filter data berdasarkan kecamatan menggunakan checkbox
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 rounded-full bg-primary mt-2"></span>
                <span className="text-muted-foreground">
                  Visualisasi dengan ikon tempat sampah berwarna sesuai kategori volume
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 rounded-full bg-primary mt-2"></span>
                <span className="text-muted-foreground">
                  Popup informasi detail saat marker diklik
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 rounded-full bg-primary mt-2"></span>
                <span className="text-muted-foreground">
                  Multiple layer data spasial (marker layer, cluster layer, heatmap layer)
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
