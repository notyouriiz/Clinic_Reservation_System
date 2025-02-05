import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { auth } from "../firebaseConfig";
import "../styles/riwayatReservasi.css"; // Tambahkan file CSS untuk styling

const RiwayatReservasi = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const fetchReservations = async () => {
    try {
      const user = auth.currentUser;
      if (!user) {
        setError("Anda harus login untuk melihat riwayat reservasi.");
        setLoading(false);
        return;
      }

      const querySnapshot = await getDocs(collection(db, "reservations"));
      const reservationsData = [];

      querySnapshot.forEach((docSnapshot) => {
        const reservationData = docSnapshot.data();
        if (reservationData.userId === user.uid) {
          reservationsData.push(reservationData);
        }
      });

      // Urutkan berdasarkan waktu perekaman
      reservationsData.sort((a, b) => {
        const dateA = new Date(a.createdAt || 0);
        const dateB = new Date(b.createdAt || 0);
        return dateB - dateA;
      });

      setReservations(reservationsData);
      setLoading(false);
    } catch (e) {
      console.error("Error getting documents: ", e);
      setError("Terjadi kesalahan saat memuat riwayat reservasi.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  return (
    <div className="riwayat-container">
      <div className="button-container">
        <button className="btn" onClick={() => navigate("/dashboard")}>
          Kembali ke Dashboard
        </button>
        <button className="btn" onClick={() => navigate("/reservasi")}>
          Buat Reservasi Baru
        </button>
      </div>

      <h2>Riwayat Reservasi</h2>

      {loading ? (
        <p>Loading reservations...</p>
      ) : error ? (
        <p className="error-message">{error}</p>
      ) : reservations.length === 0 ? (
        <p className="no-reservation">Anda belum melakukan reservasi.</p>
      ) : (
        <table className="reservation-table">
          <thead>
            <tr>
              <th>No.</th>
              <th>Nomor Reservasi</th>
              <th>Nama Dokter</th>
              <th>Spesialisasi</th>
              <th>Tanggal</th>
              <th>Jam</th>
              <th>Waktu Perekaman</th>
            </tr>
          </thead>
          <tbody>
            {reservations.map((reservation, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{reservation.reservationNumber || "N/A"}</td>
                <td>{reservation.doctorName}</td>
                <td>{reservation.doctorSpecialization}</td>
                <td>{reservation.reservationDate}</td>
                <td>{reservation.reservationTime}</td>
                <td>
                  {reservation.createdAt
                    ? new Date(reservation.createdAt.seconds * 1000).toLocaleString()
                    : "N/A"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default RiwayatReservasi;
