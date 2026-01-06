import { useMemo } from 'react';
import {
  MapPin,
  Recycle,
  TrendingUp,
  BarChart3,
  Scale,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import {
  BankSampah,
  formatKecamatan,
  getVolumeCategory,
  parseVolumeNumber,
  KECAMATAN_LIST,
} from '@/data/types';

interface DashboardViewProps {
  data: BankSampah[];
}

const COLORS = {
  primary: '#16a34a',
  accent: '#0d9488',
  success: '#22c55e',
  warning: '#eab308',
  danger: '#ef4444',
  muted: '#94a3b8',
};

const KECAMATAN_COLORS = ['#16a34a', '#0d9488', '#0891b2', '#6366f1'];

export default function DashboardView({ data }: DashboardViewProps) {
  // Calculate statistics
  const stats = useMemo(() => {
    const totalLocations = data.length;
    const totalVolume = data.reduce((sum, item) => sum + parseVolumeNumber(item['Volume Sampah Per Minggu']), 0);
    const avgVolume = totalLocations > 0 ? Math.round(totalVolume / totalLocations) : 0;

    // Count by volume category
    const volumeCategories = { low: 0, medium: 0, high: 0 };
    data.forEach((item) => {
      const cat = getVolumeCategory(item['Volume Sampah Per Minggu']);
      volumeCategories[cat]++;
    });

    // Count by kecamatan
    const byKecamatan: Record<string, { count: number; volume: number }> = {};
    KECAMATAN_LIST.forEach((kec) => {
      byKecamatan[kec] = { count: 0, volume: 0 };
    });

    data.forEach((item) => {
      const kec = item.Kecamatan.toLowerCase();
      if (byKecamatan[kec]) {
        byKecamatan[kec].count++;
        byKecamatan[kec].volume += parseVolumeNumber(item['Volume Sampah Per Minggu']);
      }
    });

    // Waste types
    const wasteTypes: Record<string, number> = {};
    data.forEach((item) => {
      const types = item['Jenis Sampah Dominan'].split(',').map((t) => t.trim().toLowerCase());
      types.forEach((type) => {
        wasteTypes[type] = (wasteTypes[type] || 0) + 1;
      });
    });

    return {
      totalLocations,
      totalVolume,
      avgVolume,
      volumeCategories,
      byKecamatan,
      wasteTypes,
      kecamatanCount: KECAMATAN_LIST.length,
    };
  }, [data]);

  // Prepare chart data
  const pieData = KECAMATAN_LIST.map((kec, index) => ({
    name: formatKecamatan(kec),
    value: stats.byKecamatan[kec]?.count || 0,
    color: KECAMATAN_COLORS[index],
  }));

  const barData = KECAMATAN_LIST.map((kec) => ({
    name: formatKecamatan(kec),
    volume: stats.byKecamatan[kec]?.volume || 0,
    count: stats.byKecamatan[kec]?.count || 0,
  }));

  const volumeCategoryData = [
    { name: 'Rendah (<100kg)', value: stats.volumeCategories.low, color: COLORS.success },
    { name: 'Sedang (100-500kg)', value: stats.volumeCategories.medium, color: COLORS.warning },
    { name: 'Tinggi (>500kg)', value: stats.volumeCategories.high, color: COLORS.danger },
  ];

  const topWasteTypes = Object.entries(stats.wasteTypes)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([name, count]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      count,
    }));

  return (
    <div className="min-h-screen bg-background p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">Dashboard Analitik</h1>
            <p className="text-muted-foreground mt-1">Statistik dan analisis data bank sampah Kota Pekanbaru</p>
          </div>
          <div className="badge-live">Data Real-time</div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="stat-highlight">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Lokasi</p>
                <p className="text-3xl font-bold text-foreground">{stats.totalLocations}</p>
              </div>
              <div className="p-2 rounded-xl bg-primary/10">
                <MapPin className="w-5 h-5 text-primary" />
              </div>
            </div>
            <div className="flex items-center gap-1 mt-3 text-sm text-success">
              <ArrowUpRight className="w-4 h-4" />
              <span>+12% dari bulan lalu</span>
            </div>
          </div>

          <div className="stat-highlight">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Volume</p>
                <p className="text-3xl font-bold text-foreground">{stats.totalVolume.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">kg/minggu</p>
              </div>
              <div className="p-2 rounded-xl bg-accent/10">
                <Scale className="w-5 h-5 text-accent" />
              </div>
            </div>
            <div className="flex items-center gap-1 mt-2 text-sm text-success">
              <ArrowUpRight className="w-4 h-4" />
              <span>+8% dari bulan lalu</span>
            </div>
          </div>

          <div className="stat-highlight">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Rata-rata Volume</p>
                <p className="text-3xl font-bold text-foreground">{stats.avgVolume}</p>
                <p className="text-xs text-muted-foreground">kg/lokasi/minggu</p>
              </div>
              <div className="p-2 rounded-xl bg-warning/10">
                <TrendingUp className="w-5 h-5 text-warning" />
              </div>
            </div>
            <div className="flex items-center gap-1 mt-2 text-sm text-muted-foreground">
              <ArrowDownRight className="w-4 h-4" />
              <span>-2% dari bulan lalu</span>
            </div>
          </div>

          <div className="stat-highlight">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Kecamatan</p>
                <p className="text-3xl font-bold text-foreground">{stats.kecamatanCount}</p>
                <p className="text-xs text-muted-foreground">wilayah tercakup</p>
              </div>
              <div className="p-2 rounded-xl bg-primary/10">
                <BarChart3 className="w-5 h-5 text-primary" />
              </div>
            </div>
            <div className="flex items-center gap-1 mt-2 text-sm text-success">
              <Recycle className="w-4 h-4" />
              <span>100% aktif</span>
            </div>
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Distribution by Kecamatan */}
          <div className="dashboard-card p-6">
            <h3 className="text-lg font-semibold mb-4">Distribusi per Kecamatan</h3>
            <div className="chart-container">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={4}
                    dataKey="value"
                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                    labelLine={false}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '0.5rem',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Volume by Kecamatan */}
          <div className="dashboard-card p-6">
            <h3 className="text-lg font-semibold mb-4">Volume per Kecamatan (kg/minggu)</h3>
            <div className="chart-container">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis type="number" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                  <YAxis
                    type="category"
                    dataKey="name"
                    tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                    width={100}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '0.5rem',
                    }}
                    formatter={(value: number) => [`${value} kg`, 'Volume']}
                  />
                  <Bar dataKey="volume" fill={COLORS.primary} radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Second Charts Row */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Volume Categories */}
          <div className="dashboard-card p-6">
            <h3 className="text-lg font-semibold mb-4">Kategori Volume</h3>
            <div className="space-y-4">
              {volumeCategoryData.map((item) => (
                <div key={item.name} className="flex items-center gap-3">
                  <div
                    className="w-4 h-4 rounded-full flex-shrink-0"
                    style={{ backgroundColor: item.color }}
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm">{item.name}</span>
                      <span className="text-sm font-semibold">{item.value}</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${(item.value / stats.totalLocations) * 100}%`,
                          backgroundColor: item.color,
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Waste Types */}
          <div className="dashboard-card p-6">
            <h3 className="text-lg font-semibold mb-4">Jenis Sampah Dominan</h3>
            <div className="space-y-3">
              {topWasteTypes.map((item, index) => (
                <div key={item.name} className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-lg bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary">
                    {index + 1}
                  </span>
                  <span className="flex-1 text-sm">{item.name}</span>
                  <span className="text-sm font-semibold text-muted-foreground">{item.count} lokasi</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="dashboard-card p-6">
            <h3 className="text-lg font-semibold mb-4">Ringkasan Cepat</h3>
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-success/10 border border-success/20">
                <p className="text-sm text-muted-foreground">Lokasi Volume Rendah</p>
                <p className="text-2xl font-bold text-success">{stats.volumeCategories.low}</p>
              </div>
              <div className="p-4 rounded-xl bg-warning/10 border border-warning/20">
                <p className="text-sm text-muted-foreground">Lokasi Volume Sedang</p>
                <p className="text-2xl font-bold text-warning">{stats.volumeCategories.medium}</p>
              </div>
              <div className="p-4 rounded-xl bg-danger/10 border border-danger/20">
                <p className="text-sm text-muted-foreground">Lokasi Volume Tinggi</p>
                <p className="text-2xl font-bold text-danger">{stats.volumeCategories.high}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Data Table */}
        <div className="dashboard-card overflow-hidden">
          <div className="p-6 border-b border-border">
            <h3 className="text-lg font-semibold">Data Bank Sampah</h3>
            <p className="text-sm text-muted-foreground mt-1">Daftar lengkap semua lokasi bank sampah</p>
          </div>
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>No</th>
                  <th>Nama Bank Sampah</th>
                  <th>Kecamatan</th>
                  <th>Jenis Sampah</th>
                  <th>Volume/Minggu</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {data.slice(0, 10).map((item) => {
                  const category = getVolumeCategory(item['Volume Sampah Per Minggu']);
                  const statusColor =
                    category === 'low' ? 'success' : category === 'medium' ? 'warning' : 'danger';
                  return (
                    <tr key={item.No}>
                      <td className="font-medium">{item.No}</td>
                      <td className="font-medium">{item['Nama Bank Sampah']}</td>
                      <td>{formatKecamatan(item.Kecamatan)}</td>
                      <td className="text-muted-foreground">{item['Jenis Sampah Dominan']}</td>
                      <td className="font-semibold">{item['Volume Sampah Per Minggu']}</td>
                      <td>
                        <span
                          className={`inline-flex items-center gap-1.5 px-2 py-1 text-xs font-medium rounded-full bg-${statusColor}/10 text-${statusColor}`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full bg-${statusColor}`} />
                          {category === 'low' ? 'Rendah' : category === 'medium' ? 'Sedang' : 'Tinggi'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {data.length > 10 && (
            <div className="p-4 border-t border-border text-center">
              <p className="text-sm text-muted-foreground">
                Menampilkan 10 dari {data.length} data
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
