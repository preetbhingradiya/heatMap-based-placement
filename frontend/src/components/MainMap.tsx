// import { useEffect, useRef } from "react";
// import L from "leaflet";
// import "leaflet.heat";
// import "leaflet/dist/leaflet.css";

// type Props = {
//   uploadedPoints: number[][];
// };

// const MainMap = ({ uploadedPoints }: Props) => {
//   const mapRef = useRef<L.Map | null>(null);
//   const heatLayerRef = useRef<any>(null);
//   const markerRef = useRef<L.Marker | null>(null);

//   useEffect(() => {
//     if (mapRef.current) return;

//     const map = L.map("map").setView([21.2467, 72.817], 13);
//     mapRef.current = map;

//     L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
//       attribution: "&copy; OpenStreetMap contributors",
//     }).addTo(map);

//     // Add heatmap
//     const defaultPoints: [number, number, number?][] = [
//       [21.2468, 72.8171, 0.5],
//       [21.247, 72.8168, 0.8],
//     ];

//     heatLayerRef.current = (L as any).heatLayer(defaultPoints, {
//       radius: 25,
//       blur: 15,
//       maxZoom: 17,
//     }).addTo(map);

//     // Add initial marker at center
//     const initialLatLng: L.LatLngExpression = [21.2467, 72.817];
//     markerRef.current = L.marker(initialLatLng).addTo(map);

//     // Center map on user location
//     if (navigator.geolocation) {
//       navigator.geolocation.getCurrentPosition((pos) => {
//         const lat = pos.coords.latitude;
//         const lng = pos.coords.longitude;
//         const newPos: L.LatLngExpression = [lat, lng];
//         markerRef.current?.setLatLng(newPos);
//         map.setView(newPos, 14);
//         heatLayerRef.current?.addLatLng(newPos);
//       });
//     }
//   }, []);

//   // Add uploaded points to heatmap
//   useEffect(() => {
//     if (uploadedPoints.length > 0 && heatLayerRef.current) {
//       uploadedPoints.forEach((pt) => {
//         heatLayerRef.current.addLatLng(pt);
//       });
//     }
//   }, [uploadedPoints]);

//   // Randomly update marker position every 3 seconds
//   // useEffect(() => {
//   //   const interval = setInterval(() => {
//   //     const randomLat = 21.246 + Math.random() * 0.01;
//   //     const randomLng = 72.817 + Math.random() * 0.01;
//   //     const newPos: L.LatLngExpression = [randomLat, randomLng];

//   //     markerRef.current?.setLatLng(newPos);
//   //     heatLayerRef.current?.addLatLng(newPos);
//   //   }, 3000);

//   //   return () => clearInterval(interval);
//   // }, []);

//   return <div id="map" style={{ height: "100vh", width: "100%" }} />;
// };

// export default MainMap;

// 2

// import { useEffect, useRef } from "react";
// import L from "leaflet";
// import "leaflet.heat";
// import "leaflet/dist/leaflet.css";

// type Props = {
//   uploadedPoints: [number, number][]; // Correct type for uploaded points
// };

// const MainMap = ({ uploadedPoints }: Props) => {
//   const mapRef = useRef<L.Map | null>(null);
//   const heatLayerRef = useRef<any>(null);
//   const markerRef = useRef<L.Marker | null>(null);
//   const polylineRef = useRef<L.Polyline | null>(null); // Ref to store the polyline

//   useEffect(() => {
//     if (mapRef.current) return;

//     const map = L.map("map").setView([21.2467, 72.817], 13);
//     mapRef.current = map;

//     L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
//       attribution: "&copy; OpenStreetMap contributors",
//     }).addTo(map);

//     // Add heatmap with some default points
//     const defaultPoints: [number, number, number?][] = [
//       [21.2468, 72.8171, 0.5],
//       [21.247, 72.8168, 0.8],
//     ];

