import React, { useState, useEffect, useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

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
    const color = status === "delivering" ? "#FFD700" : "#00BFFF";
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
    <div className="bg-card shadow-card rounded-lg overflow-hidden mb-6">
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-textPrimary">
            Vị trí Shipper
          </h3>
          <div className="flex gap-x-2">
            <button
              onClick={() => setFilter("all")}
              className={`px-3 py-1 text-sm rounded-md ${
                filter === "all"
                  ? "gradient-bg text-white"
                  : "bg-gray-100 text-textSecondary"
              } hover:opacity-90 transition-opacity`}
            >
              Tất cả ({shippers.length})
            </button>
            <button
              onClick={() => setFilter("available")}
              className={`px-3 py-1 text-sm rounded-md ${
                filter === "available"
                  ? "gradient-bg text-white"
                  : "bg-gray-100 text-textSecondary"
              } hover:opacity-90 transition-opacity`}
            >
              Sẵn sàng ({availableCount})
            </button>
            <button
              onClick={() => setFilter("delivering")}
              className={`px-3 py-1 text-sm rounded-md ${
                filter === "delivering"
                  ? "gradient-bg text-white"
                  : "bg-gray-100 text-textSecondary"
              } hover:opacity-90 transition-opacity`}
            >
              Đang giao ({deliveringCount})
            </button>
          </div>
        </div>

        <div className="relative h-80 bg-gray-100 rounded-lg overflow-hidden mb-4">
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
                  <div>
                    <strong>{shipper.name}</strong>
                    <p>SĐT: {shipper.phoneNumber}</p>
                    <p>Trạng thái: {shipper.status === "delivering" ? "Đang giao" : "Sẵn sàng"}</p>
                    <p>Địa chỉ: {shipper.address}</p>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>

        <div className="bg-white rounded-md p-2 shadow-sm flex justify-center gap-x-6">
          <div className="flex items-center gap-x-2">
            <div className="size-3 bg-primary rounded-full"></div>
            <span className="text-xs text-textSecondary">
              Sẵn sàng ({availableCount})
            </span>
          </div>
          <div className="flex items-center gap-x-2">
            <div className="size-3 bg-accent rounded-full"></div>
            <span className="text-xs text-textSecondary">
              Đang giao ({deliveringCount})
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ShipperMap;