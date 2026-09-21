function UploadDocument() {
  return (
    <div>
      <h1>Upload Document</h1>

      <h2>Secure Document Upload</h2>

      <form>
        <label>
          Select Document:
          <br />
          <input type="file" />
        </label>

        <br />
        <br />

        <button type="submit">Upload Document</button>
      </form>
    </div>
  );
}

export default UploadDocument;