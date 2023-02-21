import express from "express";
import db from "./database.js";
import validator from "validator";
import _ from "lodash";

const app = express();
const PORT = 8000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
      res.status(200).json({
        message: "success",
        data: rows,
      });
      // TODO: POPULATE WITH SKILLS
    });
  });
});

//User Information Endpoint
app.get("/users/:userID", (req, res, next) => {
  let userID = req.params.userID;
  console.log(`GET - /users/${userID}"`);

  //Input Validation
  if (!validator.isInt(userID)) {
    console.log("\tInvalid Input");
    res
      .status(400)
      .json({ message: "Invalid user ID format, user IDs are integers" });
    return;
  }

  userID = parseInt(userID);

  const userSql = `
      SELECT *
      FROM user
      WHERE user_id = ? `;

  const params = [userID];

  db.get(userSql, params, (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }

    if (!row) {
      res.status(200).json({ message: "No user found" });
      return;
    }

    let out = row;

    const skillSql = `
      SELECT skill, rating
      FROM skill
      WHERE user_id = ?`;

    db.all(skillSql, params, (err, rows) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }

      out.skills = rows;

      res.status(200).json({
        message: "success",
        data: out,
      });
      return;
    });
  });
});

//Updating User Data Endpoint
app.put("/users/:userID", (req, res, next) => {
  //Input Validation
  //TODO: Validate that no other key value pairs are there
  updatedName = req.body.name;
  updatedCompany = req.body.company;
  updatedEmail = req.body.email;
  updatedPhone = req.body.phone;
  updatedSkills = req.body.skills;

  if (!_.isString(updatedName)) {
    res.status(400).json({ message: "Names must be a string." });
    return;
  }

  if (!_.isString(updatedCompany)) {
    res.status(400).json({ message: "Company must be a string." });
    return;
  }

  if (!validator.isEmail(email)) {
    res.status(400).json({ message: "Invalid email." });
    return;
  }

  //TODO: CAN WE VALIDATE THIS MORE?
  if (!_.isString(updatedPhone)) {
    res.status(400).json({ message: "Phone number must be a string." });
    return;
  }

  //TODO: VALIDATE SKILLS
  //TODO: UPDATE SKILLS

  const userID = parseInt(req.params.userID);

  const sql = `
    UPDATE user 
    SET 
    name = COALESCE(?,name), 
    company = COALESCE(?,company),
    email = COALESCE(?,email), 
    phone = COALESCE(?,phone) 
    WHERE user_id = ?`;

  const params = [
    updatedName,
    updatedCompany,
    updatedEmail,
    updatedPhone,
    userID,
  ];

  db.run(sql, params, (err, result) => {
    if (err) {
      res.status(400).json({ error: res.message });
      return;
    }
    res.status(200).json({
      message: "success",
      result: result,
    });
  });
});

//Delete user endpoint
app.delete("/user/:id", (req, res, next) => {
  let userID = req.params.userID;
  console.log(`DELETE - /users/"${userID}"`);

  //Input Validation
  if (!validator.isInt(userID)) {
    console.log("\tInvalid Input");
    res
      .status(400)
      .json({ message: "Invalid user ID format, user IDs are integers" });
    return;
  }

  userID = parseInt(userID);

  db.run("DELETE FROM user WHERE id = ?", userID, function (err, result) {
    if (err) {
      res.status(400).json({ error: res.message });
      return;
    }
    res.json({ message: "deleted", changes: this.changes });
  });
});

//Skills Endpoints
app.get("/skills/:skill", (req, res, next) => {
  let skillQuery = req.params.skill;
  console.log(`GET - /skills/${skillQuery}"`);

  if (!_.isString(skillQuery)) {
    res.status(400).json({ message: "Skill names must be a string." });
    return;
  }

  skillQuery = skillQuery.toLowerCase();

  //TO DO VALIDATE INPUTS

  db.serialize(() => {
    const sql = `
      SELECT COUNT(*)
      FROM skill
      WHERE LOWER(skill) = ?`;

    db.get(sql, [skillQuery], (err, count) => {
      if (err) {
        res.status(400).json({ error: err.message });
        return;
      }
      res.status(200).json({
        message: "success",
        count: count["COUNT(*)"],
      });
      // TODO: POPULATE WITH SKILLS
    });
  });
});

// Query parameter filtering - minimum/maximum frequency

// Insert here other API endpoints

// Root endpoint
app.use("/", (req, res, next) => {
  res.status(200).json({ message: "Ok" });
});

// Start server
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}/`)
);
