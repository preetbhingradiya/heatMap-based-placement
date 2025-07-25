// import { useEffect, useRef, useState } from "react";
// import L from "leaflet";
// import "leaflet.heat";
// import "leaflet/dist/leaflet.css";

// const ZoneHeatmap = () => {
//   const mapRef = useRef<L.Map | null>(null);
//   const heatRef = useRef<L.HeatLayer | null>(null);
//   const [selectedZone, setSelectedZone] = useState<number>(1); // default: Katargam

//   const fetchZoneHeatmap = async (zoneId: number) => {
//     const res = await fetch(`http://localhost:5000/heatmap/${zoneId}`);
//     const data = await res.json(); // [{ point: "POINT(...)", distance_in_degrees: ... }]

//     // Parse POINT string into [lat, lng]
//     return data
//       // Optional: filter by distance (e.g., within 0.03 degrees ~ 3km)
//       .filter((pt: any) => pt.distance_in_degrees <= 0.03)
//       .map((pt: any) => {
//         const match = pt.point.match(/POINT\(([-\d.]+) ([-\d.]+)\)/);
//         if (!match) return null;

//         const lng = parseFloat(match[1]);
//         const lat = parseFloat(match[2]);

//         return [lat, lng]; // Leaflet expects [lat, lng]
//       })
//       .filter(Boolean); // remove nulls
//   };

//   const loadHeatmap = async (zoneId: number) => {
//     const points = await fetchZoneHeatmap(zoneId);

//     if (heatRef.current) {
//       heatRef.current.remove(); // remove old heat layer
//     }

//     // @ts-ignore: Leaflet.heat type is not included in Leaflet by default
//     const newLayer = L.heatLayer(points, { radius: 25 }).addTo(mapRef.current!);
//     heatRef.current = newLayer;
//   };

//   useEffect(() => {
//     const map = L.map("map").setView([21.2467, 72.8225], 13);
//     mapRef.current = map;

//     L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
//       attribution: "&copy; OpenStreetMap contributors",
//     }).addTo(map);

//     loadHeatmap(selectedZone);

//     return () => {
//       map.remove();
//     };
//   }, []);

//   useEffect(() => {
//     if (mapRef.current) {
//       loadHeatmap(selectedZone);
//     }
//   }, [selectedZone]);

//   return (
//     <>
//       <select
//         style={{ position: "absolute", zIndex: 1000, top: 10, left: 10 }}
//         onChange={(e) => setSelectedZone(parseInt(e.target.value))}
//         value={selectedZone}
//       >
//         <option value={1}>Katargam</option>
//         <option value={2}>Varachha</option>
//         <option value={3}>Adajan</option>
//         <option value={4}>Udhna</option>
//       </select>
//       <div id="map" style={{ height: "100vh", width: "100%" }} />
//     </>
//   );
// };

// export default ZoneHeatmap;


// ZoneHeatmap.tsx
import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet.heat";
import "leaflet/dist/leaflet.css";

type Props = {
  uploadedPoints: number[][];
};

const ZoneHeatmap = ({ uploadedPoints }: Props) => {
  const mapRef = useRef<L.Map | null>(null);
  const zoneHeatRef = useRef<L.HeatLayer | null>(null);
  const uploadHeatRef = useRef<L.HeatLayer | null>(null);
  const [selectedZone, setSelectedZone] = useState<number>(1); // default zone

  const fetchZoneHeatmap = async (zoneId: number) => {
    try {
      const res = await fetch(`http://localhost:5000/user/heatmap/${zoneId}`);
      const data = await res.json();

      return data
        .filter((pt: any) => pt.distance_in_degrees <= 0.03)
        .map((pt: any) => {
          const match = pt.point.match(/POINT\(([-\d.]+) ([-\d.]+)\)/);
          if (!match) return null;
          const lng = parseFloat(match[1]);
          const lat = parseFloat(match[2]);
          return [lat, lng]; // [lat, lng]
        })
        .filter(Boolean);
    } catch (err) {
      console.error("Zone heatmap fetch error", err);
      return [];
    }
  };

  const loadZoneHeatmap = async (zoneId: number) => {
    const points = await fetchZoneHeatmap(zoneId);

    if (zoneHeatRef.current) {
      zoneHeatRef.current.remove();
    }

    // @ts-ignore
    const layer = L.heatLayer(points, {
      radius: 25,
      blur: 15,
      maxZoom: 17,
      gradient: { 0.4: 'blue', 0.65: 'lime', 1: 'red' }
    }).addTo(mapRef.current!);

    zoneHeatRef.current = layer;
  };

  const loadUploadedHeatmap = () => {
    if (!mapRef.current) return;

    if (uploadHeatRef.current) {
      uploadHeatRef.current.remove();
    }

    if (uploadedPoints.length > 0) {
      // @ts-ignore
      const layer = L.heatLayer(uploadedPoints, {
        radius: 25,
        blur: 15,
        maxZoom: 17,
        gradient: { 0.4: 'cyan', 0.7: 'yellow', 1: 'red' }
      }).addTo(mapRef.current!);

      uploadHeatRef.current = layer;
    }
  };

  useEffect(() => {
    const map = L.map("map").setView([21.2467, 72.8225], 13);
    mapRef.current = map;

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(map);

    loadZoneHeatmap(selectedZone);
    loadUploadedHeatmap();

    return () => {
      map.remove();
    };
  }, []);

  useEffect(() => {
    if (mapRef.current) {
      loadZoneHeatmap(selectedZone);
    }
  }, [selectedZone]);

  useEffect(() => {
    loadUploadedHeatmap();
  }, [uploadedPoints]);

  return (
    <>
      <select
        style={{ position: "absolute", zIndex: 1000, top: 10, left: 10 }}
        onChange={(e) => setSelectedZone(parseInt(e.target.value))}
        value={selectedZone}
      >
        <option value={1}>Katargam</option>
        <option value={2}>Varachha</option>
        <option value={3}>Adajan</option>
        <option value={4}>Udhna</option>
      </select>
      <div id="map" style={{ height: "100vh", width: "100%" }} />
    </>
  );
};

export default ZoneHeatmap;