//     heatLayerRef.current = (L as any).heatLayer(defaultPoints, {
//       radius: 25,
//       blur: 15,
//       maxZoom: 17,
//     }).addTo(map);

//     // Add initial marker at center
//     const initialLatLng: L.LatLngExpression = [21.2467, 72.817];
//     markerRef.current = L.marker(initialLatLng).addTo(map);

//     // Initialize polyline
//     polylineRef.current = L.polyline([], { color: "blue", weight: 5 }).addTo(map);

//     // Function to handle location updates
//     const handleLocationUpdate = (pos: GeolocationPosition) => {
//       const lat = pos.coords.latitude;
//       const lng = pos.coords.longitude;
//       const newPos: L.LatLngExpression = [lat, lng];

//       // Update marker position
//       markerRef.current?.setLatLng(newPos);

//       // Update polyline by extending the previous path
//       if (polylineRef.current) {
//         const currentLatLngs = polylineRef.current.getLatLngs();
//         const newLatLngs = [...currentLatLngs, newPos];
//         polylineRef.current.setLatLngs(newLatLngs);
//       }

//       // Set map view to new location
//       map.setView(newPos, 14);

//       // Add the user's location to the heatmap
//       heatLayerRef.current?.addLatLng([lat, lng]);
//     };

//     // Try to get the user's location
//     if (navigator.geolocation) {
//       navigator.geolocation.watchPosition(
//         handleLocationUpdate,
//         (error) => {
//           console.error("Geolocation error:", error.message);
//           // Handle case where location access is denied
//           alert("Unable to retrieve your location. Using default location.");
//           map.setView([21.2467, 72.817], 13); // Fallback to the default location
//         },
//         {
//           enableHighAccuracy: true, // Attempt to get the most accurate position
//           maximumAge: 1000, // Refresh position every second
//         }
//       );
//     } else {
//       console.error("Geolocation is not supported by this browser.");
//       map.setView([21.2467, 72.817], 13); // Fallback to the default location
//     }
//   }, []); // Empty dependency array ensures this runs once when the component mounts

//   // Add uploaded points to the heatmap (always)
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

// "http://localhost:3000/user/set/location";
// http://localhost:3000/user/find/location


import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet.heat"; 
import "leaflet/dist/leaflet.css";
import { v4 as uuidv4 } from 'uuid';

type Props = {
  uploadedPoints: [number, number][];
}; 

const DEVICE_ID_KEY = "my_app_device_id";

export function getDeviceId(): string {
  let deviceId = localStorage.getItem(DEVICE_ID_KEY);
  if (!deviceId) {
    deviceId = uuidv4();
    localStorage.setItem(DEVICE_ID_KEY, deviceId);
  }
  return deviceId;
}

