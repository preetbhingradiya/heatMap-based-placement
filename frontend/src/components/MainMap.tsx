
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
//       [21.247, 72.8168, 0.7],
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
//       [21.247, 72.8168, 0.7],
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

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet.heat";
import "leaflet/dist/leaflet.css";

type Props = {
  uploadedPoints: [number, number][];
};

const MainMap = ({ uploadedPoints }: Props) => {
  const mapRef = useRef<L.Map | null>(null);
  const heatLayerRef = useRef<any>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const activePolylineRef = useRef<L.Polyline | null>(null);
  const fadedPolylineRef = useRef<L.Polyline | null>(null);

  const allPointsRef = useRef<[number, number][]>([]);
  const recentPointsRef = useRef<[number, number, number][]>([]);

  // Reverse geocode using OpenStreetMap Nominatim
  const fetchLocationName = async (lat: number, lng: number): Promise<string> => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`
      );
      const data = await response.json();
      return data.display_name || "Unknown location";
    } catch (err) {
      return "Unknown location";
    }
  };

  const updateMapWithPoints = (points: [number, number][]) => {
    allPointsRef.current = points;

    const recent = points.slice(-6);
    const faded = points.slice(0, -6);

    fadedPolylineRef.current?.setLatLngs(faded);
    activePolylineRef.current?.setLatLngs(recent);

    // Update heatmap
    recent.forEach(([lat, lng]) => {
      recentPointsRef.current.push([lat, lng, 1.0]);
    });
    if (recentPointsRef.current.length > 6) {
      recentPointsRef.current.splice(0, recentPointsRef.current.length - 6);
    }

    const fadedHeatPoints = recentPointsRef.current.map((pt, idx, arr) =>
      idx === arr.length - 1 ? pt : [pt[0], pt[1], 0.3]
    );
    heatLayerRef.current.setLatLngs(fadedHeatPoints);
  };

  useEffect(() => {
    if (mapRef.current) return;

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const currentLatLng: [number, number] = [
          pos.coords.latitude,
          pos.coords.longitude,
        ];

        const map = L.map("map").setView(currentLatLng, 16);
        mapRef.current = map;

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: "&copy; OpenStreetMap contributors",
        }).addTo(map);

        // Heatmap layer
        heatLayerRef.current = (L as any).heatLayer([], {
          radius: 25,
          blur: 15,
          maxZoom: 17,
        }).addTo(map);

        // Marker with popup
        const locationName = await fetchLocationName(currentLatLng[0], currentLatLng[1]);
        markerRef.current = L.marker(currentLatLng).addTo(map)
          .bindPopup(`You are here: ${locationName}`)
          .openPopup();

        // Polylines
        fadedPolylineRef.current = L.polyline([], {
          color: "#4a90e2",
          weight: 2,
          opacity: 0.3,
        }).addTo(map);

        activePolylineRef.current = L.polyline([], {
          color: "blue",
          weight: 5,
          opacity: 1.0,
        }).addTo(map);

        // Store first point
        const path: [number, number][] = [currentLatLng];
        updateMapWithPoints(path);

        // Start watching user movement
        const watchId = navigator.geolocation.watchPosition(
          async (pos) => {
            const newLatLng: [number, number] = [
              pos.coords.latitude,
              pos.coords.longitude,
            ];

            path.push(newLatLng);

            updateMapWithPoints(path);
            map.setView(newLatLng, map.getZoom());

            markerRef.current?.setLatLng(newLatLng);

            const placeName = await fetchLocationName(newLatLng[0], newLatLng[1]);
            markerRef.current?.bindPopup(`You are here: ${placeName}`).openPopup();
          },
          (err) => {
            console.error("Tracking error:", err.message);
          },
          {
            enableHighAccuracy: true,
            maximumAge: 5000,
            timeout: 20000,
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

  // Add uploaded points as faded heat
  useEffect(() => {
    if (uploadedPoints.length > 0 && heatLayerRef.current) {
      uploadedPoints.forEach((pt) => {
        heatLayerRef.current.addLatLng([...pt, 0.3]);
      });
    }
  }, [uploadedPoints]);

  return <div id="map" style={{ height: "100vh", width: "100%" }} />;
};

export default MainMap;



// import { useEffect, useRef } from "react";
// import L from "leaflet";
// import "leaflet.heat";
// import "leaflet/dist/leaflet.css";

// type Props = {
//   uploadedPoints: [number, number][];
// };

// const MainMap = ({ uploadedPoints }: Props) => {
//   const mapRef = useRef<L.Map | null>(null);
//   const heatLayerRef = useRef<any>(null);
//   const markerRef = useRef<L.Marker | null>(null);
//   const activePolylineRef = useRef<L.Polyline | null>(null); // last 6 points
//   const fadedPolylineRef = useRef<L.Polyline | null>(null); // older points

//   const allPointsRef = useRef<[number, number][]>([]);
//   const recentPointsRef = useRef<[number, number, number][]>([]); // for heatmap

//   // Simulated "DB" with initial point
//   const dbRef = useRef<[number, number][]>([]);

//   const fetchFromMockDB = () => {
//     // In real app, replace with API call
//     return dbRef.current;
//   };

//   const addNewPointToMockDB = (lat: number, lng: number) => {
//     dbRef.current.push([lat, lng]);
//   };

//   const updateMapWithPoints = (points: [number, number][]) => {
//     allPointsRef.current = points;

//     const recent = points.slice(-6);
//     const faded = points.slice(0, -6);

//     fadedPolylineRef.current?.setLatLngs(faded);
//     activePolylineRef.current?.setLatLngs(recent);

//     // Update heatmap
//     recent.forEach(([lat, lng]) => {
//       recentPointsRef.current.push([lat, lng, 1.0]);
//     });
//     if (recentPointsRef.current.length > 6) {
//       recentPointsRef.current.splice(0, recentPointsRef.current.length - 6);
//     }

//     const fadedHeatPoints = recentPointsRef.current.map((pt, idx, arr) =>
//       idx === arr.length - 1 ? pt : [pt[0], pt[1], 0.3]
//     );

//     heatLayerRef.current.setLatLngs(fadedHeatPoints);
//   };

//   useEffect(() => {
//     if (mapRef.current) return;

//     navigator.geolocation.getCurrentPosition(
//       (pos) => {
//         const currentLatLng: [number, number] = [
//           pos.coords.latitude,
//           pos.coords.longitude,
//         ];
//         dbRef.current.push(currentLatLng); // Add initial point to DB

//         const map = L.map("map").setView(currentLatLng, 13);
//         mapRef.current = map;

//         L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
//           attribution: "&copy; OpenStreetMap contributors",
//         }).addTo(map);

//         // Heatmap
//         heatLayerRef.current = (L as any).heatLayer([], {
//           radius: 25,
//           blur: 15,
//           maxZoom: 17,
//         }).addTo(map);

//         // Marker
//         markerRef.current = L.marker(currentLatLng).addTo(map).bindPopup("You are here").openPopup();

//         // Polylines
//         fadedPolylineRef.current = L.polyline([], {
//           color: "#4a90e2",
//           weight: 2,
//           opacity: 0.3,
//         }).addTo(map);

//         activePolylineRef.current = L.polyline([], {
//           color: "blue",
//           weight: 5,
//           opacity: 1.0,
//         }).addTo(map);

//         // Simulate user movement every 30 sec
//         const moveInterval = setInterval(() => {
//           const last = dbRef.current[dbRef.current.length - 1];
//           const newLat = last[0] + (Math.random() - 0.5) * 0.01;
//           const newLng = last[1] + (Math.random() - 0.5) * 0.01;
//           addNewPointToMockDB(newLat, newLng);
//         }, 30000); // Simulate movement

//         // Poll DB every 1 min
//         const syncInterval = setInterval(() => {
//           const allPoints = fetchFromMockDB();
//           if (allPoints.length > 0) {
//             const currentPos = allPoints[allPoints.length - 1];
//             markerRef.current?.setLatLng(currentPos);
//             map.setView(currentPos, 14);
//             updateMapWithPoints(allPoints);
//           }
//         }, 60000);

//         // Initial update
//         updateMapWithPoints([currentLatLng]);

//         return () => {
//           clearInterval(syncInterval);
//           clearInterval(moveInterval);
//           map.remove();
//         };
//       },
//       (err) => {
//         alert("Geolocation failed: " + err.message);
//       }
//     );
//   }, []);

//   // Upload points to heatmap
//   useEffect(() => {
//     if (uploadedPoints.length > 0 && heatLayerRef.current) {
//       uploadedPoints.forEach((pt) => {
//         heatLayerRef.current.addLatLng([...pt, 0.3]); // faded
//       });
//     }
//   }, [uploadedPoints]);

//   return <div id="map" style={{ height: "100vh", width: "100%" }} />;
// };

// export default MainMap;