import { useEffect } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.heat";

const MapView = () => {
  useEffect(() => {
    const map = L.map("map").setView([37.7749, -122.4194], 13); // Fallback location

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(map);

    // Sample heatmap data: [lat, lng, intensity]
    const heatPoints: [number, number, number?][] = [
      [37.775, -122.419, 0.5],
      [37.774, -122.418, 0.8],
      [37.776, -122.417, 0.6],
      [37.773, -122.421, 0.9],
    ];

    // Add the heat layer
    const heatLayer = (L as any).heatLayer(heatPoints, {
      radius: 25,
      blur: 15,
      maxZoom: 17,
    }).addTo(map);

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

          // Optional: Add user location to heatmap
          heatLayer.addLatLng([lat, lng]);
        });
      }
    });

    return () => {
      map.remove();
    };
  }, []);

  return <div id="map" style={{ height: "100vh", width: "100%" }} />;
};

export default MapView;
