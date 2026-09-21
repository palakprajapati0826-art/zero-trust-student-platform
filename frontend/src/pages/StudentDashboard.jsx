import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function StudentDashboard() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyUser = async () => {
      const token = localStorage.getItem("token");

      // No token = not logged in
      if (!token) {
        navigate("/");
        return;
      }

      try {
        const response = await fetch(
          "http://localhost:5000/api/student/profile",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        // Invalid or expired token
        if (!response.ok) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          navigate("/");
          return;
        }

        // Valid token
        setUser(data.user);
      } catch (error) {
        console.error("Authentication verification error:", error);

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/");
      } finally {
        setLoading(false);
      }
    };

    verifyUser();
  }, [navigate]);

  // Authentication check in progress
  if (loading) {
    return (
      <div>
        <h1>Checking authentication...</h1>
      </div>
    );
  }

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/");
  };

  return (
    <div>
      <h1>Student Dashboard</h1>

      <h2>Welcome to Zero Trust Student Platform</h2>

      {user && (
        <p>
          Logged in as: <strong>{user.userId}</strong>
        </p>
      )}

      <p>Manage your documents and account from here.</p>

      <div>
        <h3>My Documents</h3>

        <p>View and manage your uploaded documents.</p>

        <Link to="/documents">
          Open My Documents
        </Link>
      </div>

      <br />

      <div>
        <h3>Upload Document</h3>

        <p>Upload a new document securely.</p>

        <Link to="/upload">
          Open Upload Document
        </Link>
      </div>

      <br />

      <div>
        <h3>Account</h3>

        <p>Manage your student account.</p>

        <button onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
}

export default StudentDashboard;