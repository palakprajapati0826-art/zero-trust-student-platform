import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function MyDocuments() {
  const navigate = useNavigate();

  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDocuments = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/");
        return;
      }

      try {
        const response = await fetch(
          "http://localhost:5000/api/student/documents",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          if (response.status === 401) {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            navigate("/");
            return;
          }

          setError(data.message || "Unable to load documents.");
          return;
        }

        setDocuments(data.documents || []);
      } catch (error) {
        console.error("Get documents error:", error);

        setError(
          "Unable to connect to the server. Please make sure the backend is running."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDocuments();
  }, [navigate]);

  const formatFileSize = (bytes) => {
    if (!bytes) return "0 KB";

    const kb = bytes / 1024;

    if (kb < 1024) {
      return `${kb.toFixed(2)} KB`;
    }

    return `${(kb / 1024).toFixed(2)} MB`;
  };

  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleString();
  };

  const handleDownload = async (documentId, fileName) => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/student/documents/${documentId}/download`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const data = await response.json();

        if (response.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          navigate("/");
          return;
        }

        alert(data.message || "Download failed.");
        return;
      }

      const blob = await response.blob();

      const downloadUrl = window.URL.createObjectURL(blob);

      const link = document.createElement("a");

      link.href = downloadUrl;
      link.download = fileName;

      document.body.appendChild(link);

      link.click();

      link.remove();

      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error("Download error:", error);

      alert("Unable to download the document.");
    }
  };

  if (loading) {
    return (
      <div>
        <h1>My Documents</h1>
        <p>Loading your documents...</p>
      </div>
    );
  }

  return (
    <div>
      <h1>My Documents</h1>

      <h2>Uploaded Documents</h2>

      {error && (
        <p style={{ color: "red" }}>
          {error}
        </p>
      )}

      {!error && documents.length === 0 && (
        <p>No documents uploaded yet.</p>
      )}

      {!error && documents.length > 0 && (
        <table border="1" cellPadding="10">
          <thead>
            <tr>
              <th>Document Name</th>
              <th>File Type</th>
              <th>File Size</th>
              <th>Upload Date</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {documents.map((document) => (
              <tr key={document.id}>
                <td>{document.originalName}</td>

                <td>{document.mimeType}</td>

                <td>{formatFileSize(document.fileSize)}</td>

                <td>{formatDate(document.createdAt)}</td>

                <td style={{ color: "green" }}>
                  Uploaded
                </td>

                <td>
                  <button
                    onClick={() =>
                      handleDownload(
                        document.id,
                        document.originalName
                      )
                    }
                  >
                    Download
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <br />

      <Link to="/upload">
        Upload Another Document
      </Link>

      <br />
      <br />

      <button onClick={() => navigate("/dashboard")}>
        Back to Dashboard
      </button>
    </div>
  );
}

export default MyDocuments;