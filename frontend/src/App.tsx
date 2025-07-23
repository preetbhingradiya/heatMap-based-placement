import { useState } from "react";
import "./App.css";
import FileUploader from "./components/FileUploader";
import MainMap from "./components/MainMap";

function App() {
  const [points, setPoints] = useState<number[][]>([]);
  return (
    <div className="App">
      <FileUploader onUploadSuccess={setPoints} />
      <MainMap uploadedPoints={points}/>
    </div>
  );
}

export default App;
