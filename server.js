var express = require("express");
var app = express();

// Server port
var PORT = 8000;
// Start server
app.listen(PORT, () => {
  console.log("Server running on port %PORT%".replace("%PORT%", PORT));
});

// Root endpoint
app.get("/", (req, res, next) => {
  res.json({ message: "Ok" });
});

// Insert here other API endpoints

// Default response for any other request
app.use(function (req, res) {
  res.status(404);
});
