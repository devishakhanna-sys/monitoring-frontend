
import { useState } from "react";
import Login from "./pages/Login";
import Register from "./pages/Register";
import OTPVerification from "./pages/OTPVerification";
import Dashboard from "./pages/Dashboard";
import PunchIn from "./pages/PunchIn";
import PunchOut from "./pages/PunchOut";
import "./App.css";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function App() {
  const [currentPage, setCurrentPage] = useState("login");
  const [mobile, setMobile] = useState("");

  const [nextAction, setNextAction] = useState(null);
  const [statusLoading, setStatusLoading] = useState(false);
  const [statusError, setStatusError] = useState("");

  const handleRequestOTP = async (mobileNumber) => {
    try {
      if (!API_BASE_URL) {
        alert("API URL is not configured.");
        return;
      }

      const response = await fetch(
        `${API_BASE_URL.replace(/\/$/, "")}/third-party-employee/sendOTP`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            mobile: mobileNumber,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        alert(result.message || "Unable to send OTP.");
        return;
      }

      setMobile(mobileNumber);
      setCurrentPage("otp");

    } catch (error) {
      console.error("Send OTP error:", error);
      alert("Unable to connect to the server. Please try again.");
    }
  };

  // Fetch attendance status from database
  const loadAttendanceStatus = async () => {
    try {
      setStatusLoading(true);
      setStatusError("");

      const token = localStorage.getItem("thirdPartyEmployeeToken");

      if (!token) {
        throw new Error("Login session not found. Please login again.");
      }

      const response = await fetch(
        `${API_BASE_URL.replace(/\/$/, "")}/third-party-employee/attendance-status`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Unable to fetch attendance status."
        );
      }

      setNextAction(result.data.nextAction);

    } catch (error) {
      console.error("Attendance status error:", error);
      setNextAction(null);
      setStatusError(error.message || "Unable to fetch attendance status.");
    } finally {
      setStatusLoading(false);
    }
  };

  // Called after successful OTP verification
  const handleVerifySuccess = async () => {
    await loadAttendanceStatus();
    setCurrentPage("dashboard");
  };

  // Logout without changing attendance
  const handleLogout = () => {
    localStorage.removeItem("thirdPartyEmployeeToken");
    localStorage.removeItem("thirdPartyEmployee");

    setNextAction(null);
    setStatusError("");
    setMobile("");
    setCurrentPage("login");
  };

  return (
    <>
      {currentPage === "login" && (
        <Login
          onRegister={() => setCurrentPage("register")}
          onRequestOTP={handleRequestOTP}
        />
      )}

      {currentPage === "register" && (
        <Register
          onLogin={() => setCurrentPage("login")}
        />
      )}

      {currentPage === "otp" && (
        <OTPVerification
          mobile={mobile}
          onBack={() => setCurrentPage("login")}
          onVerifySuccess={handleVerifySuccess}
        />
      )}

      {currentPage === "dashboard" && (
        <Dashboard
          nextAction={nextAction}
          statusLoading={statusLoading}
          statusError={statusError}
          onRefreshAttendance={loadAttendanceStatus}
          onPunchIn={() => setCurrentPage("punch-in")}
          onPunchOut={() => setCurrentPage("punch-out")}
          onLogout={handleLogout}
        />
      )}

      {currentPage === "punch-in" && (
        <PunchIn
          onBack={() => {
            loadAttendanceStatus();
            setCurrentPage("dashboard");
          }}
        />
      )}

     {currentPage === "punch-out" && (
  <PunchOut
    onBack={() => setCurrentPage("dashboard")}
    onSuccess={async () => {
      await loadAttendanceStatus();
      setCurrentPage("dashboard");
    }}
  />
)}
    </>
  );
}

export default App;
