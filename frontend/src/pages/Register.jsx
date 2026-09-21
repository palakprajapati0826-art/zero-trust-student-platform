function Register() {
  return (
    <div>
      <h1>Zero Trust Student Platform</h1>

      <h2>Register</h2>

      <form>
        <label>
          Full Name:
          <br />
          <input
            type="text"
            placeholder="Enter your full name"
          />
        </label>

        <br />
        <br />

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
            placeholder="Create a password"
          />
        </label>

        <br />
        <br />

        <button type="submit">Register</button>
      </form>
    </div>
  );
}

export default Register;