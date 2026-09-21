const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const studentRoutes = require("./routes/studentRoutes");

const app = express();

app.use(cors());
app.use(express.json());

connectDB();

app.get("/", (req, res) => {
  res.send("Zero Trust Student Platform Backend Running");
});

app.use("/api/auth", authRoutes);
app.use("/api/student", studentRoutes);

app.listen(5000, () => {
  console.log("Server running on port 5000");
});