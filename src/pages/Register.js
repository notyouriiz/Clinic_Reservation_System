import React, { useState } from "react";
import { auth } from "../firebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import "../styles/auth.css"; // Import file CSS untuk styling

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      setError("Password dan konfirmasi password tidak cocok.");
      return;
    }
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      setSuccess("Registrasi berhasil!");
      setError(""); // Clear error if registration is successful
      navigate("/login");
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>Daftar</h2>
        <div className="input-group">
          <input
            type="email"
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
            className="input-field"
          />
        </div>
        <div className="input-group">
          <input
            type="password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
            className="input-field"
          />
        </div>
        <div className="input-group">
          <input
            type="password"
            placeholder="Konfirmasi Password"
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="input-field"
          />
        </div>
        <button onClick={handleRegister} className="btn-register">
          Daftar
        </button>
        {error && <p className="error-message">{error}</p>}
        {success && <p className="success-message">{success}</p>}
        <p className="login-link">
          Sudah punya akun? <a href="/login">Login di sini</a>
        </p>
      </div>
    </div>
  );
};

export default Register;
