import React, { useState, useEffect, useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import Badge from "../common/Badge";
import Card from "../common/Card";
import { cn } from "../../utils/cn";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

function FocusHandler({ shippers, focusId }) {
  const map = useMap();

  useEffect(() => {
    if (!focusId) return;

    const shipperId = typeof focusId === 'object' ? focusId.id : focusId;
    const shipper = shippers.find((s) => s.id === shipperId);
    
    if (shipper) {
      const lat = parseFloat(shipper.lat);
      const lng = parseFloat(shipper.lng);
      
      if (!isNaN(lat) && !isNaN(lng)) {
        map.flyTo([lat, lng], 15, { duration: 1 });
      }
    }
  }, [focusId, shippers, map]);

  return null;
}

function ShipperMap({ shippers = [], focusId }) {
  const [filter, setFilter] = useState("all"); // 'all', 'available', 'delivering'
  const [mapCenter, setMapCenter] = useState([10.762622, 106.660172]);
  
  const validShippers = useMemo(() => {
    if (!Array.isArray(shippers)) return [];
    return shippers.filter((s) => {
      if (!s) return false;
      const lat = parseFloat(s.lat);
      const lng = parseFloat(s.lng);
      return !isNaN(lat) && !isNaN(lng);
    });
  }, [shippers]);

  const filteredShippers = useMemo(() => {
    return filter === "all"
      ? validShippers
      : validShippers.filter((s) => s.status === filter);
  }, [validShippers, filter]);

  useEffect(() => {
    if (focusId) {
      const shipperId = typeof focusId === 'object' ? focusId.id : focusId;
      const shipper = shippers.find(s => s.id === shipperId);
      const lat = parseFloat(shipper?.lat);
      const lng = parseFloat(shipper?.lng);
      
      if (!isNaN(lat) && !isNaN(lng)) {
        setMapCenter([lat, lng]);
      }
    } else if (validShippers.length > 0) {
      const first = validShippers[0];
      const lat = parseFloat(first.lat);
      const lng = parseFloat(first.lng);
      if (!isNaN(lat) && !isNaN(lng)) {
        setMapCenter([lat, lng]);
      }
    }
  }, [shippers, focusId, validShippers]);

  const createCustomIcon = (status) => {
    const color = status === "delivering" ? "#FFD700" : "#38BDF8";
    return L.divIcon({
      className: "custom-icon",
      html: `<div style="background-color: ${color}; width: 16px; height: 16px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 5px rgba(0,0,0,0.5);"></div>`,
      iconSize: [20, 20],
    });
  };

  const deliveringCount = shippers.filter(
    (s) => s.status === "delivering"
  ).length;
  const availableCount = shippers.filter(
    (s) => s.status === "available"
  ).length;

  return (
    <Card className="overflow-hidden mb-6" noPadding>
      <div className="p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <Badge variant="primary" className="mb-1">Vận chuyển</Badge>
            <h3 className="text-xl font-black text-text-primary uppercase tracking-tighter">
              Bản đồ Shipper
            </h3>
          </div>
          <div className="flex bg-bg-subtle dark:bg-white/5 p-1 rounded-2xl border border-border/40 dark:border-dark-border/40 backdrop-blur-sm">
            {[
              { id: 'all', label: 'Tất cả', count: shippers.length },
              { id: 'available', label: 'Sẵn sàng', count: availableCount },
              { id: 'delivering', label: 'Đang giao', count: deliveringCount },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilter(tab.id)}
                className={cn(
                  "px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300",
                  filter === tab.id
                    ? "bg-white dark:bg-dark-card text-primary shadow-soft-md scale-[1.05]"
                    : "text-text-tertiary hover:text-text-primary"
                )}
              >
                {tab.label} ({tab.count})
              </button>
            ))}
          </div>
        </div>

        <div className="relative h-80 bg-bg-subtle/30 dark:bg-white/[0.02] rounded-[2rem] overflow-hidden mb-6 border border-border/40 dark:border-dark-border/40 shadow-inner-lg">
          <MapContainer
            center={mapCenter}
            zoom={13}
            style={{ height: "100%", width: "100%", zIndex: 0 }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            
            <FocusHandler shippers={shippers} focusId={focusId} />
            
            {filteredShippers.map((shipper) => (
              <Marker
                key={shipper.id}
                position={[parseFloat(shipper.lat), parseFloat(shipper.lng)]}
                icon={createCustomIcon(shipper.status)}
              >
                <Popup>
                  <div className="p-1 text-text-primary">
                    <strong className="text-xs uppercase font-black">{shipper.name}</strong>
                    <p className="text-[10px] mt-1 font-bold">SĐT: {shipper.phoneNumber}</p>
                    <p className="text-[10px] font-bold italic opacity-70">Địa chỉ: {shipper.address}</p>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>

        <div className="bg-bg-subtle/50 dark:bg-white/5 rounded-2xl p-4 border border-border/40 dark:border-dark-border/40 flex flex-wrap justify-center gap-6">
          <div className="flex items-center gap-x-2">
            <div className="size-2 rounded-full bg-primary shadow-sm shadow-primary/20"></div>
            <span className="text-[10px] font-black text-text-tertiary uppercase tracking-widest">
              Sẵn sàng: <span className="text-text-primary">{availableCount}</span>
            </span>
          </div>
          <div className="flex items-center gap-x-2">
            <div className="size-2 rounded-full bg-accent shadow-sm shadow-accent/20"></div>
            <span className="text-[10px] font-black text-text-tertiary uppercase tracking-widest">
              Đang giao: <span className="text-text-primary">{deliveringCount}</span>
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
}

export default ShipperMap;
