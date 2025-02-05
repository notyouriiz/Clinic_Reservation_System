import React, { useState } from "react";
import { auth } from "../firebaseConfig";
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import "../styles/login.css";
import GoogleLogo from "../assets/google logo.png";


const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert("Login berhasil!");
      navigate("/dashboard");
    } catch (error) {
      alert(error.message);
    }
  };

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      alert("Login berhasil dengan Google!");
      navigate("/dashboard");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        {/* Judul dengan animasi */}
        <h1 className="title">
          Clinic <span>Essential</span>
        </h1>
        <h2 className="subtitle">Login</h2>

        {/* Input untuk email dan password */}
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

        {/* Tombol login */}
        <button onClick={handleLogin} className="btn-login">
          Login
        </button>
        <button onClick={handleGoogleSignIn} className="btn-google">
          <img
            src={GoogleLogo}
            alt="Google Logo"
            className="google-logo"
          />
          Login with Google
        </button>

        {/* Link navigasi */}
        <p className="register-link">
          Belum punya akun? <a href="/register">Daftar di sini</a>
        </p>
        <p className="forgot-password-link">
          Lupa password? <a href="/forgot-password">Reset di sini</a>
        </p>
      </div>
    </div>
  );
};

export default Login;
