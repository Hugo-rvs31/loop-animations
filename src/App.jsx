import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import BallsCircle from "./pages/BallsCircle";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="balls-circle" element={<BallsCircle />} />
      <Route path="*" element={<Home />} />
    </Routes>
  );
}

export default App;
