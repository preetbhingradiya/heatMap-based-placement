import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet.heat";
import "leaflet/dist/leaflet.css";

type Props = {
  uploadedPoints: number[][]; // e.g. [[lat, lng], ...]
};

const MainMap = ({ uploadedPoints }: Props) => {
  const mapRef = useRef<L.Map | null>(null);
  const heatLayerRef = useRef<any>(null);

  useEffect(() => {
    if (mapRef.current) return; // Prevent re-initializing

    const map = L.map("map").setView([21.2467, 72.817], 13);
    mapRef.current = map;

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(map);

    // Get user's location
    map.whenReady(() => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((pos) => {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;

          map.setView([lat, lng], 14);
          L.marker([lat, lng])
            .addTo(map)
            .bindPopup("You are here.")
            .openPopup();

          // Add to heat layer
          heatLayerRef.current?.addLatLng([lat, lng]);
        });
      }
    });

    // Initialize heat layer with default points
    const defaultPoints: [number, number, number?][] = [
      [21.2468, 72.8171, 0.5],
      [21.247, 72.8168, 0.7],
    ];

    heatLayerRef.current = (L as any).heatLayer(defaultPoints, {
      radius: 25,
      blur: 15,
      maxZoom: 17,
    }).addTo(map);
  }, []);

  // Update heat layer when uploadedPoints change
  useEffect(() => {
    if (uploadedPoints.length > 0 && heatLayerRef.current) {
      uploadedPoints.forEach((pt) => {
        heatLayerRef.current.addLatLng(pt);
      });
    }
  }, [uploadedPoints]);

  return <div id="map" style={{ height: "100vh", width: "100%" }} />;
};

export default MainMap;
