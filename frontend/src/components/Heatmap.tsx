import { useEffect } from "react";
import L from "leaflet";
import "leaflet.heat";
import "leaflet/dist/leaflet.css";

const Heatmap = ({ points }: { points: number[][] }) => {
  useEffect(() => {
    const map = L.map("map").setView([21.2467, 72.817], 13);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(map);

    if (points.length > 0) {
      // @ts-ignore
      L.heatLayer(points, { radius: 25 }).addTo(map);
    }

    return () => {
      map.remove();
    };
  }, [points]);

  return <div id="map" style={{ height: "100vh", width: "100%" }} />;
};

export default Heatmap;
