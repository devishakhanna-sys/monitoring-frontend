
// import { useEffect, useRef, useState } from "react";
// import { Html5Qrcode } from "html5-qrcode";
// import "./PunchIn.css";

// const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// const extractQrValue = (scannedText) => {
//   try {
//     const url = new URL(scannedText);
//     return url.searchParams.get("x") || scannedText.trim();
//   } catch {
//     return scannedText.trim();
//   }
// };

// function PunchIn({ onBack }) {
//   const scannerRef = useRef(null);
//   const isMountedRef = useRef(true);
//   const videoRef = useRef(null);
//   const selfieStreamRef = useRef(null);

//   const [scanning, setScanning] = useState(false);
//   const [qrValue, setQrValue] = useState("");
//   const [location, setLocation] = useState(null);
//   const [error, setError] = useState("");
//   const [loadingLocation, setLoadingLocation] = useState(false);

//   const [selfieCameraActive, setSelfieCameraActive] = useState(false);
//   const [selfieFile, setSelfieFile] = useState(null);
//   const [selfiePreview, setSelfiePreview] = useState("");

//   const [submitting, setSubmitting] = useState(false);
//   const [successMessage, setSuccessMessage] = useState("");

  

//   const stopSelfieCamera = () => {
//     if (selfieStreamRef.current) {
//       selfieStreamRef.current.getTracks().forEach((track) => {
//         track.stop();
//       });

//       selfieStreamRef.current = null;
//     }

//     setSelfieCameraActive(false);
//   };

//   useEffect(() => {
//     isMountedRef.current = true;

//     return () => {
//       isMountedRef.current = false;

//       const scanner = scannerRef.current;
//       scannerRef.current = null;

//       if (scanner && scanner.isScanning) {
//         scanner.stop().catch((err) => {
//           console.error("Scanner cleanup error:", err);
//         });
//       }

//       if (selfieStreamRef.current) {
//         selfieStreamRef.current.getTracks().forEach((track) => {
//           track.stop();
//         });

//         selfieStreamRef.current = null;
//       }
//     };
//   }, []);

//   useEffect(() => {
//   if (!selfieCameraActive) return;

//   const video = videoRef.current;
//   const stream = selfieStreamRef.current;

//   if (!video || !stream) return;

//   video.srcObject = stream;

//   const playVideo = () => {
//     video.play().catch((err) => {
//       console.error("Video playback error:", err);

//       if (isMountedRef.current) {
//         setError("Unable to display camera preview. Please try again.");
//       }
//     });
//   };

//   if (video.readyState >= 1) {
//     playVideo();
//   } else {
//     video.onloadedmetadata = playVideo;
//   }

//   return () => {
//     video.onloadedmetadata = null;

//     if (video.srcObject === stream) {
//       video.srcObject = null;
//     }
//   };
// }, [selfieCameraActive]);

  

//   const startScanner = async () => {
//     if (scanning || scannerRef.current?.isScanning) {
//       return;
//     }

//     setError("");
//     setQrValue("");
//     setLocation(null);
//     setSelfieFile(null);
//     setSelfiePreview("");
//     setSuccessMessage("");

//     let scanner;

//     try {
//       scanner = new Html5Qrcode("qr-reader");
//       scannerRef.current = scanner;

//       await scanner.start(
//         { facingMode: "environment" },
//         {
//           fps: 10,
//           qrbox: { width: 250, height: 250 },
//         },
//         // async (decodedText) => {
//         //   if (!isMountedRef.current) return;

//         //   setQrValue(decodedText);
//         //   setError("");
//         async (decodedText) => {
//   if (!isMountedRef.current) return;

//   const extractedValue = extractQrValue(decodedText);

//   console.log("Scanned QR:", decodedText);
//   console.log("Extracted QR Value:", extractedValue);

//   setQrValue(extractedValue);
//   setError("");

//           try {
//             if (scanner.isScanning) {
//               await scanner.stop();
//             }
//           } catch (err) {
//             console.error("Scanner stop error:", err);
//           }

//           if (!isMountedRef.current) return;

//           setScanning(false);
//           captureLocation();
//         },
//         () => {}
//       );

