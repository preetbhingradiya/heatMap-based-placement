// import { useEffect, useRef } from "react";
// import L from "leaflet";
// import "leaflet.heat";
// import "leaflet/dist/leaflet.css";

// type Props = {
//   uploadedPoints: number[][]; // e.g. [[lat, lng], ...]
// };

// const MainMap = ({ uploadedPoints }: Props) => {
//   const mapRef = useRef<L.Map | null>(null);
//   const heatLayerRef = useRef<any>(null);

//   useEffect(() => {
//     if (mapRef.current) return; // Prevent re-initializing

//     const map = L.map("map").setView([21.2467, 72.817], 13);
//     mapRef.current = map;

//     L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
//       attribution: "&copy; OpenStreetMap contributors",
//     }).addTo(map);

//     // Get user's location
//     map.whenReady(() => {
//       if (navigator.geolocation) {
//         navigator.geolocation.getCurrentPosition((pos) => {
//           const lat = pos.coords.latitude;
//           const lng = pos.coords.longitude;

//           map.setView([lat, lng], 14);
//           L.marker([lat, lng])
//             .addTo(map)
//             .bindPopup("You are here.")
//             .openPopup();

//           // Add to heat layer
//           heatLayerRef.current?.addLatLng([lat, lng]);
//         });
//       }
//     });

//     // Initialize heat layer with default points
//     const defaultPoints: [number, number, number?][] = [
//       [21.2468, 72.8171, 0.5],
//       [21.247, 72.8168, 0.7],
//     ];

//     heatLayerRef.current = (L as any).heatLayer(defaultPoints, {
//       radius: 25,
//       blur: 15,
//       maxZoom: 17,
//     }).addTo(map);
//   }, []);

//   // Update heat layer when uploadedPoints change
//   useEffect(() => {
//     if (uploadedPoints.length > 0 && heatLayerRef.current) {
//       uploadedPoints.forEach((pt) => {
//         heatLayerRef.current.addLatLng(pt);
//       });
//     }
//   }, [uploadedPoints]);

//   return <div id="map" style={{ height: "100vh", width: "100%" }} />;
// };

// export default MainMap;
import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet.heat";
import "leaflet/dist/leaflet.css";

type Props = {
  uploadedPoints: number[][];
};

const MainMap = ({ uploadedPoints }: Props) => {
  const mapRef = useRef<L.Map | null>(null);
  const heatLayerRef = useRef<any>(null);
  const markerRef = useRef<L.Marker | null>(null);

  useEffect(() => {
    if (mapRef.current) return;

    const map = L.map("map").setView([21.2467, 72.817], 13);
    mapRef.current = map;

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(map);

    // Add heatmap
    const defaultPoints: [number, number, number?][] = [
      [21.2468, 72.8171, 0.5],
      [21.247, 72.8168, 0.7],
    ];

    heatLayerRef.current = (L as any).heatLayer(defaultPoints, {
      radius: 25,
      blur: 15,
      maxZoom: 17,
    }).addTo(map);

    // Add initial marker at center
    const initialLatLng: L.LatLngExpression = [21.2467, 72.817];
    markerRef.current = L.marker(initialLatLng).addTo(map);

    // Center map on user location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        const newPos: L.LatLngExpression = [lat, lng];
        markerRef.current?.setLatLng(newPos);
        map.setView(newPos, 14);
        heatLayerRef.current?.addLatLng(newPos);
      });
    }
  }, []);

  // Add uploaded points to heatmap
  useEffect(() => {
    if (uploadedPoints.length > 0 && heatLayerRef.current) {
      uploadedPoints.forEach((pt) => {
        heatLayerRef.current.addLatLng(pt);
      });
    }
  }, [uploadedPoints]);

  // Randomly update marker position every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      const randomLat = 21.246 + Math.random() * 0.01;
      const randomLng = 72.817 + Math.random() * 0.01;
      const newPos: L.LatLngExpression = [randomLat, randomLng];

      markerRef.current?.setLatLng(newPos);
      heatLayerRef.current?.addLatLng(newPos);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return <div id="map" style={{ height: "100vh", width: "100%" }} />;
};

export default MainMap;
