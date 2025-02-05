import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { db, auth } from "../firebaseConfig"; // Pastikan path ini benar
import "../styles/dashboard.css";

const Dashboard = () => {
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]); // State untuk menyimpan data dokter
  const [loading, setLoading] = useState(true); // State untuk loading
  const [username, setUsername] = useState(""); // State untuk menyimpan nama pengguna

  // Ambil data dokter dari Firestore
  const fetchDoctors = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "doctors"));
      const doctorsData = [];
      querySnapshot.forEach((docSnapshot) => {
        const doctorData = docSnapshot.data();
        const doctorId = docSnapshot.id;
        doctorsData.push({ id: doctorId, ...doctorData });
      });
      setDoctors(doctorsData);
      setLoading(false);
    } catch (e) {
      console.error("Error getting documents: ", e);
      setLoading(false);
    }
  };

  // Ambil nama pengguna dari email saat halaman dimuat
  useEffect(() => {
    if (auth.currentUser) {
      const email = auth.currentUser.email;
      const extractedUsername = email.split("@")[0]; // Ambil bagian sebelum '@'
      setUsername(extractedUsername);
    }
    fetchDoctors();
  }, []);

  // Fungsi logout
  const handleLogout = () => {
    auth
      .signOut()
      .then(() => {
        alert("Berhasil logout!");
        navigate("/login");
      })
      .catch((error) => {
        console.error("Error logging out:", error);
      });
  };

  return (
    <div className="dashboard-container">
      {/* Header */}
      <header className="dashboard-header">
        <h1 className="dashboard-title">
          Clinic <span>Essential</span>
        </h1>
        {username && (
          <p className="welcome-message">Selamat datang, {username}!</p>
        )}
        <nav className="dashboard-nav">
          <button onClick={() => navigate("/riwayat-reservasi")}>
            Riwayat Reservasi Saya
          </button>
          <button onClick={() => navigate("/reservasi")}>Reservasi</button>
          <button onClick={handleLogout}>Logout</button>
        </nav>
      </header>

      {/* Daftar Dokter */}
      <main className="dashboard-content">
        {loading ? (
          <p>Loading doctors...</p>
        ) : (
          <table className="doctor-table">
            <thead>
              <tr>
                <th>No.</th>
                <th>Nama Dokter</th>
                <th>Spesialisasi</th>
              </tr>
            </thead>
            <tbody>
              {doctors.length === 0 ? (
                <tr>
                  <td colSpan="3">Tidak ada dokter tersedia.</td>
                </tr>
              ) : (
                doctors.map((doctor, index) => (
                  <tr key={doctor.id}>
                    <td>{index + 1}</td>
                    <td>{doctor.name}</td>
                    <td>{doctor.specialization}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