//       if (isMountedRef.current) {
//         setScanning(true);
//       } else if (scanner.isScanning) {
//         await scanner.stop().catch(() => {});
//       }
//     } catch (err) {
//       console.error("QR scanner error:", err);

//       if (isMountedRef.current) {
//         setScanning(false);
//         setError(
//           "Unable to access camera. Please allow camera permission and try again."
//         );
//       }

//       scannerRef.current = null;
//     }
//   };

  

//   const captureLocation = () => {
//     if (!navigator.geolocation) {
//       setError("GPS location is not supported by this device.");
//       return;
//     }

//     setLoadingLocation(true);

//     navigator.geolocation.getCurrentPosition(
//       (position) => {
//         if (!isMountedRef.current) return;

//         setLocation({
//           latitude: position.coords.latitude,
//           longitude: position.coords.longitude,
//           accuracy: position.coords.accuracy,
//         });

//         setLoadingLocation(false);
//       },
//       (err) => {
//         console.error("GPS error:", err);

//         if (!isMountedRef.current) return;

//         setError(
//           "Unable to get your current location. Please enable GPS and try again."
//         );

//         setLoadingLocation(false);
//       },
//       {
//         enableHighAccuracy: true,
//         timeout: 15000,
//         maximumAge: 0,
//       }
//     );
//   };

  

//   // const startSelfieCamera = async () => {
//   //   try {
//   //     setError("");

//   //     if (!navigator.mediaDevices?.getUserMedia) {
//   //       setError("Camera is not supported. Please use HTTPS or localhost.");
//   //       return;
//   //     }

//   //     const stream = await navigator.mediaDevices.getUserMedia({
//   //       video: {
//   //         facingMode: "user",
//   //       },
//   //       audio: false,
//   //     });

//   //     if (!isMountedRef.current) {
//   //       stream.getTracks().forEach((track) => track.stop());
//   //       return;
//   //     }

//   //     selfieStreamRef.current = stream;

//   //     if (videoRef.current) {
//   //       videoRef.current.srcObject = stream;
//   //       await videoRef.current.play();
//   //     }

//   //     setSelfieCameraActive(true);
//   //   } catch (err) {
//   //     console.error("Selfie camera error:", err);

//   //     setError(
//   //       "Unable to access front camera. Please allow camera permission."
//   //     );
//   //   }
//   // };

//   const startSelfieCamera = async () => {
//   try {
//     setError("");

//     if (!navigator.mediaDevices?.getUserMedia) {
//       setError("Camera is not supported. Please use HTTPS or localhost.");
//       return;
//     }

//     const stream = await navigator.mediaDevices.getUserMedia({
//       video: {
//         facingMode: "user",
//       },
//       audio: false,
//     });

//     if (!isMountedRef.current) {
//       stream.getTracks().forEach((track) => track.stop());
//       return;
//     }

//     selfieStreamRef.current = stream;

//     // Render the video element first
//     setSelfieCameraActive(true);

//   } catch (err) {
//     console.error("Selfie camera error:", err);

//     setError(
//       "Unable to access front camera. Please allow camera permission."
//     );
//   }
// };

  

//   const captureSelfie = () => {
//     const video = videoRef.current;

//     if (!video || !video.videoWidth || !video.videoHeight) {
//       setError("Camera is not ready. Please try again.");
//       return;
//     }

//     const canvas = document.createElement("canvas");

//     canvas.width = video.videoWidth;
//     canvas.height = video.videoHeight;

//     const context = canvas.getContext("2d");

//     context.drawImage(video, 0, 0, canvas.width, canvas.height);

//     canvas.toBlob(
//       (blob) => {
//         if (!blob || !isMountedRef.current) {
//           setError("Unable to capture selfie. Please try again.");
//           return;
//         }

//         const file = new File(
//           [blob],
//           `selfie-${Date.now()}.jpg`,
//           { type: "image/jpeg" }
//         );

//         const previewURL = URL.createObjectURL(file);

//         setSelfieFile(file);
//         setSelfiePreview(previewURL);

//         stopSelfieCamera();
//         setError("");
//       },
//       "image/jpeg",
//       0.85
//     );
//   };

  

