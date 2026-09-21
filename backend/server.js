const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Zero Trust Student Platform Backend Running");
});

const startServer = async () => {
  try {
    await connectDB();

    app.listen(5000, "127.0.0.1", () => {
      console.log("Server running on http://127.0.0.1:5000");
    });
  } catch (error) {
    console.error("Server startup failed:", error.message);
    process.exit(1);
  }
};

startServer();
