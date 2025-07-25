import { useState } from "react";

const FileUploader = ({ onUploadSuccess }: { onUploadSuccess: (data: any) => void }) => {
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("http://localhost:5000/user/upload", {
      method: "POST",
      body: formData,
    });

    const result = await res.json();
          const parsedPoints = result
        .map((pt: any) => {
          const match = pt.point.match(/POINT\(([-\d.]+) ([-\d.]+)\)/);
          if (!match) return null;
          const lng = parseFloat(match[1]);
          const lat = parseFloat(match[2]);
          return [lat, lng];
        })
        .filter(Boolean);

      onUploadSuccess(parsedPoints);
    // onUploadSuccess(result); // pass parsed heatmap data
  };

  return (
    <div style={{ position: "absolute", top: 10, left: 10, zIndex: 1000 }}>
      <input type="file" accept=".csv,.geojson" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload</button>
    </div>
  );
};

export default FileUploader;
