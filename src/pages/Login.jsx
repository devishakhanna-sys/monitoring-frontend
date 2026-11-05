
// import { useState } from "react";
// import "./Login.css";

// function Login({ onRegister, onRequestOTP }) {
//   const [mobile, setMobile] = useState("");

//   const handleSubmit = (e) => {
//     e.preventDefault();

//     const trimmedMobile = mobile.trim();

//     if (!/^\+?\d{10,15}$/.test(trimmedMobile)) {
//       alert("Please enter a valid mobile number.");
//       return;
//     }

//     if (onRequestOTP) {
//       onRequestOTP(trimmedMobile);
//     }
//   };

//   return (
//     <div className="app-container">
//       <div className="auth-card">
//         <div className="brand">
//           <div className="brand-icon">M</div>
//           <p>Employee Access Portal</p>
//         </div>

//         <div className="auth-content">
//           <h2>Welcome Back</h2>

//           <p className="subtitle">
//             Enter your registered mobile number to continue.
//           </p>

//           <form onSubmit={handleSubmit}>
//             <label>Mobile Number</label>

//             <input
//               type="tel"
//               placeholder="Enter mobile number"
//               value={mobile}
//               onChange={(e) => setMobile(e.target.value)}
//               maxLength={15}
//               required
//             />

//             <button
//               type="submit"
//               className="primary-button"
//               disabled={!mobile.trim()}
//             >
//               Send OTP
//             </button>
//           </form>

//           <p className="switch-text">
//             Not registered yet?{" "}
//             <button type="button" onClick={onRegister}>
//               Register here
//             </button>
//           </p>
//         </div>

//         <div className="footer">
//           © 2026 Monitoring System. All rights reserved.
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Login;


import { useState } from "react";
import "./Login.css";

function Login({ onRegister, onRequestOTP }) {
  const [mobile, setMobile] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    const trimmedMobile = mobile.trim();

    if (!/^\+?\d{10,15}$/.test(trimmedMobile)) {
      alert("Please enter a valid mobile number.");
      return;
    }

    if (onRequestOTP) {
      onRequestOTP(trimmedMobile);
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
          <h2>Welcome Back</h2>

          <p className="subtitle">
            Enter your registered mobile number to continue.
          </p>

          <form onSubmit={handleSubmit}>
            <label>Mobile Number</label>

            <input
              type="tel"
              placeholder="Enter mobile number"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              maxLength={15}
              required
            />

            <button
              type="submit"
              className="primary-button"
              disabled={!mobile.trim()}
            >
              Login
            </button>
          </form>

          {/* <p className="switch-text">
            Not registered yet?{" "}
            <button type="button" onClick={onRegister}>
              Register here
            </button>
          </p> */}
        </div>

        <div className="footer">
          © 2026 Monitoring System. All rights reserved.
        </div>
      </div>
    </div>
  );
}

export default Login;


