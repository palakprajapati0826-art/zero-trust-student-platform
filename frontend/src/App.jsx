import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Register from "./pages/Register";
import StudentDashboard from "./pages/StudentDashboard";
import UploadDocument from "./pages/UploadDocument";
import MyDocuments from "./pages/MyDocuments";

function Login() {
  return (
    <div>
      <h1>Zero Trust Student Platform</h1>

      <h2>Login</h2>

      <form>
        <label>
          Email:
          <br />
          <input
            type="email"
            placeholder="Enter your email"
          />
        </label>

        <br />
        <br />

        <label>
          Password:
          <br />
          <input
            type="password"
            placeholder="Enter your password"
          />
        </label>

        <br />
        <br />

        <button type="submit">Login</button>
      </form>

      <p>
        Don't have an account?{" "}
        <Link to="/register">Register</Link>
      </p>

      <p>
        <Link to="/dashboard">Student Dashboard</Link>
      </p>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<StudentDashboard />} />
        <Route path="/upload" element={<UploadDocument />} />
        <Route path="/documents" element={<MyDocuments />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;