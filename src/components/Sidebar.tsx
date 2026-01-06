import { Home, Map, BookOpen, Info, ChevronLeft, Menu, LayoutDashboard } from 'lucide-react';
import { KECAMATAN_LIST, formatKecamatan } from '@/data/types';

interface SidebarProps {
  currentPage: 'home' | 'map' | 'dashboard' | 'method' | 'info';
  onNavigate: (page: 'home' | 'map' | 'dashboard' | 'method' | 'info') => void;
  isOpen: boolean;
  onToggle: () => void;
  filters: Record<string, boolean>;
  onFilterChange: (kecamatan: string, checked: boolean) => void;
  totalLocations: number;
}

export default function Sidebar({ 
  currentPage, 
  onNavigate, 
  isOpen, 
  onToggle,
  filters,
  onFilterChange,
  totalLocations
}: SidebarProps) {
  const navItems = [
    { id: 'home' as const, icon: Home, label: 'Beranda' },
    { id: 'dashboard' as const, icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'map' as const, icon: Map, label: 'Peta & Data' },
    { id: 'method' as const, icon: BookOpen, label: 'Metodologi' },
    { id: 'info' as const, icon: Info, label: 'Tentang Proyek' },
  ];

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={onToggle}
        className="fixed top-4 left-4 z-50 p-3 glass-card lg:hidden"
        aria-label="Toggle menu"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-80 glass-sidebar z-40 flex flex-col transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Header */}
        <div className="p-6 border-b border-sidebar-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center overflow-hidden">
                {/* PERUBAHAN ADA DI SINI */}
                <img 
                  src="/logo.png" 
                  alt="Logo SIG" 
                  className="w-full h-full object-contain p-2" 
                />
              </div>
              <div>
                <h1 className="text-lg font-bold text-sidebar-foreground">SIG Bank Sampah</h1>
                <span className="text-xs text-muted-foreground uppercase tracking-wide">
                  Kota Pekanbaru
                </span>
              </div>
            </div>
            <button
              onClick={onToggle}
              className="p-2 rounded-lg hover:bg-muted lg:hidden"
              aria-label="Close menu"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto p-4">
          <p className="text-xs uppercase text-muted-foreground font-semibold tracking-wider mb-3 px-2">
            Navigasi Utama
          </p>
          <nav className="space-y-1">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`nav-link w-full ${currentPage === item.id ? 'active' : ''}`}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
              </button>
            ))}
          </nav>

          {/* Stats Widget */}
          <div className="mt-6 p-4 rounded-xl bg-muted/50">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs uppercase text-muted-foreground font-semibold tracking-wider">
                Ringkasan Data
              </p>
              <span className="badge-live">Live</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="stat-card">
                <strong>{totalLocations}</strong>
                <span>Titik Lokasi</span>
              </div>
              <div className="stat-card">
                <strong>4</strong>
                <span>Kecamatan</span>
              </div>
            </div>
          </div>

          {/* Filter Section */}
          {currentPage === 'map' && (
            <div className="mt-6">
              <p className="text-xs uppercase text-muted-foreground font-semibold tracking-wider mb-3 px-2">
                Filter Kecamatan
              </p>
              <div className="space-y-2">
                {KECAMATAN_LIST.map(kec => (
                  <label key={kec} className="filter-checkbox">
                    <input
                      type="checkbox"
                      checked={filters[kec] ?? true}
                      onChange={(e) => onFilterChange(kec, e.target.checked)}
                      className="w-4 h-4 rounded border-border text-primary focus:ring-primary"
                    />
                    <span className="filter-label text-sm">{formatKecamatan(kec)}</span>
                  </label>
                ))}
              </div>

              {/* Volume Legend */}
              <div className="mt-6">
                <p className="text-xs uppercase text-muted-foreground font-semibold tracking-wider mb-3 px-2">
                  Legenda Volume
                </p>
                <div className="space-y-2 px-2">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="w-4 h-4 rounded bg-success"></span>
                    <span>&lt; 100 kg/minggu</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="w-4 h-4 rounded bg-warning"></span>
                    <span>100 - 500 kg/minggu</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="w-4 h-4 rounded bg-danger"></span>
                    <span>&gt; 500 kg/minggu</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-sidebar-border">
          <p className="text-xs text-muted-foreground text-center">
            © 2026 SIG Bank Sampah Pekanbaru
          </p>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-background/50 backdrop-blur-sm z-30 lg:hidden"
          onClick={onToggle}
        />
      )}
    </>
  );
}