//   const retakeSelfie = () => {
//     if (selfiePreview) {
//       URL.revokeObjectURL(selfiePreview);
//     }

//     setSelfieFile(null);
//     setSelfiePreview("");

//     startSelfieCamera();
//   };

  

//   const handlePunchIn = async () => {
//     if (!qrValue || !location || !selfieFile) {
//       setError("QR code, GPS location and selfie are required.");
//       return;
//     }

//     const token = localStorage.getItem("thirdPartyEmployeeToken");

//     if (!token) {
//       setError("Your session has expired. Please log in again.");
//       return;
//     }

//     try {
//       setSubmitting(true);
//       setError("");
//       setSuccessMessage("");

//       const formData = new FormData();

//       formData.append("qrValue", qrValue);
//       formData.append("latitude", String(location.latitude));
//       formData.append("longitude", String(location.longitude));
//       formData.append("accuracy", String(location.accuracy));
//       formData.append("selfie", selfieFile);

//       const response = await fetch(
//         `${API_BASE_URL.replace(/\/$/, "")}/third-party-employee/punchIn`,
//         {
//           method: "POST",
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//           body: formData,
//         }
//       );

//       const result = await response.json();

//       if (!response.ok || !result.success) {
//         setError(result.message || "Punch In failed.");
//         return;
//       }

//       setSuccessMessage("Punch In successful!");

//       console.log("Punch In response:", result.data);
//     } catch (err) {
//       console.error("Punch In API error:", err);

//       setError("Unable to connect to the server. Please try again.");
//     } finally {
//       setSubmitting(false);
//     }
//   };

  

//   const handleBack = async () => {
//     const scanner = scannerRef.current;

//     if (scanner && scanner.isScanning) {
//       try {
//         await scanner.stop();
//       } catch (err) {
//         console.error("Scanner stop error:", err);
//       }
//     }

//     scannerRef.current = null;

//     stopSelfieCamera();

//     if (selfiePreview) {
//       URL.revokeObjectURL(selfiePreview);
//     }

//     if (typeof onBack === "function") {
//       onBack();
//     }
//   };

  

//   return (
//     <div className="punch-page">
//       <div className="punch-card">

//         <button
//           type="button"
//           className="back-button"
//           onClick={handleBack}
//           disabled={submitting}
//         >
//           ← Back to Dashboard
//         </button>

//         <div className="punch-heading">
//           <h2>Punch In</h2>
//           <p>Scan the QR code available at your site.</p>
//         </div>

//         <div id="qr-reader" className="qr-reader"></div>

//         {!scanning && !qrValue && !successMessage && (
//           <button
//             type="button"
//             className="punch-primary-button"
//             onClick={startScanner}
//           >
//             Start QR Scanner
//           </button>
//         )}

//         {qrValue && (
//           <div className="scan-result">
//             <h3>QR Code Scanned</h3>
//             <p>{qrValue}</p>
//           </div>
//         )}

//         {loadingLocation && (
//           <p className="location-message">
//             Capturing your current location...
//           </p>
//         )}

//         {location && (
//           <div className="location-result">
//             <h3>Current Location Captured</h3>
//             <p>Latitude: {location.latitude}</p>
//             <p>Longitude: {location.longitude}</p>
//             <p>GPS Accuracy: {location.accuracy} metres</p>
//           </div>
//         )}

//         {qrValue && !location && !loadingLocation && !error && (
//           <button
//             type="button"
//             className="punch-primary-button"
//             onClick={captureLocation}
//           >
//             Capture Location
//           </button>
//         )}

//         {/* SELFIE SECTION */}

//         {qrValue && location && !selfieFile && (
//           <div className="selfie-section">

//             <h3>Employee Selfie</h3>
//             <p>Please capture your live selfie.</p>

//             {!selfieCameraActive && (
//               <button
//                 type="button"
//                 className="punch-primary-button"
//                 onClick={startSelfieCamera}
//               >
//                 Open Front Camera
//               </button>
//             )}

//             {selfieCameraActive && (
//               <>
//                 <video
//                   ref={videoRef}
//                   autoPlay
//                   playsInline
//                   muted
//                   className="selfie-video"
//                 />