const MainMap = ({ uploadedPoints }: Props) => {
  const mapRef = useRef<L.Map | null>(null);
  const heatLayerRef = useRef<any>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const activePolylineRef = useRef<L.Polyline | null>(null);
  const fadedPolylineRef = useRef<L.Polyline | null>(null);

  const allPointsRef = useRef<[number, number][]>([]);
  const recentPointsRef = useRef<[number, number, number][]>([]);

  const pathRef = useRef<[number, number][]>([]); 
  const UUID = getDeviceId() // Replace with actual user ID from auth if needed

  const fetchLocationName = async (lat: number, lng: number): Promise<string> => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`
      );
      const data = await response.json();
      return data.address?.suburb || data.address?.neighbourhood || data.address?.road || data.display_name || "Unknown location";
    } catch {
      return "Unknown location";
    }
  };

  const sendLocationToBackend = async (lat: number, lng: number) => {
    try {
      await fetch("https://crazy-cars-cross.loca.lt/user/set/location", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: UUID,
          latitude: lat,
          longitude: lng,
        }),
      });
    } catch (err) {
      console.error("Failed to send location to backend:", err);
    }
  };

  const updateMapWithPoints = (points: [number, number][]) => {
    allPointsRef.current = points;

    const recent = points.slice(-6);
    const faded = points.slice(0, -6);

    fadedPolylineRef.current?.setLatLngs(faded);
    activePolylineRef.current?.setLatLngs(recent);

    // Heatmap
    recent.forEach(([lat, lng]) => {
      recentPointsRef.current.push([lat, lng, 1.0]);
    });
    if (recentPointsRef.current.length > 6) {
      recentPointsRef.current.splice(0, recentPointsRef.current.length - 6);
    }

    const fadedHeatPoints = recentPointsRef.current.map((pt, idx, arr) =>
      idx === arr.length - 1 ? pt : [pt[0], pt[1], 0.8]
    );
    heatLayerRef.current?.setLatLngs(fadedHeatPoints);
  };

  useEffect(() => {
    const loadUserPath = async () => {
      try {
        const res = await fetch(`https://crazy-cars-cross.loca.lt/user/find/location/${UUID}`);
        console.log("DATA", res);
        
        const data = await res.json();
        if (Array.isArray(data)) {
          const coords: [number, number][] = data.map((loc) => [loc.latitude, loc.longitude]);
          pathRef.current = coords;
        }
      } catch (err) {
        console.error("Failed to load saved path:", err);
      }
    };

    loadUserPath();
  }, []);

  useEffect(() => {
    if (mapRef.current) return;

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const currentLatLng: [number, number] = [
          pos.coords.latitude,
          pos.coords.longitude,
        ];

        if (pathRef.current.length === 0) {
          pathRef.current.push(currentLatLng);
        }

        const map = L.map("map").setView(currentLatLng, 16);
        mapRef.current = map;

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: "&copy; OpenStreetMap contributors",
        }).addTo(map);

        heatLayerRef.current = (L as any).heatLayer([], {
          radius: 25,
          blur: 15,
          maxZoom: 17,
        }).addTo(map);

        const locationName = await fetchLocationName(currentLatLng[0], currentLatLng[1]);
        markerRef.current = L.marker(currentLatLng)
          .addTo(map)
          .bindPopup(locationName)
          .openPopup();

        fadedPolylineRef.current = L.polyline([], {
          color: "#4a90e2",
          weight: 2,
          opacity: 0.8,
        }).addTo(map);

        activePolylineRef.current = L.polyline([], {
          color: "blue",
          weight: 5,
          opacity: 1.0,
        }).addTo(map);

        updateMapWithPoints(pathRef.current);

        const watchId = navigator.geolocation.watchPosition(
          async (pos) => {
            const newLatLng: [number, number] = [
              pos.coords.latitude,
              pos.coords.longitude,
            ];
            console.log("📍 New position received:", newLatLng);

            pathRef.current.push(newLatLng);
            updateMapWithPoints(pathRef.current);

            await sendLocationToBackend(newLatLng[0], newLatLng[1]);

            map.setView(newLatLng, map.getZoom());

            markerRef.current?.setLatLng(newLatLng);
            const placeName = await fetchLocationName(newLatLng[0], newLatLng[1]);
            markerRef.current?.bindPopup(placeName).openPopup();
          },
          (err) => {
            console.error("Geolocation error:", err.message);
          },
          {
            enableHighAccuracy: true,
            maximumAge: 0,
            timeout: 1000,
          }
        );

        return () => {
          navigator.geolocation.clearWatch(watchId);
          map.remove();
        };
      },
      (err) => {
        alert("Geolocation failed: " + err.message);
      }
    );
  }, []);

  useEffect(() => {
    if (uploadedPoints.length > 0 && heatLayerRef.current) {
      uploadedPoints.forEach((pt) => {
        heatLayerRef.current.addLatLng([...pt, 0.8]);
      });
    }
  }, [uploadedPoints]);

  return <div id="map" style={{ height: "100vh", width: "100%" }} />;
};

export default MainMap;