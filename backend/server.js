const express = require("express");
const cors = require("cors");
require("dotenv").config();

const db = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const candidateRoutes = require("./routes/candidateRoutes");
const companyRoutes = require("./routes/companyRoutes");
const matchingRoutes = require("./routes/matchingRoutes");
const submissionRoutes = require("./routes/submissionRoutes");
const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/candidate", candidateRoutes);
app.use("/api/company", companyRoutes);
app.use("/api", matchingRoutes);
app.use("/api", submissionRoutes);
// Test route
app.get("/", (req, res) => {
  res.status(200).send("SmartMatch API is running");
});

// Vérification connexion base de données
async function startServer() {
  try {
    const connection = await db.getConnection();
    console.log("Database connected successfully");
    connection.release();

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Database connection failed:", error.message);
  }
}

startServer();

module.exports = app;