//                 <button
//                   type="button"
//                   className="punch-primary-button"
//                   onClick={captureSelfie}
//                 >
//                   Capture Selfie
//                 </button>
//               </>
//             )}

//           </div>
//         )}

//         {/* SELFIE PREVIEW */}

//         {selfiePreview && (
//           <div className="selfie-preview-section">
//             <h3>Selfie Preview</h3>

//             <img
//               src={selfiePreview}
//               alt="Employee selfie preview"
//               className="selfie-preview"
//             />

//             <button
//               type="button"
//               className="punch-secondary-button"
//               onClick={retakeSelfie}
//               disabled={submitting}
//             >
//               Retake Selfie
//             </button>
//           </div>
//         )}

//         {/* SUBMIT BUTTON */}

//         {qrValue && location && selfieFile && !successMessage && (
//           <button
//             type="button"
//             className="punch-primary-button"
//             onClick={handlePunchIn}
//             disabled={submitting}
//           >
//             {submitting ? "Processing Punch In..." : "Submit Punch In"}
//           </button>
//         )}

//         {error && (
//           <p className="punch-error">
//             {error}
//           </p>
//         )}

//         {successMessage && (
//           <div className="punch-success">
//             <h3>{successMessage}</h3>
//             <p>Your attendance has been recorded successfully.</p>

//             <button
//               type="button"
//               className="punch-primary-button"
//               onClick={handleBack}
//             >
//               Back to Dashboard
//             </button>
//           </div>
//         )}

//       </div>
//     </div>
//   );
// }

// export default PunchIn;

import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import "./PunchIn.css";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const extractQrValue = (scannedText) => {
  try {
    const url = new URL(scannedText);
    return url.searchParams.get("x") || scannedText.trim();
  } catch {
    return scannedText.trim();
  }
};

