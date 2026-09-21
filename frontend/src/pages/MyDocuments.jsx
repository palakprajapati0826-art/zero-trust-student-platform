function MyDocuments() {
  return (
    <div>
      <h1>My Documents</h1>

      <h2>Uploaded Documents</h2>

      <p>Your uploaded documents will appear here.</p>

      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>Document Name</th>
            <th>Upload Date</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          <tr>
            <td>No documents uploaded yet</td>
            <td>-</td>
            <td>-</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default MyDocuments;