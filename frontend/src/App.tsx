import { useState } from "react";
import "./App.css";
import FileUploader from "./components/FileUploader";
import MainMap from "./components/MainMap";
import ZoneHeatmap from "./components/ZoneHeatMap";

function App() {
  const [points, setPoints] = useState<number[][]>([]);
  return (
    <div className="App">
      {/* <FileUploader onUploadSuccess={setPoints} /> */}
      {/* <MainMap uploadedPoints={points}/> */}
      <FileUploader onUploadSuccess={setPoints} />
      <ZoneHeatmap uploadedPoints={points} />
    </div>
  );
}

export default App;
