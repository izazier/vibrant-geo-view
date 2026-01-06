import { X, Database, Map, BarChart3, FileText, CheckCircle } from 'lucide-react';

interface MethodPageProps {
  onClose: () => void;
}

export default function MethodPage({ onClose }: MethodPageProps) {
  const steps = [
    {
      icon: Database,
      title: 'Pengumpulan Data',
      description: 'Data bank sampah dikumpulkan melalui survei lapangan dan koordinasi dengan instansi terkait. Data mencakup nama bank sampah, lokasi koordinat (latitude & longitude), volume sampah per minggu, dan jenis sampah dominan.'
    },
    {
      icon: FileText,
      title: 'Pengolahan Data',
      description: 'Data yang terkumpul diolah dan divalidasi untuk memastikan akurasi koordinat dan kelengkapan informasi. Data kemudian diformat dalam bentuk JSON untuk kemudahan integrasi dengan sistem.'
    },
    {
      icon: Map,
      title: 'Visualisasi Peta',
      description: 'Menggunakan library OpenLayers untuk menampilkan peta interaktif dengan basemap OpenStreetMap. Setiap titik bank sampah ditampilkan dengan marker yang dapat diklik untuk melihat informasi detail.'
    },
    {
      icon: BarChart3,
      title: 'Analisis & Diferensiasi',
      description: 'Implementasi visualisasi data dengan diferensiasi warna berdasarkan kategori volume sampah. Warna hijau untuk volume rendah, kuning untuk sedang, dan merah untuk tinggi.'
    }
  ];

  const technologies = [
    { name: 'React', desc: 'Library JavaScript untuk membangun antarmuka pengguna' },
    { name: 'OpenLayers', desc: 'Library peta interaktif untuk visualisasi data spasial' },
    { name: 'Tailwind CSS', desc: 'Framework CSS untuk styling yang responsif' },
    { name: 'Vite', desc: 'Build tool modern untuk pengembangan web' },
  ];

  return (
    <div className="page-overlay">
      <div className="page-content max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl md:text-3xl font-bold">Metodologi Penelitian</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-muted transition-colors"
            aria-label="Tutup"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Steps */}
        <div className="space-y-6 mb-10">
          <h3 className="text-lg font-semibold text-primary">Tahapan Penelitian</h3>
          <div className="grid gap-4">
            {steps.map((step, index) => (
              <div key={index} className="flex gap-4 p-4 rounded-xl bg-muted/30">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <step.icon className="w-6 h-6 text-primary" />
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded">
                      Tahap {index + 1}
                    </span>
                  </div>
                  <h4 className="font-semibold mb-1">{step.title}</h4>
                  <p className="text-sm text-muted-foreground">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Technologies */}
        <div className="space-y-4 mb-10">
          <h3 className="text-lg font-semibold text-primary">Teknologi yang Digunakan</h3>
          <div className="grid md:grid-cols-2 gap-3">
            {technologies.map((tech, index) => (
              <div key={index} className="flex items-start gap-3 p-4 rounded-xl bg-muted/30">
                <CheckCircle className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">{tech.name}</p>
                  <p className="text-sm text-muted-foreground">{tech.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Data Source */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-primary">Sumber Data</h3>
          <div className="p-4 rounded-xl bg-muted/30">
            <p className="text-muted-foreground">
              Data bank sampah yang digunakan dalam sistem ini diperoleh dari hasil survei 
              lapangan di 4 kecamatan di Kota Pekanbaru, yaitu Tampan, Rumbai, Tenayan Raya, 
              dan Marpoyan Damai. Data mencakup informasi lokasi, volume sampah, dan jenis 
              sampah dominan dari setiap bank sampah.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
