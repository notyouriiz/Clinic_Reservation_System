import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  collection,
  getDocs,
  query,
  where,
  addDoc,
  doc,
  getDoc,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebaseConfig";
import { auth } from "../firebaseConfig";
import "../styles/reservasi.css";

const Reservasi = () => {
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [reservationNumber, setReservationNumber] = useState(null);

  // Fungsi untuk mengambil data dokter
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
      setError("Gagal memuat data dokter. Silakan coba lagi.");
      setLoading(false);
    }
  };

  // Fungsi untuk mengambil nomor reservasi terakhir dan menambahkannya
  const getReservationNumber = async () => {
    try {
      const counterRef = doc(db, "reservationCounters", "counter");
      const counterDoc = await getDoc(counterRef);

      if (counterDoc.exists()) {
        const currentNumber = counterDoc.data().lastNumber;
        const newNumber = currentNumber + 1;
        setReservationNumber(newNumber);

        await updateDoc(counterRef, {
          lastNumber: newNumber,
        });
        return newNumber;
      } else {
        const newNumber = 1;
        setReservationNumber(newNumber);
        await setDoc(counterRef, {
          lastNumber: newNumber,
        });
        return newNumber;
      }
    } catch (e) {
      console.error("Error getting reservation number: ", e);
      setError("Terjadi kesalahan saat mendapatkan nomor reservasi.");
      return null;
    }
  };

  // Fungsi untuk memeriksa apakah ada double booking
  const checkDoubleBooking = async () => {
    try {
      const q = query(
        collection(db, "reservations"),
        where("reservationDate", "==", selectedDate),
        where("reservationTime", "==", selectedTime),
        where("doctorId", "==", selectedDoctor)
      );

      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        setError(
          `Dokter yang Anda pilih sudah memiliki reservasi pada ${selectedTime}. Silakan pilih dokter atau waktu lain.`
        );
        return false;
      }
      return true;
    } catch (e) {
      console.error("Error checking double booking: ", e);
      setError("Terjadi kesalahan saat memeriksa waktu reservasi.");
      return false;
    }
  };

  // Fungsi untuk menangani proses reservasi
  const handleReservation = async () => {
    if (!selectedDoctor || !selectedDate || !selectedTime) {
      setError("Silakan pilih dokter, tanggal, dan waktu.");
      return;
    }

    const user = auth.currentUser;
    if (!user) {
      console.error("User is not authenticated");
      setError("Anda harus login untuk melakukan reservasi.");
      return;
    }

    try {
      const newReservationNumber = reservationNumber || (await getReservationNumber());
      if (!newReservationNumber) return;

      if (await checkDoubleBooking()) {
        const selectedDoctorData = doctors.find(
          (doctor) => doctor.id === selectedDoctor
        );

        const docRef = await addDoc(collection(db, "reservations"), {
          reservationNumber: newReservationNumber,
          doctorId: selectedDoctor,
          doctorName: selectedDoctorData.name,
          doctorSpecialization: selectedDoctorData.specialization,
          reservationDate: selectedDate,
          reservationTime: selectedTime,
          userId: user.uid,
          createdAt: new Date(),
        });

        setSuccess("Reservasi berhasil!");
        setError("");

        navigate("/result", {
          state: {
            bookingId: docRef.id,
            reservationNumber: newReservationNumber,
            doctorName: selectedDoctorData.name,
            reservationDate: selectedDate,
            reservationTime: selectedTime,
          },
        });
      }
    } catch (e) {
      console.error("Error during reservation: ", e);
      setError("Terjadi kesalahan saat membuat reservasi.");
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  return (
    <div className="reservasi-container">
      <div className="reservasi-content">
        <h2>Halaman Reservasi</h2>
        <button onClick={() => navigate("/dashboard")} className="btn-back">
          Kembali ke Dashboard
        </button>

        {loading ? (
          <p>Loading doctors...</p>
        ) : (
          <div className="form-container">
            <label htmlFor="doctor">Pilih Dokter:</label>
            <select
              id="doctor"
              value={selectedDoctor}
              onChange={(e) => setSelectedDoctor(e.target.value)}
              className="select-input"
            >
              <option value="">Pilih Dokter</option>
              {doctors.map((doctor) => (
                <option key={doctor.id} value={doctor.id}>
                  {doctor.name} - {doctor.specialization}
                </option>
              ))}
            </select>

            <label htmlFor="date">Pilih Tanggal:</label>
            <input
              type="date"
              id="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="input-field"
            />

            <label htmlFor="time">Pilih Jam:</label>
            <select
              id="time"
              value={selectedTime}
              onChange={(e) => setSelectedTime(e.target.value)}
              className="select-input"
            >
              <option value="">Pilih Jam</option>
              <option value="09:00">09:00 - 10:00</option>
              <option value="10:00">10:00 - 11:00</option>
              <option value="11:00">11:00 - 12:00</option>
              <option value="14:00">14:00 - 15:00</option>
              <option value="15:00">15:00 - 16:00</option>
            </select>

            <button onClick={handleReservation} className="btn-reservasi">
              Reservasi
            </button>

            {error && <p className="error-message">{error}</p>}
            {success && <p className="success-message">{success}</p>}
          </div>
        )}
      </div>
    </div>
  );
};

export default Reservasi;
