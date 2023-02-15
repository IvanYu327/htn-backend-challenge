import express from "express";
import db from "./database.js";

const app = express();
const PORT = 8000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(routes)

//All Users Endpoint
app.get("/users", (req, res, next) => {
  db.serialize(() => {
    const sql = `
      SELECT *
      FROM user`;

    // const sql = `
    //   SELECT *
    //   FROM user, skill
    //   WHERE skill.user_id=user.user_id
    // `;
    db.all(sql, [], (err, rows) => {
      if (err) {
        res.status(400).json({ error: err.message });
        return;
      }
      res.json({
        status: 200,
        message: "success",
        data: rows,
      });
      // TODO: POPULATE WITH SKILLS
    });
  });
});

//User Information Endpoint
app.get("/users/:userID", (req, res, next) => {
  const userID = parseInt(req.params.userID);

  if (!userID) {
    res.json({
      status: 400,
      message: "Invalid user ID",
    });
    return;
  }
  //TODO VERIFY ID

  db.serialize(() => {
    const userSql = `
      SELECT *
      FROM user
      WHERE user_id = ?`;

    const params = [userID];
    let out;

    db.get(userSql, params, (err, row) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }

      if (row) out = row;
      else {
        res.json({
          status: 400,
          message: "No user found",
          data: out,
        });
        return;
      }
    });

    const skillSql = `
      SELECT skill, rating
      FROM skill
      WHERE user_id = ?`;

    db.all(skillSql, params, (err, rows) => {
      if (err) {
        res.status(400).json({ error: err.message });
        return;
      }

      out.skills = rows;

      res.json({
        status: 200,
        message: "success",
        data: out,
      });
    });
  });
});

//Updating User Data Endpoint
app.patch("/users/:userID", (req, res, next) => {
  const updateData = {
    name: req.body.name,
    company: req.body.password,
    email: req.body.email,
    phone: req.body.phone,
  };
  const userID = parseInt(req.params.userID);
  //TO DO VALIDATE INPUTS

  const sql = `
    UPDATE user 
    SET 
    name = COALESCE(?,name), 
    company = COALESCE(?,company),
    email = COALESCE(?,email), 
    phone = COALESCE(?,phone) 
    WHERE user_id = ?`;

  const params = [
    updateData.name,
    updateData.company,
    updateData.email,
    updateData.phone,
    userID,
  ];

  console.log(params);
  db.run(sql, params, (err, result) => {
    if (err) {
      res.status(400).json({ error: res.message });
      return;
    }
    res.json({
      message: "success",
      result: result,
    });
  });
});

//Delete user endpoint
app.delete("/api/user/:id", (req, res, next) => {
  const userID = parseInt(req.params.userID);
  //TO DO VALIDATE INPUTS

  db.run("DELETE FROM user WHERE id = ?", userID, function (err, result) {
    if (err) {
      res.status(400).json({ error: res.message });
      return;
    }
    res.json({ message: "deleted", changes: this.changes });
  });
});

//Skills Endpoints
// These endpoint should show a list of skills and aggregate info about them.
// Note that in the context of your hackathon, users do not gain/lose skills
// very often.

// Try to implement the following (in SQL or with an ORM):

// Number of users with each skill (frequency)
// Query parameter filtering - minimum/maximum frequency

// Insert here other API endpoints

// Root endpoint
app.use("/", (req, res, next) => {
  res.json({ message: "Ok" });
});

// Default response for any other request
app.use(function (req, res) {
  res.status(404);
});

// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
