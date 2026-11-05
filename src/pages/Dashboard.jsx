
import "./Dashboard.css";

function Dashboard({
  nextAction,
  statusLoading,
  statusError,
  onRefreshAttendance,
  onPunchIn,
  //onPunchOut,
  onLogout,
}) {
  return (
    <div className="dashboard-page">
      <header className="dashboard-header">
        <div>
          <h1>Monitoring System</h1>
          <p>Employee Attendance Portal</p>
        </div>

        <button className="logout-button" onClick={onLogout}>
          Logout
        </button>
      </header>

      <main className="dashboard-content">
        <div className="dashboard-welcome">
          <h2>Welcome!</h2>
          <p>Manage your attendance below.</p>
        </div>

        <div className="attendance-actions">

          {statusLoading ? (
            <p>Checking attendance status...</p>
          ) : statusError ? (
            <div>
              <p>{statusError}</p>
              <button onClick={onRefreshAttendance}>
                Retry
              </button>
            </div>
          ) : nextAction === "PUNCH_IN" ? (
            <button
              className="attendance-button punch-in-button"
              onClick={onPunchIn}
            >
              <span className="attendance-icon">↗</span>
              <span>Punch In</span>
              <small>Start your attendance</small>
            </button>
          
          ) : (
            <p>Attendance status is unavailable. Please retry.</p>
          )}

        </div>
      </main>

      <footer className="dashboard-footer">
        © 2026 Monitoring System. All rights reserved.
      </footer>
    </div>
  );
}

export default Dashboard;

