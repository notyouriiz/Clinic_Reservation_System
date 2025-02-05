import React, { useState } from "react";
import { auth } from "../firebaseConfig";
import { sendPasswordResetEmail } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import "../styles/auth.css"; // Import file CSS untuk styling

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate(); // Menyimpan fungsi navigate

  const handleResetPassword = async () => {
    try {
      await sendPasswordResetEmail(auth, email);
      setMessage("Kami telah mengirimkan email untuk mereset password.");
      setError(""); // Clear error if reset email sent

      // Setelah berhasil mengirimkan email reset password, arahkan pengguna ke halaman login
      navigate("/login");
    } catch (error) {
      setError(error.message);
      setMessage(""); // Clear success message if error occurs
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>Lupa Password</h2>
        <div className="input-group">
          <input
            type="email"
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
            className="input-field"
          />
        </div>
        <button onClick={handleResetPassword} className="btn-reset">
          Kirim Link Reset Password
        </button>
        {message && <p className="success-message">{message}</p>}
        {error && <p className="error-message">{error}</p>}
        <p className="login-link">
          Ingat password? <a href="/login">Login di sini</a>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
