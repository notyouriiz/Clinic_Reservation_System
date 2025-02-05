import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Reservasi from "./pages/Reservasi"; // Impor halaman Reservasi
import RiwayatReservasi from "./pages/RiwayatReservasi"; // Impor halaman RiwayatReservasi
import Result from "./pages/Result"; // Impor halaman Result
import Dashboard from "./pages/Dashboard"; // Impor halaman Dashboard jika ada
import Login from "./pages/Login"; // Impor halaman Login jika ada
import Register from "./pages/Register"; // Impor halaman Register jika ada

function App() {
  return (
    <Router>
      <Routes>
        {/* Routing untuk halaman-halaman */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/reservasi" element={<Reservasi />} />
        <Route path="/riwayat-reservasi" element={<RiwayatReservasi />} />
        <Route path="/result" element={<Result />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Halaman default jika tidak ada yang cocok */}
        <Route path="/" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;
