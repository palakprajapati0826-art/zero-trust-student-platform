import { Link } from "react-router-dom";

function StudentDashboard() {
  return (
    <div>
      <h1>Student Dashboard</h1>

      <h2>Welcome to Zero Trust Student Platform</h2>

      <p>Manage your documents and account from here.</p>

      <div>
        <h3>My Documents</h3>
        <p>View and manage your uploaded documents.</p>
        <Link to="/documents">Open My Documents</Link>
      </div>

      <br />

      <div>
        <h3>Upload Document</h3>
        <p>Upload a new document securely.</p>
        <Link to="/upload">Open Upload Document</Link>
      </div>

      <br />

      <div>
        <h3>Account</h3>
        <p>Manage your student account.</p>
      </div>
    </div>
  );
}

export default StudentDashboard;