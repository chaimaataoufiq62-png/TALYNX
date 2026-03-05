const express = require("express");

const app = express();

// route test
app.get("/", (req, res) => {
  res.send("SmartMatch API is running");
});

const PORT = 5000;

app.listen(PORT, () => {
  console.log("Server running on port ${PORT}");
});