const formatDate = (dateString) => {
  if (!dateString) return "Not available";

  const parts = dateString.split("-");

  if (parts.length !== 3) return dateString;

  const date = new Date(
    Number(parts[0]),
    Number(parts[1]) - 1,
    Number(parts[2]),
  );

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const formatTime = (timeString) => {
  if (!timeString) return "Not available";

  const parts = timeString.split(":");

  if (parts.length < 2) return timeString;

  const date = new Date();
  date.setHours(Number(parts[0]), Number(parts[1]), Number(parts[2] || 0));

  return date.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

function PunchIn({ onBack }) {
  const scannerRef = useRef(null);
  const isMountedRef = useRef(true);
  const videoRef = useRef(null);
  const selfieStreamRef = useRef(null);

  const [scanning, setScanning] = useState(false);
  const [qrValue, setQrValue] = useState("");
  const [location, setLocation] = useState(null);
  const [error, setError] = useState("");
  const [loadingLocation, setLoadingLocation] = useState(false);

  const [selfieCameraActive, setSelfieCameraActive] = useState(false);
  const [selfieFile, setSelfieFile] = useState(null);
  const [selfiePreview, setSelfiePreview] = useState("");
  const [selfieSkipped, setSelfieSkipped] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [successData, setSuccessData] = useState(null);
  const [photoLoadError, setPhotoLoadError] = useState(false);

  const stopSelfieCamera = () => {
    if (selfieStreamRef.current) {
      selfieStreamRef.current.getTracks().forEach((track) => {
        track.stop();
      });

      selfieStreamRef.current = null;
    }

    setSelfieCameraActive(false);
  };

  useEffect(() => {
    isMountedRef.current = true;

    return () => {
      isMountedRef.current = false;

      const scanner = scannerRef.current;
      scannerRef.current = null;

      if (scanner && scanner.isScanning) {
        scanner.stop().catch((err) => {
          console.error("Scanner cleanup error:", err);
        });
      }

      if (selfieStreamRef.current) {
        selfieStreamRef.current.getTracks().forEach((track) => {
          track.stop();
        });

        selfieStreamRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!selfieCameraActive) return;

    const video = videoRef.current;
    const stream = selfieStreamRef.current;

    if (!video || !stream) return;

    video.srcObject = stream;

    const playVideo = () => {
      video.play().catch((err) => {
        console.error("Video playback error:", err);

        if (isMountedRef.current) {
          setError("Unable to display camera preview. You can continue without a new selfie.");
        }
      });
    };

    if (video.readyState >= 1) {
      playVideo();
    } else {
      video.onloadedmetadata = playVideo;
    }

    return () => {
      video.onloadedmetadata = null;

      if (video.srcObject === stream) {
        video.srcObject = null;
      }
    };
  }, [selfieCameraActive]);

  const startScanner = async () => {
    if (scanning || scannerRef.current?.isScanning) return;

    setError("");
    setQrValue("");
    setLocation(null);
    setSelfieFile(null);
    setSelfiePreview("");
    setSelfieSkipped(false);
    setSuccessData(null);

    let scanner;

    try {
      scanner = new Html5Qrcode("qr-reader");
      scannerRef.current = scanner;

      await scanner.start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
        },
        async (decodedText) => {
          if (!isMountedRef.current) return;

          const extractedValue = extractQrValue(decodedText);

          setQrValue(extractedValue);
          setError("");

          try {
            if (scanner.isScanning) {
              await scanner.stop();
            }
          } catch (err) {
            console.error("Scanner stop error:", err);
          }

          if (!isMountedRef.current) return;

          setScanning(false);
          captureLocation();
        },
        () => {},
      );

      if (isMountedRef.current) {
        setScanning(true);
      } else if (scanner.isScanning) {
        await scanner.stop().catch(() => {});
      }
    } catch (err) {
      console.error("QR scanner error:", err);

      if (isMountedRef.current) {
        setScanning(false);
        setError(
          "Unable to access camera. Please allow camera permission and try again.",
        );
      }

      scannerRef.current = null;
    }
  };

  const captureLocation = () => {
    if (!navigator.geolocation) {
      setError("GPS location is not supported by this device.");
      return;
    }

    setLoadingLocation(true);
    setError("");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        if (!isMountedRef.current) return;

        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
        });

        setLoadingLocation(false);
      },
      (err) => {
        console.error("GPS error:", err);

        if (!isMountedRef.current) return;

        setError(
          "Unable to get your current location. Please enable GPS and try again.",
        );

        setLoadingLocation(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0,
      },
    );
  };

  const startSelfieCamera = async () => {
    try {
      setError("");
      setSelfieSkipped(false);

      if (!navigator.mediaDevices?.getUserMedia) {
        setError(
          "Camera is not supported. Please use HTTPS or localhost, or continue without a new selfie.",
        );
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "user",
        },
        audio: false,
      });

      if (!isMountedRef.current) {
        stream.getTracks().forEach((track) => track.stop());
        return;
      }

      selfieStreamRef.current = stream;
      setSelfieCameraActive(true);
    } catch (err) {
      console.error("Selfie camera error:", err);

      setError(
        "Unable to access front camera. Please check camera permission or continue without a new selfie.",
      );
    }
  };

  const captureSelfie = () => {
    const video = videoRef.current;

    if (!video || !video.videoWidth || !video.videoHeight) {
      setError(
        "Camera is not ready. Please try again or continue without a new selfie.",
      );
      return;
    }

    const canvas = document.createElement("canvas");

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const context = canvas.getContext("2d");

    if (!context) {
      setError("Unable to capture selfie. Please try again.");
      return;
    }

    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob(
      (blob) => {
        if (!blob || !isMountedRef.current) {
          setError(
            "Unable to capture selfie. Please try again or continue without a new selfie.",
          );
          return;
        }

        const file = new File([blob], `selfie-${Date.now()}.jpg`, {
          type: "image/jpeg",
        });

        const previewURL = URL.createObjectURL(file);

        setSelfieFile(file);
        setSelfiePreview(previewURL);
        setSelfieSkipped(false);

        stopSelfieCamera();
        setError("");
      },
      "image/jpeg",
      0.85,
    );
  };

  const retakeSelfie = () => {
    if (selfiePreview) {
      URL.revokeObjectURL(selfiePreview);
    }

    setSelfieFile(null);
    setSelfiePreview("");
    setSelfieSkipped(false);

    startSelfieCamera();
  };

  const continueWithoutSelfie = () => {
    stopSelfieCamera();

    if (selfiePreview) {
      URL.revokeObjectURL(selfiePreview);
    }

    setSelfieFile(null);
    setSelfiePreview("");
    setSelfieSkipped(true);
    setError("");
  };

  const handlePunchIn = async () => {
    if (!qrValue || !location) {
      setError("QR code and GPS location are required.");
      return;
    }

    if (!selfieFile && !selfieSkipped) {
      setError(
        "Please capture a selfie or choose to continue without a new selfie.",
      );
      return;
    }

    const token = localStorage.getItem("thirdPartyEmployeeToken");

    if (!token) {
      setError("Your session has expired. Please log in again.");
      return;
    }

    try {
      setSubmitting(true);
      setError("");
      setPhotoLoadError(false);

      const formData = new FormData();

      formData.append("qrValue", qrValue);
      formData.append("latitude", String(location.latitude));
      formData.append("longitude", String(location.longitude));
      formData.append("accuracy", String(location.accuracy));

      // Only append a file when a new selfie was captured.
      if (selfieFile) {
        formData.append("selfie", selfieFile);
      }

      const response = await fetch(
        `${API_BASE_URL.replace(/\/$/, "")}/third-party-employee/punchIn`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        },
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        setError(result.message || "Punch In failed.");
        return;
      }

      setSuccessData(result.data);
      stopSelfieCamera();

      if (selfiePreview) {
        URL.revokeObjectURL(selfiePreview);
      }

      setSelfiePreview("");
      setSelfieFile(null);
    } catch (err) {
      console.error("Punch In API error:", err);

      setError("Unable to connect to the server. Please try again.");
    } finally {
      if (isMountedRef.current) {
        setSubmitting(false);
      }
    }
  };

  const handleBack = async () => {
    const scanner = scannerRef.current;

    if (scanner && scanner.isScanning) {
      try {
        await scanner.stop();
      } catch (err) {
        console.error("Scanner stop error:", err);
      }
    }

    scannerRef.current = null;

    stopSelfieCamera();

    if (selfiePreview) {
      URL.revokeObjectURL(selfiePreview);
    }

    if (typeof onBack === "function") {
      onBack();
    }
  };

  const canSubmit = qrValue && location && (selfieFile || selfieSkipped);

  return (
    <div className="punch-page">
      <div className="punch-card">
        <button
          type="button"
          className="back-button"
          onClick={handleBack}
          disabled={submitting}
        >
          ← Back to Dashboard
        </button>

        {!successData ? (
          <>
            <div className="punch-heading">
              <h2>Punch In</h2>
              <p>Scan the QR code available at your site.</p>
            </div>

            <div id="qr-reader" className="qr-reader"></div>

            {!scanning && !qrValue && (
              <button
                type="button"
                className="punch-primary-button"
                onClick={startScanner}
              >
                Start QR Scanner
              </button>
            )}

            {qrValue && (
              <div className="scan-result">
                <h3>QR Code Scanned</h3>
                <p>{qrValue}</p>
              </div>
            )}

            {loadingLocation && (
              <p className="location-message">
                Capturing your current location...
              </p>
            )}

            {location && (
              <div className="location-result">
                <h3>Current Location Captured</h3>
                <p>GPS Accuracy: {location.accuracy} metres</p>
              </div>
            )}

            {qrValue && !location && !loadingLocation && (
              <button
                type="button"
                className="punch-primary-button"
                onClick={captureLocation}
              >
                Capture Location
              </button>
            )}

            {qrValue && location && !selfieFile && !selfieSkipped && (
              <div className="selfie-section">
                <h3>Employee Selfie</h3>
                <p>Please capture your live selfie.</p>

                {!selfieCameraActive && (
                  <button
                    type="button"
                    className="punch-primary-button"
                    onClick={startSelfieCamera}
                  >
                    Open Front Camera
                  </button>
                )}

                {selfieCameraActive && (
                  <>
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      className="selfie-video"
                    />

                    <button
                      type="button"
                      className="punch-primary-button"
                      onClick={captureSelfie}
                    >
                      Capture Selfie
                    </button>
                  </>
                )}

                <button
                  type="button"
                  className="punch-secondary-button"
                  onClick={continueWithoutSelfie}
                  disabled={submitting}
                >
                  Continue Without New Selfie
                </button>

                <p className="selfie-note">
                  If your camera is unavailable, you can continue. The system
                  will look for a recent photo from your previous attendance.
                </p>
              </div>
            )}

            {selfiePreview && (
              <div className="selfie-preview-section">
                <h3>Selfie Preview</h3>

                <img
                  src={selfiePreview}
                  alt="Employee selfie preview"
                  className="selfie-preview"
                />

                <button
                  type="button"
                  className="punch-secondary-button"
                  onClick={retakeSelfie}
                  disabled={submitting}
                >
                  Retake Selfie
                </button>
              </div>
            )}

            {selfieSkipped && (
              <div className="previous-photo-notice">
                <p>
                  No new selfie will be uploaded. The system will check for a
                  recent photo from your previous six days of attendance.
                </p>
                <button
                  type="button"
                  className="punch-secondary-button"
                  onClick={startSelfieCamera}
                  disabled={submitting}
                >
                  Try Camera Again
                </button>
              </div>
            )}

            {canSubmit && (
              <button
                type="button"
                className="punch-primary-button submit-punch-button"
                onClick={handlePunchIn}
                disabled={submitting}
              >
                {submitting ? "Processing Punch In..." : "Submit Punch In"}
              </button>
            )}

            {error && <p className="punch-error">{error}</p>}
          </>
        ) : (
          <div className="punch-confirmation">
            <div className="confirmation-success-icon">✓</div>

            <h2>Punch In Successful!</h2>
            <p className="confirmation-subtitle">
              Your attendance has been recorded successfully.
            </p>

            <div className="confirmation-details">
              <h3>Attendance Details</h3>

              <div className="confirmation-detail-row">
                <span>Employee Name</span>
                <strong>{successData.employeeName || "Not available"}</strong>
              </div>

              <div className="confirmation-detail-row">
                <span>Mobile Number</span>
                <strong>{successData.mobile || "Not available"}</strong>
              </div>

              <div className="confirmation-detail-row">
                <span>Punch In Date</span>
                <strong>{formatDate(successData.punchInDate)}</strong>
              </div>

              <div className="confirmation-detail-row">
                <span>Punch In Time</span>
                <strong>{formatTime(successData.punchInTime)}</strong>
              </div>

              <div className="confirmation-detail-row">
                <span>Site Name</span>
                <strong>{successData.siteName || "Not available"}</strong>
              </div>
            </div>

            <div className="confirmation-photo-section">
              <h3>Employee Photo</h3>

              {successData.photoType !== "NONE" &&
              successData.selfieUrl &&
              !photoLoadError ? (
                <>
                  <img
                    src={successData.selfieUrl}
                    alt="Employee attendance"
                    className="confirmation-photo"
                    onError={() => setPhotoLoadError(true)}
                  />

                  {successData.photoType === "LIVE" ? (
                    <span className="photo-type-label live-photo-label">
                      Live Selfie
                    </span>
                  ) : (
                    <span className="photo-type-label previous-photo-label">
                      Previous Photo
                    </span>
                  )}

                  {successData.photoType === "PREVIOUS" && (
                    <p className="photo-original-date">
                      Originally captured on{" "}
                      <strong>{formatDate(successData.photoDate)}</strong> at{" "}
                      <strong>{formatTime(successData.photoTime)}</strong>
                    </p>
                  )}

                  {successData.photoType === "LIVE" && (
                    <p className="photo-original-date">
                      Captured during this Punch In.
                    </p>
                  )}
                </>
              ) : (
                <div className="no-photo-message">
                  <span>📷</span>
                  <p>No photo available</p>
                  <small>
                    Your Punch In was recorded successfully, but no usable
                    photo was available.
                  </small>
                </div>
              )}
            </div>

            <button
              type="button"
              className="punch-primary-button confirmation-back-button"
              onClick={handleBack}
            >
              Back to Dashboard
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default PunchIn;
