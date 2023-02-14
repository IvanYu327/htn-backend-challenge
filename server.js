import express from "express";
import db from "./database.js";

const app = express();

// Server port
const PORT = 8000;
// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Root endpoint
app.get("/", (req, res, next) => {
  res.json({ message: "Ok" });
});

//All Users Endpoint
app.get("/api/users", (req, res, next) => {
  const sql = "SELECT * FROM user";
  const params = [];
  db.all(sql, params, (err, rows) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({
      message: "success",
      data: rows,
    });
  });
});

//User Information Endpoint

//Updating User Data Endpoint

//Skills Endpoints
// These endpoint should show a list of skills and aggregate info about them. Note that in the context of your hackathon, users do not gain/lose skills very often.

// Try to implement the following (in SQL or with an ORM):

// Number of users with each skill (frequency)
// Query parameter filtering - minimum/maximum frequency

// Insert here other API endpoints

// Default response for any other request
app.use(function (req, res) {
  res.status(404);
});
