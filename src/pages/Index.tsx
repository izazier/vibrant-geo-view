import { useState, useMemo, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import HomePage from '@/components/HomePage';
import MapView from '@/components/MapView';
import DashboardView from '@/components/DashboardView';
import MethodPage from '@/components/MethodPage';
import InfoPage from '@/components/InfoPage';
import { KECAMATAN_LIST, BankSampah } from '@/data/types';

type Page = 'home' | 'map' | 'dashboard' | 'method' | 'info';

export default function Index() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [bankSampahData, setBankSampahData] = useState<BankSampah[]>([]);
  const [filters, setFilters] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    KECAMATAN_LIST.forEach(kec => {
      initial[kec] = true;
    });
    return initial;
  });

  useEffect(() => {
    fetch('/data/banksampah.json')
      .then(res => res.json())
      .then(data => setBankSampahData(data))
      .catch(err => console.error('Error loading data:', err));
  }, []);

  const totalLocations = useMemo(() => {
    return bankSampahData.length;
  }, [bankSampahData]);

  const handleNavigate = (page: Page) => {
    setCurrentPage(page);
    setSidebarOpen(false);
  };

  const handleFilterChange = (kecamatan: string, checked: boolean) => {
    setFilters(prev => ({
      ...prev,
      [kecamatan]: checked
    }));
  };

  return (
    <div className="h-full w-full relative">
      {/* Sidebar - always visible but positioned */}
      {currentPage !== 'home' && (
        <Sidebar
          currentPage={currentPage}
          onNavigate={handleNavigate}
          isOpen={sidebarOpen}
          onToggle={() => setSidebarOpen(!sidebarOpen)}
          filters={filters}
          onFilterChange={handleFilterChange}
          totalLocations={totalLocations}
        />
      )}

      {/* Main Content */}
      <main className={`h-full w-full ${currentPage !== 'home' ? 'lg:pl-80' : ''}`}>
        {currentPage === 'home' && (
          <HomePage
            onNavigateToMap={() => handleNavigate('map')}
            onNavigateToMethod={() => handleNavigate('method')}
            onNavigateToDashboard={() => handleNavigate('dashboard')}
          />
        )}

        {currentPage === 'map' && (
          <MapView filters={filters} />
        )}

        {currentPage === 'dashboard' && (
          <DashboardView data={bankSampahData} />
        )}
      </main>

      {/* Overlay Pages */}
      {currentPage === 'method' && (
        <MethodPage onClose={() => handleNavigate('dashboard')} />
      )}

      {currentPage === 'info' && (
        <InfoPage onClose={() => handleNavigate('dashboard')} />
      )}
    </div>
  );
}
