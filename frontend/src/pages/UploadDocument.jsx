import { useState } from "react";
import { useNavigate } from "react-router-dom";

function UploadDocument() {
  const navigate = useNavigate();

  const [selectedFile, setSelectedFile] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFileChange = (event) => {
    const file = event.target.files[0] || null;

    setSelectedFile(file);
    setMessage("");
    setError("");
  };

  const handleUpload = async (event) => {
    event.preventDefault();

    setMessage("");
    setError("");

    const token = localStorage.getItem("token");

    if (!token) {
      setError("You are not logged in. Please login first.");
      navigate("/");
      return;
    }

    if (!selectedFile) {
      setError("Please select a document first.");
      return;
    }

    if (selectedFile.size > 5 * 1024 * 1024) {
      setError("File size must be less than or equal to 5 MB.");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("document", selectedFile);

      const response = await fetch(
        "http://localhost:5000/api/student/documents/upload",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");

          setError("Your login session has expired. Please login again.");

          setTimeout(() => {
            navigate("/");
          }, 1500);

          return;
        }

        setError(data.message || "Document upload failed.");
        return;
      }

      setMessage(data.message || "Document uploaded successfully!");

      setSelectedFile(null);

      event.target.reset();
    } catch (error) {
      console.error("UPLOAD ERROR:", error);

      setError(
        "Unable to connect to the server. Please make sure the backend is running."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-container">

      {/* Header */}
      <header className="dashboard-header">
        <div className="dashboard-brand">
          Zero Trust Student Platform
        </div>

        <button
          className="secondary-button"
          onClick={() => navigate("/dashboard")}
        >
          Dashboard
        </button>
      </header>

      {/* Upload Content */}
      <main className="upload-container">

        <div className="upload-card">

          <h1>Upload Document</h1>

          <p
            style={{
              color: "#6b7280",
              marginBottom: "25px",
            }}
          >
            Securely upload your academic documents using
            your authenticated student account.
          </p>

          <form onSubmit={handleUpload}>

            <div className="form-group">

              <label>
                Select Document
              </label>

              <input
                className="file-input"
                type="file"
                onChange={handleFileChange}
              />

            </div>

            {selectedFile && (
              <div
                style={{
                  padding: "15px",
                  background: "#f8fafc",
                  borderRadius: "10px",
                  marginBottom: "20px",
                }}
              >
                <strong>Selected File:</strong>

                <p
                  style={{
                    margin: "6px 0 0",
                    color: "#475569",
                  }}
                >
                  📄 {selectedFile.name}
                </p>

                <p
                  style={{
                    margin: "4px 0 0",
                    color: "#64748b",
                    fontSize: "14px",
                  }}
                >
                  Size:{" "}
                  {(selectedFile.size / 1024).toFixed(2)} KB
                </p>
              </div>
            )}

            <div
              style={{
                padding: "14px",
                background: "#eff6ff",
                borderRadius: "9px",
                marginBottom: "20px",
                color: "#1e40af",
                fontSize: "14px",
              }}
            >
              <strong>Security:</strong>

              <br />

              Maximum file size: 5 MB

              <br />

              Allowed formats: PDF, TXT, DOC, DOCX, XLS, XLSX,
              PPT and PPTX
            </div>

            <button
              className="primary-button"
              type="submit"
              disabled={loading}
            >
              {loading ? "Uploading..." : "Upload Document"}
            </button>

          </form>

          {message && (
            <div className="success-message">
              {message}
            </div>
          )}

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <div
            style={{
              marginTop: "25px",
              display: "flex",
              gap: "12px",
              flexWrap: "wrap",
            }}
          >

            <button
              className="secondary-button"
              onClick={() => navigate("/documents")}
            >
              My Documents
            </button>

            <button
              className="secondary-button"
              onClick={() => navigate("/dashboard")}
            >
              Back to Dashboard
            </button>

          </div>

        </div>

      </main>

    </div>
  );
}

export default UploadDocument;