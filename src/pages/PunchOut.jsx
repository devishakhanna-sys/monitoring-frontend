
import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import "./PunchOut.css";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function PunchOut({ onBack, onSuccess }) {
  const scannerRef = useRef(null);
  const scannedRef = useRef(false);
  const mountedRef = useRef(false);

  const [qrValue, setQrValue] = useState("");
  const [location, setLocation] = useState(null);
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  // Stop and clear QR scanner.
  const stopScanner = async () => {
    if (scannerRef.current) {
      const scanner = scannerRef.current;

      try {
        if (scanner.isScanning) {
          await scanner.stop();
        }

        await scanner.clear();
      } catch (err) {
        console.error("Scanner stop error:", err);
      }

      if (scannerRef.current === scanner) {
        scannerRef.current = null;
      }
    }
  };

  // Capture employee's current GPS location.
  const captureLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by this browser.");
      return;
    }

    setLoadingLocation(true);
    setError("");
    setLocation(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        if (!mountedRef.current) return;

        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
        });

        setLoadingLocation(false);
      },
      (err) => {
        console.error("Location error:", err);

        if (!mountedRef.current) return;

        setError(
          "Unable to get your current location. Please enable location permission and retry."
        );

        setLoadingLocation(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0,
      }
    );
  };

  // Start QR scanner.
  useEffect(() => {
    let mounted = true;
    mountedRef.current = true;

    const startScanner = async () => {
      try {
        const scanner = new Html5Qrcode("punch-out-reader");

        scannerRef.current = scanner;

        await scanner.start(
          { facingMode: "environment" },
          {
            fps: 10,
            qrbox: { width: 250, height: 250 },
          },
          async (decodedText) => {
            if (!mounted || scannedRef.current) return;

            // Prevent duplicate scan callbacks.
            scannedRef.current = true;

            setQrValue(decodedText);
            setError("");

            await stopScanner();

            if (mounted) {
              captureLocation();
            }
          },
          () => {}
        );
      } catch (err) {
        console.error("QR scanner error:", err);

        if (mounted) {
          setError(
            "Unable to start camera. Please allow camera permission."
          );
        }
      }
    };

    startScanner();

    return () => {
      mounted = false;
      mountedRef.current = false;
      stopScanner();
    };
  }, []);

  // Submit Punch Out details to backend.
  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      setError("");
      setMessage("");

      if (!qrValue || !location) {
        setError("Please scan the site QR and capture your location.");
        return;
      }

      if (!API_BASE_URL) {
        setError("API URL is not configured.");
        return;
      }

      const token = localStorage.getItem("thirdPartyEmployeeToken");

      if (!token) {
        setError("Your login session has expired. Please login again.");
        return;
      }

      const response = await fetch(
        `${API_BASE_URL.replace(/\/$/, "")}/third-party-employee/punchOut`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            qrValue,
            latitude: location.latitude,
            longitude: location.longitude,
            accuracy: location.accuracy,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Punch Out failed.");
      }

      setMessage("Punch Out successful!");
    } catch (err) {
      console.error("Punch Out error:", err);

      setError(err.message || "Unable to process Punch Out.");
    } finally {
      if (mountedRef.current) {
        setSubmitting(false);
      }
    }
  };

  return (
    <div className="punch-out-page">
      <div className="punch-out-card">
        <h2>Punch Out</h2>

        <p>Scan the QR code at your current site.</p>

        {!qrValue && (
          <div id="punch-out-reader"></div>
        )}

        {qrValue && (
          <div className="punch-out-info">
            <p>
              <strong>QR Code:</strong> Scanned successfully
            </p>

            {location && (
              <>
                <p>Latitude: {location.latitude}</p>
                <p>Longitude: {location.longitude}</p>
                <p>GPS Accuracy: {location.accuracy} metres</p>
              </>
            )}

            {loadingLocation && (
              <p>Getting your current location...</p>
            )}

            {!loadingLocation && !location && !message && (
              <button
                type="button"
                onClick={captureLocation}
                className="punch-out-secondary"
              >
                Retry Location
              </button>
            )}
          </div>
        )}

        {error && (
          <p className="punch-out-error">{error}</p>
        )}

        {message && (
          <p className="punch-out-success">{message}</p>
        )}

        {qrValue && location && !message && (
          <button
            type="button"
            className="punch-out-submit"
            onClick={handleSubmit}
            disabled={submitting}
          >
            {submitting ? "Processing..." : "Confirm Punch Out"}
          </button>
        )}

        {message && (
          <button
            type="button"
            className="punch-out-submit"
            onClick={onSuccess}
          >
            Continue
          </button>
        )}

        <button
          type="button"
          className="punch-out-back"
          onClick={onBack}
          disabled={submitting || Boolean(message)}
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
}

export default PunchOut;
