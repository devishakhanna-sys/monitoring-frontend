
import { useState } from "react";
import axios from "axios";
import "./Register.css";

const API_URL = import.meta.env.VITE_API_BASE_URL;

function Register({ onLogin }) {
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    if (!name.trim() || !mobile.trim()) {
      setError("Please enter your name and mobile number.");
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(
        `${API_URL}/third-party-employee/registerThirdPartyEmployee`,
        {
          name: name.trim(),
          mobile: mobile.trim(),
        }
      );

      if (response.data.success) {
        setMessage(
          response.data.message || "Registration successful."
        );
        setName("");
        setMobile("");
      } else {
        setError(
          response.data.message || "Registration failed."
        );
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Unable to connect to the server. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <div className="auth-card">
        <div className="brand">
          <div className="brand-icon">M</div>
          
          <p>Employee Access Portal</p>
        </div>

        <div className="auth-content">
          <h2>Create Account</h2>

          <p className="subtitle">
            Register to access the Monitoring System.
          </p>

          <form onSubmit={handleRegister}>
            <label>Full Name</label>

            <input
              type="text"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={100}
              required
            />

            <label>Mobile Number</label>

            <input
              type="tel"
              placeholder="Enter mobile number"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              maxLength={15}
              required
            />

            {error && (
              <p className="error-message">{error}</p>
            )}

            {message && (
              <p className="success-message">{message}</p>
            )}

            <button
              type="submit"
              className="primary-button"
              disabled={loading}
            >
              {loading ? "Registering..." : "Register"}
            </button>
          </form>

          <p className="switch-text">
            Already registered?{" "}
            <button type="button" onClick={onLogin}>
              Login here
            </button>
          </p>
        </div>

        <div className="footer">
          © 2026 Monitoring System. All rights reserved.
        </div>
      </div>
    </div>
  );
}

export default Register;
