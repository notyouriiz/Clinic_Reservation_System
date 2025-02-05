import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/navbar.css"; // Tambahkan styling untuk Glass Effect

const Navbar = () => {
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <nav className="navbar glass-effect">
      <div className="navbar-content">
        <h1 className="navbar-title">Clinic Essential</h1>
        <div className="navbar-buttons">
          <button onClick={() => handleNavigation("/dashboard")} className="navbar-btn">
            Dashboard
          </button>
          <button onClick={() => handleNavigation("/reservasi")} className="navbar-btn">
            Reservasi
          </button>
          <button onClick={() => handleNavigation("/riwayat")} className="navbar-btn">
            Riwayat Reservasi
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
