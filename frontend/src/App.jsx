import { Routes, Route } from "react-router-dom";
import StudentsPage from "./pages/StudentsPage";
import StudentDetailPage from "./pages/StudentDetailPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<StudentsPage />} />
      <Route path="/student/:id" element={<StudentDetailPage />} />
    </Routes>
  );
}

export default App;