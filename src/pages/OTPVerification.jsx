
import { useRef, useState } from "react";
import "./OTPVerification.css";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function OTPVerification({ mobile = "", onBack, onVerifySuccess }) {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const inputRefs = useRef([]);

  const handleChange = (value, index) => {
    if (!/^\d*$/.test(value)) return;

    const updatedOTP = [...otp];
    updatedOTP[index] = value.slice(-1);
    setOtp(updatedOTP);
    setError("");
    setMessage("");

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();

    const pastedValue = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);

    const updatedOTP = Array(6).fill("");

    pastedValue.split("").forEach((digit, index) => {
      updatedOTP[index] = digit;
    });

    setOtp(updatedOTP);
    setError("");
    setMessage("");

    inputRefs.current[Math.min(pastedValue.length, 5)]?.focus();
  };

  

  const handleVerifyOTP = async () => {
    const enteredOTP = otp.join("");

    if (enteredOTP.length !== 6) {
      setError("Please enter the complete six-digit OTP.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setMessage("");

      const response = await fetch(
        `${API_BASE_URL.replace(/\/$/, "")}/third-party-employee/verifyOTP`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            mobile,
            otp: enteredOTP,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        setError(result.message || "OTP verification failed.");
        return;
      }

      const token = result.data?.token;

      if (!token) {
        setError("Login token was not received from the server.");
        return;
      }

      
      localStorage.setItem("thirdPartyEmployeeToken", token);
      localStorage.setItem(
        "thirdPartyEmployee",
        JSON.stringify(result.data.employee)
      );

      if (onVerifySuccess) {
        onVerifySuccess();
      }
    } catch (err) {
      console.error("OTP verification error:", err);
      setError("Unable to connect to the server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

 

  const handleResendOTP = async () => {
    try {
      setResending(true);
      setError("");
      setMessage("");

      const response = await fetch(
        `${API_BASE_URL.replace(/\/$/, "")}/third-party-employee/sendOTP`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ mobile }),
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        setError(result.message || "Unable to resend OTP.");
        return;
      }

      setOtp(["", "", "", "", "", ""]);
      setMessage("A new OTP has been sent successfully.");
      inputRefs.current[0]?.focus();
    } catch (err) {
      console.error("Resend OTP error:", err);
      setError("Unable to connect to the server. Please try again.");
    } finally {
      setResending(false);
    }
  };

  const maskedMobile = mobile
    ? mobile.length > 4
      ? "******" + mobile.slice(-4)
      : mobile
    : "your registered mobile number";

  return (
    <div className="otp-page">
      <div className="otp-card">
        <div className="otp-icon">
          <span>✓</span>
        </div>

        <h2>Verify Your Mobile Number</h2>

        <p className="otp-description">
          Enter the 6-digit verification code sent to
        </p>

        <p className="otp-mobile">{maskedMobile}</p>

        <div className="otp-input-container">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => (inputRefs.current[index] = el)}
              type="text"
              inputMode="numeric"
              maxLength="1"
              value={digit}
              disabled={loading}
              onChange={(e) =>
                handleChange(e.target.value, index)
              }
              onKeyDown={(e) => handleKeyDown(e, index)}
              onPaste={handlePaste}
              className="otp-input"
            />
          ))}
        </div>

        {error && (
          <p style={{ color: "red", marginTop: "10px" }}>
            {error}
          </p>
        )}

        {message && (
          <p style={{ color: "green", marginTop: "10px" }}>
            {message}
          </p>
        )}

        <button
          className="otp-verify-button"
          type="button"
          onClick={handleVerifyOTP}
          disabled={otp.some((digit) => digit === "") || loading}
        >
          {loading ? "Verifying..." : "Verify & Continue"}
        </button>

        <div className="otp-resend">
          Didn't receive the OTP?
          <button
            type="button"
            onClick={handleResendOTP}
            disabled={resending || loading}
          >
            {resending ? "Sending..." : "Resend OTP"}
          </button>
        </div>

        <button
          className="otp-back-button"
          type="button"
          onClick={onBack}
          disabled={loading}
        >
          ← Back to Login
        </button>

        <div className="otp-footer">
          © 2026 Monitoring System. All rights reserved.
        </div>
      </div>
    </div>
  );
}

export default OTPVerification;
