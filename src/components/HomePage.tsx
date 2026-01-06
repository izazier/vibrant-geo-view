import { MapPin, Recycle, BarChart3, Database, ArrowRight, LayoutDashboard } from 'lucide-react';

interface HomePageProps {
  onNavigateToMap: () => void;
  onNavigateToMethod: () => void;
  onNavigateToDashboard: () => void;
}

export default function HomePage({ onNavigateToMap, onNavigateToMethod, onNavigateToDashboard }: HomePageProps) {
  const features = [
    {
      icon: MapPin,
      title: 'Visualisasi Peta Interaktif',
      description: 'Menampilkan lokasi bank sampah dengan marker interaktif dan informasi detail.'
    },
    {
      icon: Recycle,
      title: 'Data Bank Sampah',
      description: 'Informasi lengkap tentang bank sampah termasuk jenis sampah dan volume mingguan.'
    },
    {
      icon: BarChart3,
      title: 'Analisis Visual',
      description: 'Diferensiasi warna berdasarkan volume sampah untuk analisis yang lebih mudah.'
    },
    {
      icon: Database,
      title: 'Multi-Layer Data',
      description: 'Mendukung multiple layer data spasial dengan filterisasi per kecamatan.'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-6 py-20">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        </div>

        <div className="relative max-w-4xl mx-auto text-center">
          <div className="flex justify-center mb-8">
            <div className="p-4 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
              {/* PERUBAHAN DI SINI: Icon Leaf diganti Image */}
              <img 
                src="/logo.png" 
                alt="Logo SIG" 
                className="w-16 h-16 object-contain" 
              />
            </div>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-foreground via-primary to-accent bg-clip-text text-transparent">
            Sistem Informasi Geografis<br />Bank Sampah Kota Pekanbaru
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
            Platform pemetaan dan analisis lokasi bank sampah di Kota Pekanbaru 
            menggunakan teknologi WebGIS untuk mendukung pengelolaan sampah yang lebih baik.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button onClick={onNavigateToDashboard} className="btn-hero">
              <LayoutDashboard className="w-5 h-5" />
              Lihat Dashboard
              <ArrowRight className="w-5 h-5" />
            </button>
            <button onClick={onNavigateToMap} className="btn-outline-hero">
              <MapPin className="w-5 h-5" />
              <span>Lihat Peta</span>
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Fitur Utama</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Aplikasi ini menyediakan berbagai fitur untuk memudahkan analisis dan visualisasi data bank sampah.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="glass-card p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Info Section */}
      <section className="py-20 px-6 bg-muted/30">
        <div className="max-w-4xl mx-auto">
          <div className="glass-card p-8 md:p-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-6">Tentang Proyek</h2>
            <div className="space-y-4 text-muted-foreground">
              <p>
                Proyek Sistem Informasi Geografis (SIG) Bank Sampah Kota Pekanbaru ini 
                dikembangkan sebagai bagian dari tugas akhir mata kuliah. Aplikasi ini 
                bertujuan untuk memetakan dan menganalisis sebaran lokasi bank sampah 
                di wilayah Kota Pekanbaru.
              </p>
              <p>
                Data yang ditampilkan mencakup informasi dari 4 kecamatan yaitu:
                <strong className="text-foreground"> Tampan, Rumbai, Tenayan Raya, </strong> 
                dan <strong className="text-foreground">Marpoyan Damai</strong>.
              </p>
              <p>
                Setiap titik lokasi bank sampah divisualisasikan dengan ikon tempat sampah 
                yang berwarna berbeda sesuai dengan kategori volume sampah per minggu:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><span className="text-success font-semibold">Hijau</span> - Volume rendah (&lt; 100 kg/minggu)</li>
                <li><span className="text-warning font-semibold">Kuning</span> - Volume sedang (100 - 500 kg/minggu)</li>
                <li><span className="text-danger font-semibold">Merah</span> - Volume tinggi (&gt; 500 kg/minggu)</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-border">
        <div className="max-w-6xl mx-auto text-center text-sm text-muted-foreground">
          <p>© 2026 Proyek SIG Bank Sampah Kota Pekanbaru</p>
          <p className="mt-2">Presentasi: 7 Januari 2026</p >
        </div>
      </footer>
    </div>
  );
}