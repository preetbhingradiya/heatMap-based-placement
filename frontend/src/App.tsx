import { useState } from "react";
import "./App.css";
import MapView from "./components/MapView";
import FileUploader from "./components/FileUploader";
import Heatmap from "./components/Heatmap";
import MainMap from "./components/MainMap";

function App() {
  const [points, setPoints] = useState<number[][]>([]);
  return (
    <div className="App">
      {/* <MapView /> */}
      {/* <FileUploader onUploadSuccess={setPoints} /> */}
      {/* <Heatmap points={points} /> */}
      <FileUploader onUploadSuccess={setPoints} />
      <MainMap uploadedPoints={points}/>
    </div>
  );
}

export default App;
