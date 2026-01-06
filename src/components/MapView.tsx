import { useEffect, useRef, useState } from 'react';
import { Map, View, Overlay, Feature } from 'ol';
import { Tile as TileLayer, Vector as VectorLayer, Heatmap as HeatmapLayer } from 'ol/layer';
import { OSM, Vector as VectorSource } from 'ol/source';
import { fromLonLat } from 'ol/proj';
import { Point } from 'ol/geom';
import { Style, Icon } from 'ol/style';
import { Thermometer, MapPin, X } from 'lucide-react';
import { BankSampah, getVolumeCategory, formatKecamatan, KECAMATAN_LIST } from '@/data/types';

interface MapViewProps {
  filters: Record<string, boolean>;
}

// SVG icons for trash can with different colors
function createTrashIcon(color: string): string {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="${color}" stroke="white" stroke-width="1">
      <path d="M3 6h18"/>
      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/>
      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
      <line x1="10" y1="11" x2="10" y2="17"/>
      <line x1="14" y1="11" x2="14" y2="17"/>
    </svg>
  `;
  return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
}

const VOLUME_COLORS = {
  low: '#22c55e',
  medium: '#eab308',
  high: '#ef4444',
};

const PEKANBARU_CENTER = fromLonLat([101.4478, 0.5333]);

export default function MapView({ filters }: MapViewProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<Map | null>(null);
  const vectorSourceRef = useRef<VectorSource | null>(null);
  const heatmapSourceRef = useRef<VectorSource | null>(null);
  const overlayRef = useRef<Overlay | null>(null);

  const [showHeatmap, setShowHeatmap] = useState(false);
  const [showMarkers, setShowMarkers] = useState(true);
  const [popupContent, setPopupContent] = useState<BankSampah | null>(null);
  const [bankSampahData, setBankSampahData] = useState<BankSampah[]>([]);

  // Load data
  useEffect(() => {
    fetch('/data/banksampah.json')
      .then(res => res.json())
      .then(data => setBankSampahData(data))
      .catch(err => console.error('Error loading data:', err));
  }, []);

  // Normalize kecamatan name to match our list
  const normalizeKecamatan = (kec: string): string => {
    const lower = kec.toLowerCase().trim();
    // Handle typos and variations
    if (lower.includes('tampan') || lower === 'panam') return 'tampan';
    if (lower.includes('tenayan') || lower === 'tenayanan raya') return 'tenayan raya';
    if (lower.includes('marpoyan')) return 'marpoyan damai';
    if (lower.includes('rumbai')) return 'rumbai';
    return lower;
  };

  // Filter data to only include the 4 kecamatan
  const filteredData = bankSampahData.filter(item => {
    const kec = normalizeKecamatan(item.Kecamatan);
    return KECAMATAN_LIST.includes(kec as any) && filters[kec] !== false;
  });

  // Initialize map
  useEffect(() => {
    if (!mapRef.current) return;

    // Create popup overlay
    const overlay = new Overlay({
      element: popupRef.current!,
      autoPan: {
        animation: { duration: 250 }
      },
      positioning: 'bottom-center',
      offset: [0, -10],
    });
    overlayRef.current = overlay;

    // Vector source for markers
    const vectorSource = new VectorSource();
    vectorSourceRef.current = vectorSource;

    // Heatmap source
    const heatmapSource = new VectorSource();
    heatmapSourceRef.current = heatmapSource;

    // Create map
    const map = new Map({
      target: mapRef.current,
      layers: [
        // Base layer
        new TileLayer({
          source: new OSM(),
        }),
        // Heatmap layer
        new HeatmapLayer({
          source: heatmapSource,
          blur: 15,
          radius: 10,
          weight: () => 0.5,
          visible: false,
          className: 'heatmap-layer',
        }),
        // Vector layer for markers
        new VectorLayer({
          source: vectorSource,
          style: (feature) => {
            const volumeCategory = feature.get('volumeCategory');
            const color = VOLUME_COLORS[volumeCategory as keyof typeof VOLUME_COLORS] || VOLUME_COLORS.low;
            
            return new Style({
              image: new Icon({
                src: createTrashIcon(color),
                scale: 1,
                anchor: [0.5, 1],
              }),
            });
          },
        }),
      ],
      view: new View({
        center: PEKANBARU_CENTER,
        zoom: 12,
        minZoom: 10,
        maxZoom: 18,
      }),
      overlays: [overlay],
    });

    mapInstanceRef.current = map;

    // Click handler for popups
    map.on('click', (evt) => {
      const feature = map.forEachFeatureAtPixel(evt.pixel, (f) => f);
      
      if (feature) {
        const data = feature.get('data') as BankSampah;
        if (data) {
          setPopupContent(data);
          overlay.setPosition(evt.coordinate);
        }
      } else {
        setPopupContent(null);
        overlay.setPosition(undefined);
      }
    });

    // Cursor style on hover
    map.on('pointermove', (evt) => {
      const hit = map.hasFeatureAtPixel(evt.pixel);
      map.getTargetElement().style.cursor = hit ? 'pointer' : '';
    });

    return () => {
      map.setTarget(undefined);
    };
  }, []);

  // Update features when filters change
  useEffect(() => {
    if (!vectorSourceRef.current || !heatmapSourceRef.current) return;

    vectorSourceRef.current.clear();
    heatmapSourceRef.current.clear();

    filteredData.forEach((item) => {
      const coords = fromLonLat([item.Longtitude, item.Lattitude]);
      const volumeCategory = getVolumeCategory(item["Volume Sampah Per Minggu"]);

      // Marker feature
      const markerFeature = new Feature({
        geometry: new Point(coords),
        data: item,
        volumeCategory,
      });
      vectorSourceRef.current!.addFeature(markerFeature);

      // Heatmap feature
      const heatmapFeature = new Feature({
        geometry: new Point(coords),
      });
      heatmapSourceRef.current!.addFeature(heatmapFeature);
    });

    // Close popup if current item is filtered out
    if (popupContent) {
      const stillVisible = filteredData.find(item => item.No === popupContent.No);
      if (!stillVisible) {
        setPopupContent(null);
        overlayRef.current?.setPosition(undefined);
      }
    }
  }, [filters, filteredData, popupContent]);

  // Toggle layer visibility
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    const layers = mapInstanceRef.current.getLayers();
    layers.forEach((layer) => {
      if (layer instanceof HeatmapLayer) {
        layer.setVisible(showHeatmap);
      }
      if (layer instanceof VectorLayer) {
        layer.setVisible(showMarkers);
      }
    });
  }, [showHeatmap, showMarkers]);

  const closePopup = () => {
    setPopupContent(null);
    overlayRef.current?.setPosition(undefined);
  };

  return (
    <div className="relative w-full h-full">
      {/* Map Container */}
      <div ref={mapRef} className="w-full h-full" />

      {/* Layer Controls */}
      <div className="absolute top-4 right-4 glass-card p-3 space-y-2">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Layer</p>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={showMarkers}
            onChange={(e) => setShowMarkers(e.target.checked)}
            className="w-4 h-4 rounded border-border text-primary focus:ring-primary"
          />
          <MapPin className="w-4 h-4" />
          <span className="text-sm">Marker</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={showHeatmap}
            onChange={(e) => setShowHeatmap(e.target.checked)}
            className="w-4 h-4 rounded border-border text-primary focus:ring-primary"
          />
          <Thermometer className="w-4 h-4" />
          <span className="text-sm">Heatmap</span>
        </label>
      </div>

      {/* Stats */}
      <div className="absolute bottom-4 right-4 glass-card px-4 py-2">
        <p className="text-sm">
          <span className="font-semibold">{filteredData.length}</span>
          <span className="text-muted-foreground"> titik ditampilkan</span>
        </p>
      </div>

      {/* Popup */}
      <div ref={popupRef} className="absolute">
        {popupContent && (
          <div className="glass-card p-4 min-w-[280px] max-w-[320px] -translate-x-1/2 mb-2">
            <div className="flex items-start justify-between gap-2 mb-3">
              <h3 className="font-semibold text-sm capitalize leading-tight">
                {popupContent["Nama Bank Sampah"]}
              </h3>
              <button
                onClick={closePopup}
                className="p-1 hover:bg-muted rounded flex-shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">Kecamatan:</span>
                <span className="font-medium">{formatKecamatan(popupContent.Kecamatan)}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">Volume:</span>
                <span className={`font-medium ${
                  getVolumeCategory(popupContent["Volume Sampah Per Minggu"]) === 'low' 
                    ? 'text-success' 
                    : getVolumeCategory(popupContent["Volume Sampah Per Minggu"]) === 'medium'
                    ? 'text-warning'
                    : 'text-danger'
                }`}>
                  {popupContent["Volume Sampah Per Minggu"]}
                </span>
              </div>
              
              <div>
                <span className="text-muted-foreground">Jenis Sampah:</span>
                <p className="font-medium mt-1 capitalize">{popupContent["Jenis Sampah Dominan"]}</p>
              </div>
              
              <div className="pt-2 border-t border-border text-xs text-muted-foreground">
                <p>Lat: {popupContent.Lattitude}, Lng: {popupContent.Longtitude}</p>
              </div>
            </div>
            
            {/* Arrow */}
            <div className="absolute left-1/2 -translate-x-1/2 bottom-0 translate-y-full">
              <div className="w-0 h-0 border-l-8 border-r-8 border-t-8 border-transparent border-t-card"></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
