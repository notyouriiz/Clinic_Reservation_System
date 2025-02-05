import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../styles/result.css";

const Result = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const {
    reservationNumber,
    doctorName,
    reservationDate,
    reservationTime,
  } = location.state || {};

  if (!location.state) {
    return (
      <div className="result-container">
        <h2 className="result-title">Data Reservasi Tidak Ditemukan</h2>
        <p className="result-error">
          Maaf, data reservasi tidak ditemukan. Silakan kembali ke halaman
          reservasi untuk mencoba lagi.
        </p>
        <button
          className="btn-back"
          onClick={() => navigate("/reservasi")}
        >
          Kembali ke Halaman Reservasi
        </button>
      </div>
    );
  }

  return (
    <div className="result-container">
      <div className="result-card">
        <h2 className="result-title">Reservasi Berhasil!</h2>
        {reservationNumber ? (
          <div className="result-details">
            <p>
              <strong>Nomor Reservasi:</strong> {reservationNumber}
            </p>
            <p>
              <strong>Dokter:</strong> {doctorName}
            </p>
            <p>
              <strong>Tanggal:</strong> {reservationDate}
            </p>
            <p>
              <strong>Jam:</strong> {reservationTime}
            </p>
          </div>
        ) : (
          <p className="result-error">Nomor reservasi tidak tersedia.</p>
        )}
        <div className="result-buttons">
          <button
            className="btn-dashboard"
            onClick={() => navigate("/dashboard")}
          >
            Kembali ke Dashboard
          </button>
          <button
            className="btn-reservasi"
            onClick={() => navigate("/reservasi")}
          >
            Kembali ke Halaman Reservasi
          </button>
        </div>
      </div>
    </div>
  );
};

export default Result;
